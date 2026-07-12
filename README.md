# MirrorTale Landing Page

Static mobile-first landing page for MirrorTale, a premium personalized children's book brand with digital and print package checkout.

## MirrorTale System Map

This repo is intentionally separate from
[`nelu-droid/mirrortale-engine`](https://github.com/nelu-droid/mirrortale-engine).
Firebase Hosting serves this static public site, while the engine owns checkout,
private uploads, admin review, generation, fulfillment, and every
secret-bearing integration.

See `docs/project-map.md` for the repo boundaries, runtime contract, and
marketing cover-generation bridge.

## Local Preview

Run a simple local server from this folder:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Project Structure

- `index.html` - landing page markup, icons, form, book preview data.
- `privacy.html`, `terms.html`, `checkout-success.html` - paid intake support pages.
- `styles.css` - visual system, responsive layout, animations, book preview styling.
- `script.js` - FAQ, reveal effects, package selection, sticky CTA, and book preview behavior.
- `assets/` - local visual assets for hero, proof flow, covers, and book pages.
- `docs/` - project map, deployment architecture, and backend API contract.
- `marketing-automation/` - local organic TikTok/Instagram slideshow factory and review-gated batch tools.
- `../marketing-output/` - local generated social packages outside the repo.
- `snapshots/` - historical restore checkpoints from previous design passes, not active app source.

## Analytics

GA4 is configured through the `ga4-measurement-id` meta tag on each public HTML page and the shared `analytics.js` module. Analytics only loads after the visitor accepts the consent banner. The site tracks pageviews plus non-personal events such as CTA clicks, package selection, photo selected, checkout start/redirect, checkout success, contact form submission, language changes, and book preview interactions.

## Next Phase

The public website stays separate from the book-generation engine. Firebase Hosting serves this static repo, while Cloud Run handles payment, secure uploads, Stripe shipping collection for print packages, Firestore order records, Cloud Storage files, and calls into `nelu-droid/mirrortale-engine`.

See:

- `docs/project-map.md`
- `docs/deployment-architecture.md`
- `docs/backend-contract.md`

Live form submission posts to the Cloud Run API set in the `mirrortale-api-base-url` meta tag in `index.html`. If it is blank, the forms keep their local mock behavior.
