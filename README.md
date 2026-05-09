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
- `styles.css` - visual system, responsive layout, animations, book preview styling.
- `script.js` - FAQ, reveal effects, package selection, sticky CTA, and book preview behavior.
- `assets/` - local visual assets for hero, proof flow, covers, and book pages.
- `snapshots/` - restore checkpoints from previous design passes.

## Next Phase

The public website should stay separate from the book-generation engine. The intake form should eventually submit to a backend/API that handles payment, secure uploads, and generation orchestration. Browser code should never call AI Studio or model APIs directly with secret keys.
