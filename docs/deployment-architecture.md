# MirrorTale Deployment Architecture

## Decision

Use Firebase Hosting for the landing page and a separate Cloud Run service for all order, payment, upload, and generation orchestration.

This keeps the public website fast and cacheable while the backend owns every secret-bearing action: Stripe, Firebase Admin, Cloud Storage writes, Firestore writes, email delivery, and calls into `nelu-droid/mirrortale-engine`.

## Services

- Firebase Hosting: serves `index.html`, `styles.css`, `script.js`, and `assets/` on `mirrortale.com`.
- Cloud Run API: exposes public HTTPS endpoints for `/orders` and `/contact`.
- Firestore: stores order records, contact messages, payment state, generation state, delivery metadata, and audit timestamps.
- Cloud Storage: stores original uploads and generated book files under private buckets.
- Stripe or chosen PSP: creates checkout sessions and sends signed webhooks to Cloud Run.
- `mirrortale-engine`: runs behind Cloud Run as the generation worker or as a callable internal service. It should not be called from the browser.

## Order Flow

1. Parent submits the landing-page intake form.
2. Browser posts `multipart/form-data` to Cloud Run `POST /orders`.
3. Cloud Run validates fields and image constraints.
4. Cloud Run writes the photo to Cloud Storage and creates a Firestore order with status `draft`.
5. Cloud Run creates a checkout session and returns `checkoutUrl`.
6. Browser redirects to hosted checkout.
7. Payment webhook marks the order `paid` and starts generation.
8. The engine creates the book from the private order payload and upload.
9. Generated PDF and print assets are written to Cloud Storage.
10. Cloud Run or a worker sends the customer delivery email and updates Firestore to `delivered`.

## Firestore Shape

Suggested first collection:

```text
orders/{orderId}
  parentName
  email
  childName
  childAge
  childGender
  theme
  interests
  dedication
  package
  status: draft | checkout_started | paid | generating | review | delivered | failed
  uploadPath
  generatedPdfPath
  checkoutSessionId
  paymentProvider
  createdAt
  updatedAt
```

Contact messages can live in:

```text
contactMessages/{messageId}
```

## Deployment Steps

1. Create or select a Firebase/GCP project for production.
2. Copy `.firebaserc.example` to `.firebaserc` and replace `mirrortale-prod` with the real project ID.
3. Deploy the backend service from `nelu-droid/mirrortale-engine` to Cloud Run.
4. Point `api.mirrortale.com` at the Cloud Run service, or use the generated `run.app` URL temporarily.
5. Set `<meta name="mirrortale-api-base-url" ...>` in `index.html`.
6. Deploy the landing page:

```powershell
firebase deploy --only hosting
```

7. Connect `mirrortale.com` and `www.mirrortale.com` in Firebase Hosting.

## Security Notes

- Never put AI keys, service-account keys, Stripe secrets, or Firebase Admin credentials in this repo.
- Validate file type, file size, and image dimensions in Cloud Run before storing uploads.
- Store uploads and generated PDFs in private Cloud Storage buckets.
- Use signed download URLs or authenticated delivery links only after payment is confirmed.
- Verify Stripe webhooks with the provider signing secret inside Cloud Run.
- Keep CORS limited to the production domains and explicit local dev origins.
