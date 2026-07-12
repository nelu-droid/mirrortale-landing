# MirrorTale V3 Homepage and Creation Flow Specification

Status: Ready for implementation planning
Date: 2026-07-10
Surfaces: `mirrortale.com/` and `mirrortale.com/create`
Source audit: `audit/mirrortale-com-2026-07-10/audit-report.md`

## 1. Product outcome

V3 should help a parent or gift buyer understand the product, inspect its quality, trust the photo-handling process, understand the price, and begin creating a book without feeling overwhelmed.

The homepage is the sales journey. `/create` is the data-entry and checkout journey.

The redesign must preserve:

- The core promise: the child's face and world, not only their name.
- The premium enchanted-storybook visual identity.
- Existing photo-to-character proof, book covers, interior pages, and hardcover imagery.
- Visible pricing.
- Digital delivery in 24–48 hours and human review.
- The current public `POST /orders` contract unless a dependency is called out explicitly.
- English, Dutch, French, and German site languages, plus the current book-language choices.

The redesign must remove:

- The full intake form from the homepage.
- The full contact form from the homepage.
- Duplicate trust grids and intermediate CTA strips.
- Individually decorated navigation pills.
- Simultaneous top and bottom persistent CTAs on mobile.
- New visual “polish passes” layered onto the current stylesheet.

## 2. Success criteria

### Customer outcomes

- A new visitor can explain what MirrorTale sells after the first viewport.
- The primary CTA, starting price, and digital turnaround are visible without scrolling at 1280 × 720 and 390 × 844.
- A visitor can inspect at least six representative book pages without relying on gesture-only controls.
- Package contents, VAT treatment, shipping treatment, and delivery expectations are visible before personal information is submitted.
- The creation journey is divided into five comprehensible steps with visible progress.
- A user can correct errors without hunting across the page.

### Quality outcomes

- Target WCAG 2.2 AA for the public sales and creation flows.
- All controls are usable with keyboard alone.
- All visible and assistive copy is localized together.
- Motion respects `prefers-reduced-motion`.
- No child name, photo filename, story content, email address, or dedication is sent to analytics.
- Homepage and creation-flow CSS use one authoritative component definition each.

### Measurement outcomes

Track:

- Homepage primary CTA click-through.
- Example-book preview engagement.
- Pricing-package selection.
- `/create` start rate.
- Completion and error rate by step.
- Photo-upload failure rate by safe error category.
- Checkout-start rate.
- Checkout-success rate.

Do not use heuristic scores as launch criteria. Compare the funnel before and after release.

## 3. Information architecture

| Route | Purpose | Primary action |
|---|---|---|
| `/` | Explain, prove, reassure, price, convert | Create Their Book |
| `/create` | Collect personalization details and begin checkout | Continue / Proceed to Secure Checkout |
| `/privacy` | Explain data and photo handling | Return to creation |
| `/terms` | Purchase and service terms | Return to creation |
| `/contact` | Optional dedicated support form using the existing `/contact` API | Send question |
| `/checkout-success` | Confirm payment handoff and explain what happens next | Return home |

Implementation note: create `create.html`; Firebase Hosting's existing `cleanUrls: true` setting exposes it as `/create`.

## 4. Design-system foundation

### 4.1 Visual principle

MirrorTale should feel like a premium publishing studio with magic inside it. The books provide the strongest visual magic; the interface provides clarity.

Use three visual levels only:

1. Editorial content: open layout with no container.
2. Supporting surface: dark-teal panel with one restrained border.
3. Primary action: warm orange treatment with a controlled glow.

Reserve animated or high-glow treatment for the hero book, the preview, and the final CTA. Navigation, form fields, FAQ rows, and ordinary information cards stay quiet.

### 4.2 Tokens

#### Color

| Token | Value | Use |
|---|---:|---|
| `--color-night` | `#07161D` | Page background |
| `--color-deep-teal` | `#102B2E` | Supporting surfaces |
| `--color-forest` | `#1F4B3B` | Selected or positive surface |
| `--color-teal` | `#1C6D70` | Secondary accent |
| `--color-gold` | `#D99435` | Small decorative accent |
| `--color-gold-soft` | `#F0C76B` | Dividers and highlights |
| `--color-cream` | `#FFF1D0` | Primary text on dark |
| `--color-paper` | `#F8E4B7` | One optional editorial proof section |
| `--color-ink` | `#102B2E` | Text on paper |
| `--color-error` | `#FF8F77` | Errors with text and icon |
| `--color-success` | `#78E4B8` | Success with text and icon |

Primary CTA is the only gradient control:

`linear-gradient(180deg, #FFC56F 0%, #F27A21 48%, #B84013 100%)`

Do not use gold as an outline around every component.

#### Typography

| Style | Desktop | Mobile | Typeface |
|---|---|---|---|
| Display 1 | `clamp(3rem, 5.4vw, 4.5rem)` / `0.98` | `2.625rem` / `1.02` | Fraunces |
| Display 2 | `clamp(2.5rem, 4vw, 3.5rem)` / `1.02` | `2.125rem` / `1.08` | Fraunces |
| Heading 3 | `1.5rem` / `1.2` | `1.375rem` / `1.2` | Fraunces |
| Lead | `1.25rem` / `1.5` | `1.125rem` / `1.5` | Alegreya Sans |
| Body | `1.0625rem` / `1.55` | `1rem` / `1.55` | Alegreya Sans |
| UI label | `1rem` / `1.25` | `1rem` / `1.25` | Alegreya Sans, 600 |
| Supporting text | `0.9375rem` / `1.45` | `0.9375rem` / `1.45` | Alegreya Sans |

Use one expressive serif for headings and Alegreya Sans for interface and body copy. Avoid italic body text, multi-color headlines, and repeated bold phrases inside paragraphs.

#### Spacing and geometry

- Spacing scale: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128px`.
- Content maximum: `1200px`.
- Reading-copy maximum: `680px`.
- Desktop gutter: `32px`; tablet: `24px`; mobile: `20px`.
- Section padding: `96px` desktop; `72px` tablet; `56px` mobile.
- Button radius: `12px`.
- Card radius: `18px`.
- Large feature radius: `24px`.
- Pill radius: reserved for tags, progress labels, and compact filters.
- Minimum interactive target: `44 × 44px`.
- Primary button height: `52px`; compact header control: `44px`.

#### Breakpoints

- Mobile: `0–639px`.
- Tablet: `640–959px`.
- Desktop: `960px+`.
- Wide content remains capped at `1200px`.

Do not add component-specific breakpoints unless the component demonstrably breaks at an intermediate width.

## 5. Homepage specification

### 5.1 Header

#### Desktop

- Height: `76px`.
- Sticky after the initial page render.
- Logo: maximum visual width `220px`; remove the large glowing capsule.
- Navigation: plain text links with one quiet hover underline.
- Links: How It Works, Example Book, Pricing, FAQ.
- Language selector: compact globe/menu control, `44px` minimum target.
- Primary CTA: **Create Their Book** → `/create`.

#### Mobile

- One row, `64px` high.
- Logo maximum width `154px`.
- Menu button: `44 × 44px`, accessible name “Open menu.”
- Menu contains navigation, language, privacy, and support.
- No persistent CTA in the top row.
- Bottom sticky CTA appears only after the hero CTA leaves the viewport and hides when pricing, the final CTA, or `/create` is visible.
- Sticky copy: **Create Their Book** / **From €49**.

### 5.2 Hero

#### Purpose

Answer what the product is, why it is different, and what to do next in the first viewport.

#### Copy

- Headline: **Not just their name in a story. Their face in it.**
- Supporting copy: **Created from their photo, favorite things, and world—then checked by a real person before delivery.**
- Primary CTA: **Create Their Book**.
- Secondary action: **See a real book →**.
- Price note: **From €49 · Digital book in 24–48h**.
- Proof row:
  - Recognizable likeness.
  - Human-reviewed.
  - Optional hardcover keepsake.

#### Desktop layout

- Maximum content width: `1200px`.
- Two-column grid: `44% / 56%`.
- Minimum hero height: `calc(100svh - 76px)`, capped at `760px`.
- Copy block maximum width: `560px`.
- Hero actions appear before `620px` from the viewport top at 1280 × 720.
- Use `assets/hero-child-book.webp` or the approved current hero media.
- One small inset may show the real photo → anchor character relationship.
- Remove the separate floating print badge and four large trust cards.

#### Mobile layout

Order:

1. Headline.
2. Short supporting copy.
3. Full-width primary CTA.
4. Secondary text link.
5. Product image.
6. Three compact proof rows.

- No two-column trust cards.
- No animation required for comprehension.
- Keep the hero CTA visible within a 390 × 844 viewport.

### 5.3 Transformation proof

- Section heading: **From their photo to a storybook hero.**
- Use three large visual stages:
  1. Their photo.
  2. Their illustrated likeness.
  3. Their finished book.
- Reuse `proof-photo.webp`, `proof-aiden-anchor.webp`, and a current finished cover/interior asset.
- Desktop: three equal visual columns connected by restrained arrows.
- Mobile: vertical sequence with captions below each image.
- Caption for delivery appears outside the visual chain: **Digital files arrive in 24–48h. Hardcover delivery follows separately.**

### 5.4 Example book preview

- Heading: **See a real MirrorTale book.**
- Supporting copy: **Preview the finished illustration, likeness, story rhythm, and dedication before you begin.**
- Keep the three existing example covers.
- Selected cover must expose `aria-current="true"` or an equivalent selected state.

#### Desktop viewer

- Maximum viewer width: `900px`.
- Visible controls below the page:
  - Previous.
  - Page `n` of `total`.
  - Next.
  - Fullscreen optional.
- Arrow keys change pages while focus is inside the viewer.
- Page changes are announced in a polite live region.
- The page image is not the only interactive target.

#### Mobile viewer

- Show one page at a time.
- Keep Previous, page count, and Next visible.
- Swipe is an enhancement, never the only navigation.
- Preview a curated set: cover, introduction, adventure spread, likeness close-up, emotional moment, ending, dedication, back cover.

### 5.5 How it works

- Heading: **Made in three thoughtful steps.**
- Step 1: **Share their details** — name, interests, story idea, and photo.
- Step 2: **We create and review** — the character and finished pages are checked by a person.
- Step 3: **Receive and keep** — digital files arrive in 24–48h; the optional hardcover follows.
- Use open editorial columns, not glowing cards.

### 5.6 Customer proof

- Heading: **A keepsake families remember.**
- Only publish genuine, permissioned customer proof.
- Preferred content: three short reviews and one real printed-book photo.
- Review metadata: first name or approved initials, relationship to child, verified-purchase marker when true.
- Never invent quotes or use generated portraits as customer evidence.
- If reviews are not ready, replace this section with transparent process evidence: photo → character → finished page → printed book.

### 5.7 What is personalized

- Heading: **More than a name swap.**
- Four compact editorial rows:
  - Their recognizable illustrated likeness.
  - Their favorite things and interests.
  - The setting, routine, or milestone you choose.
  - A dedication written by you.
- Keep copy specific and avoid repeating the same trust claims used elsewhere.

### 5.8 Pricing

- Heading: **Choose the edition that fits the moment.**
- Two balanced cards.

#### Digital — €49

- Personalized storybook.
- Cover-spread PDF and interior-pages PDF.
- Print-ready square `22 × 22cm` format.
- Digital delivery in `24–48h` after payment.
- Human quality review.
- CTA: **Choose Digital** → `/create?package=digital`.

#### Digital + Hardcover — €99 + VAT

- Everything in Digital.
- Premium color hardcover, `22 × 22cm`.
- Europe-first shipping.
- Up to `15 business days` for hardcover arrival.
- Tracked fulfillment updates.
- CTA: **Choose Digital + Hardcover** → `/create?package=print`.

#### Required pricing clarification

- Replace ambiguous `+ VAT` presentation with one of:
  - A VAT-inclusive localized price, or
  - **€99 excluding VAT; VAT calculated from delivery country before checkout.**
- Show whether shipping is included.
- If shipping varies, Step 4 needs a country selector and a public quote response before personal details are submitted.
- Backend dependency if needed: a public non-PII price/quote endpoint or static country-rate configuration.

### 5.9 Privacy and likeness guarantee

- Heading: **Their photo. Your trust.**
- Present four concrete facts, confirmed against the privacy policy:
  - What the photo is used for.
  - Who can access it.
  - How long it is retained. `[LEGAL: confirm timeframe]`
  - Whether it is used for model training. `[LEGAL: confirm exact statement]`
- Include a concise likeness promise without using “guaranteed” unless the commercial terms support it.
- Link to the full Privacy Policy.

### 5.10 FAQ

Keep a maximum of eight questions:

1. What photo works best?
2. How long does the digital book take?
3. What is included in the PDF?
4. How consistent will the likeness be?
5. What happens if the likeness misses the mark?
6. Where do you ship hardcover books?
7. How long does the hardcover take?
8. How are photos and story details handled?

Implementation:

- Each question is an `h3` containing a `button`.
- Button exposes `aria-expanded` and `aria-controls`.
- Panel uses a stable ID and remains in logical reading order.
- Enter and Space toggle the answer.
- Open state is not communicated by color alone.

### 5.11 Final CTA and footer

- Final heading: **Make a story they can keep.**
- Supporting copy: **Start with a few details. We will guide you through the rest.**
- CTA: **Create Their Book** → `/create`.
- Footer contains logo, support email, Privacy, Terms, language, and copyright.
- Move the full contact form to `/contact` only if the form remains valuable.

## 6. `/create` wizard specification

### 6.1 Shell

#### Desktop

- Header height: `64px`.
- Header contains Back to MirrorTale, logo, language selector, and session-save status.
- Main maximum width: `1120px`.
- Content grid: `minmax(0, 720px) 320px` with `48px` gap.
- Left: active step.
- Right: sticky order summary beginning at Step 2.

#### Mobile

- One-column layout.
- Compact progress label: **Step 2 of 5** plus progress bar.
- Order summary becomes a collapsible row above the bottom actions.
- Fixed bottom action region may contain Back and Continue only; it must not cover focused inputs or validation messages.

### 6.2 Progress and navigation

- Five numbered steps with current, complete, and upcoming states.
- Desktop exposes all step names; mobile exposes current step and count.
- Back never clears valid data.
- Continue validates the current step only.
- Browser Back returns to the previous step without leaving `/create` until Step 1.
- Step state may use `history.pushState` and a `?step=` URL parameter.
- Non-sensitive values may be retained in `sessionStorage` for the current tab.
- Do not persist a child photo, child name, dedication, email address, or story details to `localStorage`.
- Keep the photo in memory until order submission; explain when upload begins.

### 6.3 Step 1 — Who is this book for?

Purpose: establish the child and book language with a gentle, low-effort start.

Fields:

| UI label | Backend field | Rules |
|---|---|---|
| Child's name | `child-name` | Required; trim surrounding whitespace; preserve intended accents/case |
| Age | `age` | Required; current allowed values |
| Character presentation | `gender` | Required for current backend compatibility; use supported values only |
| Book language | `book-language` | Required; default to the active site language when supported |

Copy:

- Heading: **Who is this book for?**
- Help: **These details guide the character and the language of the finished story.**
- Continue: **Shape Their Story**.

### 6.4 Step 2 — Shape their story

Purpose: gather enough creative direction without making the parent write a brief from scratch.

Fields:

| UI label | Backend field | Rules |
|---|---|---|
| What should the story help celebrate or explore? | `theme` | Required; selectable prompts plus free text |
| What do they absolutely love? | `interests` | Required; examples stay outside the placeholder when possible |
| Dedication | `dedication` | Required or explicitly optional per product decision; preserve exactly as typed |

Suggested theme prompts:

- Bedtime routine.
- Starting school.
- Brushing teeth.
- Potty-training milestone.
- Birthday adventure.
- A trip or favorite place.
- Something else.

Do not frame a child as needing to be fixed. Use “celebrate,” “explore,” “practice,” and “feel ready for.”

Copy:

- Heading: **Shape their story.**
- Help: **Choose a starting point, then add the details that make it feel like theirs.**
- Continue: **Add Their Photo**.

### 6.5 Step 3 — Add their photo

Purpose: make the most sensitive step feel clear, controlled, and trustworthy.

Before the picker:

- Show one approved good-photo example and three concise rules:
  - Face the camera.
  - Use even natural light.
  - Include one child only.
- State accepted formats and maximum original size.
- Link to concrete photo-handling facts.

States:

| State | Required behavior |
|---|---|
| Empty | Upload button and camera-roll guidance |
| Preparing | Progress/status text; button disabled only while processing |
| Accepted | Preview, Replace, and Remove actions |
| Wrong type | Explain accepted image formats |
| Too large | State the limit and offer a retry |
| Multiple/invalid subject | Explain that one child photo is required when technically detectable |
| Preparation failure | Preserve the step and offer browser-specific recovery guidance |

The upload button must be a semantic button. Status changes use `aria-live="polite"`; errors use `role="alert"` when they block progress.

Copy:

- Heading: **Add the photo we'll illustrate.**
- Reassurance: **Your photo is prepared securely and submitted only when you proceed to checkout.**
- Continue: **Choose Their Edition**.

### 6.6 Step 4 — Choose their edition

Purpose: make the financial decision before collecting parent contact details and consent.

- Preselect the package from `/create?package=digital|print` when supplied.
- Show balanced Digital and Digital + Hardcover cards using the homepage package copy.
- Expose delivery expectations beside each choice.
- For print, collect delivery country only if needed to provide an accurate VAT/shipping estimate.
- Show an estimated order total before Continue.
- Continue: **Review Their Book Details**.

### 6.7 Step 5 — Review and checkout

Purpose: prevent spelling mistakes, collect parent contact details and consent, and hand off to Stripe.

Fields:

| UI label | Backend field | Rules |
|---|---|---|
| Parent / guardian name | `parent-name` | Required; `autocomplete="name"` |
| Email address | `email` | Required; `type="email"`; `autocomplete="email"` |
| Photo permission and policies | `photo-consent` | Required checkbox; links open without losing entered state |
| Final detail confirmation | Existing confirmation | Required checkbox after the review content |

Review groups:

- Child.
- Story.
- Dedication.
- Photo thumbnail with Replace link.
- Edition, price, VAT, shipping, and expected delivery.

Each group has an Edit action that returns to the relevant step and preserves progress.

Primary CTA: **Proceed to Secure Checkout**.

Submission sequence:

1. Validate all steps.
2. Focus the first error and display a linked error summary.
3. Prepare the safe photo copy if not already ready.
4. Build the existing `multipart/form-data` request.
5. Submit to `POST /orders`.
6. Redirect to the returned Stripe `checkoutUrl`.
7. Preserve UTM attribution fields already supported by the backend contract.

No personal or child data is logged to the console or analytics.

## 7. Validation and error recovery

- Validate on Continue and after a field has been touched; do not show errors before interaction.
- Inline error appears directly under the field.
- Invalid controls receive `aria-invalid="true"` and `aria-describedby` pointing to their error.
- Error summary appears above the step heading after a failed Continue.
- Summary links move focus to the relevant field.
- Error color is accompanied by text and an icon.
- Preserve all valid values after network or server failure.
- Server errors use the backend's `error.message`, normalized into customer-safe copy.
- Network failure message: **We couldn't open checkout. Your details are still here—please try again.**
- Do not use a generic toast as the only error location.

## 8. Accessibility requirements

- Target WCAG 2.2 AA.
- Include a visible-on-focus skip link.
- Use one `h1` per route and a sequential heading hierarchy.
- Use semantic header, nav, main, section, form, aside, and footer landmarks.
- Maintain a persistent `2px` minimum focus indicator with sufficient contrast.
- Do not remove outlines without an equivalent replacement.
- All pointer targets are at least `44 × 44px`.
- All book-preview functions have button and keyboard equivalents.
- Announce step changes by moving focus to the new `h1` or step heading.
- Use live regions only for meaningful asynchronous state changes.
- At 200% zoom and 320 CSS pixels, content reflows without horizontal scrolling except the book artwork itself when intentionally zoomed.
- Reduced-motion mode removes shimmer, parallax, breathing, page-curl, and sticky-CTA nudge animations.
- Test with keyboard, VoiceOver/Safari, NVDA/Firefox or Chrome, and Windows High Contrast Mode before launch.

## 9. Localization requirements

- Move the inline translation dictionary out of the main page script into one file per locale or a dedicated locale module.
- Translate visible copy, placeholders, validation, status messages, aria-labels, live-region announcements, image alt text, and metadata together.
- Use a reviewed glossary:
  - VAT → VAT / btw / TVA / MwSt as appropriate.
  - Hardcover → hardcover / hardcover or hardback in English; natural localized equivalents elsewhere.
  - Checkout → payment or secure checkout using natural local terminology.
- Site language and book language remain separate, clearly labeled choices.
- Default book language to the site language only when that language is supported.
- Test every route using the longest translated string.
- Persist only the non-sensitive site-language preference.

## 10. Analytics specification

Recommended events:

| Event | Safe properties |
|---|---|
| `home_primary_cta_click` | location, language |
| `book_preview_open` | approved book slot, language |
| `book_preview_page` | approved book slot, page index |
| `pricing_package_select` | digital/print, language |
| `create_start` | entry source, preselected package, language |
| `create_step_view` | step number, language |
| `create_step_complete` | step number, package if Step 4 |
| `create_step_error` | step number, safe error category |
| `photo_prepare_result` | success/failure, safe error category; never filename or dimensions tied to identity |
| `checkout_start` | package, language |
| `checkout_success` | package, language; order ID only if analytics policy permits |

Retain the current first-touch and last-touch UTM behavior. Never include form text or personal values in event properties.

## 11. Recommended file structure

The current active stylesheet has several chronological polish passes overriding the same components. V3 should replace that pattern rather than append to it.

```text
index.html
create.html
privacy.html
terms.html
contact.html                 optional
checkout-success.html
styles/
  tokens.css
  base.css
  typography.css
  layout.css
  components/
    header.css
    buttons.css
    book-preview.css
    pricing.css
    faq.css
    forms.css
    wizard.css
    order-summary.css
  pages/
    home.css
    create.css
scripts/
  config.js
  api.js
  analytics.js
  i18n.js
  homepage.js
  book-preview.js
  create-wizard.js
locales/
  en.js
  nl.js
  fr.js
  de.js
```

Component selectors should be class-based and locally scoped. Tokens may be overridden once at a documented theme boundary, not in chronological polish sections.

## 12. Backend and hosting compatibility

- Continue reading the API base URL from `mirrortale-api-base-url`.
- Continue submitting orders as `multipart/form-data` to `POST /orders`.
- Preserve current backend field names and UTM fields.
- Keep all AI, Stripe, Firebase Admin, storage, and service credentials in `mirrortale-engine`.
- Keep the public landing repository deployable as static Firebase Hosting files.
- Add `create.html` to Hosting; existing clean URLs expose `/create`.
- Add explicit cache headers for new HTML routes as `no-cache` if the current `index.html` rule does not cover them.
- If accurate pre-checkout VAT/shipping requires a new public quote endpoint, define that in the engine before implementing Step 4 totals.

## 13. Component inventory and states

Build and document:

- Header: desktop, mobile, menu open, scrolled.
- Button: primary, secondary, text, disabled, loading.
- Section heading: dark and paper surfaces.
- Transformation proof: desktop and mobile.
- Book selector and preview: loading, ready, page change, failed asset.
- Review/proof card: genuine review and process-proof fallback.
- Pricing card: default, recommended, selected.
- Privacy panel.
- FAQ item: collapsed, expanded, focused.
- Wizard shell: all five steps, complete, error.
- Form field: empty, filled, focused, invalid, disabled.
- Upload panel: all states in Step 3.
- Order summary: desktop sticky and mobile collapsed/expanded.
- Status banner: informational, success, error.

## 14. Implementation sequence

### Phase 1 — Foundation

1. Create tokens and base styles.
2. Create the new header, buttons, typography, and layout primitives.
3. Extract localization into dedicated modules.
4. Create `/create` route and wizard state model.

### Phase 2 — Core journeys

1. Build the simplified homepage through pricing.
2. Build all five wizard steps and validation.
3. Connect the existing `/orders` API.
4. Preserve UTM attribution.

### Phase 3 — Proof and trust

1. Add accessible book-preview controls.
2. Add verified customer proof or the approved process-proof fallback.
3. Add confirmed privacy and pricing details.
4. Complete FAQ semantics.

### Phase 4 — QA and launch

1. Visual QA at 390 × 844, 768 × 1024, 1280 × 720, and 1440 × 900.
2. Keyboard and screen-reader QA.
3. Longest-string localization QA.
4. Reduced-motion and 200% zoom QA.
5. API, upload, Stripe, success-page, and recovery testing.
6. Firebase preview-channel review before production deployment.

## 15. Launch acceptance checklist

- [ ] Primary CTA, starting price, and turnaround visible in the first viewport.
- [ ] Mobile header uses one row and one conditional sticky CTA.
- [ ] Homepage contains no full order or contact form.
- [ ] `/create` exposes five steps and preserves valid progress.
- [ ] Package selection carries from pricing into Step 4.
- [ ] Final VAT/shipping treatment is clear before checkout.
- [ ] Photo-handling claims are legally and operationally confirmed.
- [ ] Preview works with buttons, keyboard, and screen reader.
- [ ] FAQ uses semantic disclosure buttons.
- [ ] Validation errors are linked and announced.
- [ ] All locale strings and accessible names are translated.
- [ ] Analytics contains no PII or child data.
- [ ] Existing `POST /orders` flow and Stripe redirect work.
- [ ] Preview-channel QA passes at all target viewports.
- [ ] No new chronological CSS override block was added.

## 16. Decisions required before implementation

1. Confirm whether print prices will be displayed VAT-inclusive by country or as an explicit excluding-VAT amount.
2. Confirm whether shipping is included and, if not, how a pre-checkout estimate will be calculated.
3. Confirm photo retention, deletion, access, and model-training statements.
4. Confirm whether the dedication is required or optional.
5. Confirm whether current character-presentation options remain unchanged or need a broader backend schema.
6. Confirm whether genuine customer reviews and printed-book photography are available for launch.
