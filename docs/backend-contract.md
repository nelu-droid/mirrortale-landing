# MirrorTale Backend Contract

The landing page stays static on Firebase Hosting. It only calls public Cloud Run HTTPS endpoints and never receives AI, Stripe, Firebase Admin, or service-account secrets.

## Runtime Configuration

Set the API base URL in `index.html` once the Cloud Run API is deployed:

```html
<meta name="mirrortale-api-base-url" content="https://api.mirrortale.com" />
```

For local experiments, the same value can be supplied before `script.js`:

```html
<script>
  window.MirrorTaleConfig = { apiBaseUrl: "http://localhost:8080" };
</script>
```

If no API base URL is configured, both forms keep the current mock behavior.

## `POST /orders`

Creates a digital or Digital + Print order, stores the child photo securely, creates a Stripe Checkout session, and returns the checkout URL.

Request:

- Content type: `multipart/form-data`
- Fields: `parent-name`, `email`, `child-name`, `gender`, `age`, `theme`, `interests`, `dedication`, `package=digital|print`, `photo-consent=accepted`
- Optional field: `book-language=en|nl|fr|de|es|it|pt`
  - Missing or blank defaults to `en` for backwards compatibility.
  - Invalid values should return `400`.
  - All engine instructions and image prompts stay English; only customer-visible generated book text uses the selected language.
  - The dedication is preserved exactly as typed.
- File: `child-photo`
  - Accept normal camera-roll photo uploads, including JPG, PNG, HEIC/HEIF,
    WebP, and other safe raster image formats when decodable.
  - Convert accepted originals to a backend-safe JPG or PNG before storage or
    engine handoff.
  - Reject SVG and non-image files.
- Stripe behavior:
  - `package=digital` uses the digital price and does not collect shipping.
  - `package=print` uses the print price and must collect a shipping address in Stripe Checkout.
- Optional marketing attribution fields from organic social links:
  `marketing_firstTouch_utm_source`, `marketing_firstTouch_utm_medium`,
  `marketing_firstTouch_utm_campaign`, `marketing_firstTouch_utm_content`,
  `marketing_firstTouch_creative_id`, `marketing_firstTouch_landing_url`,
  `marketing_firstTouch_referrer`, and matching `marketing_lastTouch_*`
  fields. Unknown attribution fields should be stored if convenient and ignored
  safely otherwise.

Successful response:

```json
{
  "orderId": "ord_123",
  "status": "checkout_started",
  "checkoutUrl": "https://checkout.stripe.com/..."
}
```

Errors should use:

```json
{
  "error": {
    "message": "Please upload one valid child photo image."
  }
}
```

## `POST /contact`

Stores a pre-order question and sends an owner notification through Resend when configured.

Request:

```json
{
  "name": "Parent name",
  "email": "parent@example.com",
  "message": "Question text",
  "source": {
    "page": "https://mirrortale.com/",
    "referrer": null,
    "attribution": {
      "firstTouch": {
        "utm_source": "tiktok",
        "utm_medium": "organic_social",
        "utm_campaign": "organic_routine_storybooks",
        "utm_content": "mt-2026w20-001",
        "creative_id": "mt-2026w20-001"
      },
      "lastTouch": {
        "utm_source": "instagram",
        "utm_medium": "organic_social",
        "utm_campaign": "organic_routine_storybooks",
        "utm_content": "mt-2026w20-004",
        "creative_id": "mt-2026w20-004"
      }
    }
  }
}
```

Successful response:

```json
{
  "status": "received"
}
```

## `POST /stripe/webhook`

Accepts Stripe webhook events only. The backend verifies the `Stripe-Signature` header against `STRIPE_WEBHOOK_SECRET`, marks completed checkout sessions as `paid`, stores shipping details for print orders, and records email delivery state after sending confirmation/owner notifications.

Successful response:

```json
{
  "received": true
}
```

## Print Fulfillment Fields

Print orders should keep digital generation and delivery separate from physical fulfillment:

```text
orders/{orderId}
  package: digital | print
  status: paid | generating | needs_review | approved | delivered | print_ready | print_ordered | print_shipped | print_delivered | print_blocked | failed
  fulfillment.type: digital | print
  fulfillment.digitalStatus
  fulfillment.printStatus: waiting_for_pdfs | ready_to_order | ordered | shipped | delivered | blocked | not_applicable
  shipping.name
  shipping.phone
  shipping.address
  print.status
  print.checklist.pdfsVerified
  print.checklist.shippingAddressChecked
  print.checklist.printOrderPlaced
  print.checklist.trackingAdded
  print.printOrderId
  print.luluOrderId
  print.trackingUrl
```

Studio owns manual print updates through `POST /api/admin/orders/:orderId/print-fulfillment`. Lulu API automation stays out of scope for this pass.

## CORS

Allow these origins in Cloud Run:

- `https://mirrortale.com`
- `https://www.mirrortale.com`
- Firebase preview channels as needed
- `http://localhost:8000` for local landing-page tests

Do not allow wildcard origins on payment or upload endpoints once production traffic starts.
