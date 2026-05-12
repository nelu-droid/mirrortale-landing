# MirrorTale Landing Page

Static mobile-first landing page mockup for MirrorTale, a premium personalized children's book brand.

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
- `snapshots/` - restore checkpoints from previous design passes.

## Next Phase

The public website stays separate from the book-generation engine. Firebase Hosting serves this static repo, while Cloud Run handles payment, secure uploads, Firestore order records, Cloud Storage files, and calls into `nelu-droid/mirrortale-engine`.

See:

- `docs/deployment-architecture.md`
- `docs/backend-contract.md`

Live form submission posts to the Cloud Run API set in the `mirrortale-api-base-url` meta tag in `index.html`. If it is blank, the forms keep their local mock behavior.
