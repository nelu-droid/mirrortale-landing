const reveals = document.querySelectorAll(".reveal");
const header = document.querySelector(".v3-site-header");
const form = document.querySelector(".intake-form");
const intakeSection = document.querySelector("#intake");
const contactForm = document.querySelector(".contact-form");
const contactSection = document.querySelector("#contact");
const pricingSection = document.querySelector("#pricing");
const finalCtaSection = document.querySelector(".cta-strip");
const heroPrimaryCta = document.querySelector(".v3-hero-primary");
const mobileStickyCta = document.querySelector(".v3-mobile-sticky-cta");
const mobileMenuToggle = document.querySelector(".v3-menu-toggle");
const mobileMenu = document.querySelector("#v3-mobile-menu");
const packageOptions = document.querySelectorAll(".package-selector label");
const packageTargetButtons = document.querySelectorAll("[data-package-target]");
const exampleBooks = document.querySelectorAll(".example-book[data-book-slot]");
const heroVideo = document.querySelector("[data-hero-video]");
const orderPhotoInput = form?.querySelector('input[name="child-photo"]');
const uploadCard = orderPhotoInput?.closest(".upload-card");
const uploadTitle = uploadCard?.querySelector("[data-upload-title]");
const uploadDetail = uploadCard?.querySelector("[data-upload-detail]");
const uploadStatus = form?.querySelector("[data-upload-status]");
const siteLanguageSelects = Array.from(document.querySelectorAll("[data-site-language]"));
const mobileStickyCtaMedia = window.matchMedia("(max-width: 760px)");
const normalizeApiBaseUrl = (value) => String(value || "").trim().replace(/\/+$/, "");
const siteConfig = {
  apiBaseUrl: normalizeApiBaseUrl(
    window.MirrorTaleConfig?.apiBaseUrl ||
      document.querySelector('meta[name="mirrortale-api-base-url"]')?.content
  ),
};
const trackAnalyticsEvent = (eventName, params = {}) => {
  window.mirrortaleAnalytics?.track?.(eventName, params);
};
const getSelectedPackageValue = () =>
  form?.querySelector('input[name="package"]:checked')?.value || "";
const getSelectedBookLanguage = () =>
  form?.querySelector('select[name="book-language"]')?.value || "";
const apiEndpoints = {
  orders: "/orders",
  contact: "/contact",
};
const configuredSiteLanguages = ["en", "nl", "fr", "de"];
const siteLanguageStorageKey = "mirrortale-site-language-v1";
const siteLanguageCopy = {
  en: {
    "document.title": "MirrorTale | A Story Only They Could Star In",
    "site.language.aria": "Site language",
    "nav.how.full": "How It Works",
    "nav.how.short": "How",
    "nav.examples.full": "Example Books",
    "nav.examples.short": "Books",
    "nav.pricing": "Pricing",
    "nav.faq": "FAQ",
    "nav.menu.open": "Open menu",
    "nav.menu.close": "Close menu",
    "nav.support": "Support",
    "cta.create": "Create Their Book",
    "cta.examples": "See a real book →",
    "hero.title.1": "More than their name.",
    "hero.title.2": "",
    "hero.title.3a": "They become",
    "hero.title.3b": "the hero.",
    "hero.lede": "Crafted from their photo, favorite things, and world—then personally checked before delivery.",
    "hero.price": "From €49 · Digital book in 24–48h",
    "hero.art.alt": "Child reading a glowing storybook",
    "hero.badge.print": "Print edition",
    "hero.badge.available": "available now",
    "hero.badge.tracked": "tracked delivery",
    "hero.trust.1.title": "Recognizable likeness",
    "hero.trust.1.detail": "crafted from their photo",
    "hero.trust.2.title": "Human-reviewed",
    "hero.trust.2.detail": "reviewed before delivery",
    "hero.trust.3.title": "Digital book",
    "hero.trust.3.detail": "ready in 24-48h",
    "hero.trust.4.title": "Optional hardcover",
    "hero.trust.4.detail": "a real book for their shelf",
    "process.title": "From photo to finished <span class=\"title-accent title-accent-storybook\">storybook</span>",
    "process.step.1": "Upload photo + details",
    "process.step.2": "Create illustrated likeness",
    "process.step.3": "Build personalized story",
    "process.step.4": "Receive book in 24-48h",
    "examples.title": "Example books",
    "examples.body": "Flip through a real MirrorTale book below to see the story quality, personalization, and finished pages your child receives.",
    "examples.preview": "View Book Preview",
    "examples.instruction": "Click or tap any cover to open the interactive book preview below.",
    "preview.kicker": "Book preview",
    "preview.prefix": "Now previewing",
    "preview.helper": "Tap or swipe to turn.",
    "preview.coverHelper": "Tap or swipe to open.",
    "preview.badge.active": "Previewing",
    "preview.badge.inactive": "Tap to preview",
    "preview.mobile.cover": "Cover",
    "preview.mobile.back": "Back cover",
    "preview.mobile.page": "Page {current} of {total}",
    "preview.mobile.tap": "Tap to open",
    "moments.title": "Made for moments parents remember",
    "moments.1.title": "Bedtime feels familiar",
    "moments.1.body": "A custom bedtime-routine story can turn pajamas, brushing teeth, and lights-out into a gentle adventure your child recognizes.",
    "moments.2.title": "A grandparent gift with heart",
    "moments.2.body": "Choose the hardcover when you want a keepsake grandparents can give, read aloud, and keep in the family memory box.",
    "moments.3.title": "A hero they recognize",
    "moments.3.body": "The illustrated character is crafted from your child's photo, so the story feels like theirs instead of a simple name-swap book.",
    "cta.strip.text": "Ready to create a book for your child?",
    "cta.strip.button": "Start Your Book",
    "trust.1.title": "Looks like<br />your child",
    "trust.1.body": "Created from their real photo, not a generic avatar.",
    "trust.2.title": "Real details<br />woven in",
    "trust.2.body": "Names, interests, and family notes shape the story.",
    "trust.3.title": "The same child,<br />every page",
    "trust.3.body": "Your child's character stays recognizable throughout the book.",
    "trust.4.title": "Human checked<br />before delivery",
    "trust.4.body": "Every finished book gets a final quality review.",
    "trust.5.title": "Premium hardcover,<br />made to keep",
    "trust.5.body": "Choose print when you want a gift-ready treasure for their shelf.",
    "trust.6.title": "Secure photo<br />handling",
    "trust.6.body": "Your photos are used only to create the book.",
    "pricing.title": "Start with digital.<br />Upgrade to a keepsake.",
    "pricing.digital.title": "Digital Only",
    "pricing.digital.1": "Ready-to-print PDF",
    "pricing.digital.2": "Delivered in 24-48h",
    "pricing.digital.3": "Premium personalized story tailored for your child",
    "pricing.digital.cta": "Choose Digital",
    "pricing.print.badge": "Keepsake upgrade",
    "pricing.print.title": "Digital + Print",
    "pricing.print.note": "For parents who want the story to become a bedtime book they can hold, gift, and keep.",
    "pricing.print.1": "Everything in Digital Only, plus a physical keepsake",
    "pricing.print.2": "Square 22 x 22 cm premium color hardcover made for small hands",
    "pricing.print.3": "Perfect for bedtime, birthdays, grandparents, and memory boxes",
    "pricing.print.4": "Tracked print updates by email after ordering",
    "pricing.print.cta": "Choose Hardcover Print",
    "pricing.reassurance": "Before delivery, every book is manually reviewed for character likeness. If it clearly misses the mark, we correct it.",
    "pricing.note": "Every book is custom-made from your child's photo and story details. Choose Digital + Print when you want a gift-ready keepsake your child can hold, reread, and keep on their shelf.",
    "faq.title": "Frequently<br />asked questions",
    "faq.1.q": "How long does the digital book take?",
    "faq.1.a": "Your cover spread PDF and interior pages PDF are delivered within 24-48h after payment.",
    "faq.2.q": "Can I print my own book?",
    "faq.2.a": "Yes. The PDF file you receive with the Digital Only version is optimized specifically for printing in a square 22 x 22 cm format.",
    "faq.3.q": "Where do you ship hardcover books?",
    "faq.3.a": "We are focusing on Europe first for hardcover delivery. The shipping address is collected securely during checkout for print orders.",
    "faq.4.q": "How long does the hardcover book take?",
    "faq.4.a": "Your digital PDFs are delivered within 24-48h. The physical hardcover book ships separately and can take up to 15 business days to arrive in Europe.",
    "faq.5.q": "How are my child's photos used?",
    "faq.5.a": "Your child's photos and story details are used only to create and review the ordered book.",
    "faq.6.q": "Will my child's likeness look the same throughout the book?",
    "faq.6.a": "We build from an anchor likeness and manually review the final book so your child stays recognizable from page to page.",
    "faq.7.q": "What if the character does not look right?",
    "faq.7.a": "Before delivery, every book is manually reviewed for character likeness. If it clearly misses the mark, we correct it.",
    "faq.8.q": "What photo works best?",
    "faq.8.a": "A clear, front-facing photo in good light works best. Avoid sunglasses, filters, or covered faces.",
    "faq.9.q": "Can I preview the book before it's finalized?",
    "faq.9.a": "The book is manually checked before delivery, and the final PDF is sent digitally for your review and use.",
    "form.title": "Create your child's one-of-a-kind storybook",
    "form.reassurance": "Takes about 2 minutes. Secure upload, human quality check, digital PDFs in 24-48h, and optional print fulfillment.",
    "form.assurance.1": "Photos used only for your book",
    "form.assurance.2": "Manually checked before delivery",
    "form.assurance.3": "Digital PDFs in 24-48h",
    "form.assurance.4": "Printed book option at checkout",
    "form.detail": "Your child's name, story details, and dedication guide the personalization, so please double-check spelling before checkout.",
    "form.parent": "Parent details",
    "form.parent.name": "Parent / Guardian Name",
    "form.parent.name.placeholder": "Enter your name",
    "form.email": "Email Address",
    "form.email.placeholder": "Enter your email",
    "form.child": "Child details",
    "form.child.name": "Child's Name",
    "form.child.name.placeholder": "Enter child's name",
    "form.gender": "Gender",
    "form.gender.placeholder": "Select gender",
    "form.gender.boy": "Boy",
    "form.gender.girl": "Girl",
    "form.age": "Age",
    "form.age.placeholder": "Select age",
    "form.bookLanguage": "Book language",
    "form.bookLanguage.hint": "The story text will be written in this language.",
    "form.story": "Story details",
    "form.story.about": "What should the story be about?",
    "form.story.about.placeholder": "Example: personal hygiene, bedtime routine, potty training, trip to the zoo...",
    "form.story.about.hint": "Suggestions: the everyday lesson, emotional goal, setting, adventure style, or moment you want the story to celebrate.",
    "form.story.loves": "What does your child absolutely love?",
    "form.story.loves.placeholder": "Hobbies, toys, activities, animals, colors, favorite places...",
    "form.dedication": "Dedication Message",
    "form.dedication.placeholder": "Example: For Leo, whose courage and imagination light up every room.",
    "form.dedication.hint": "This appears on the first page exactly as typed, so write it in the selected book language.",
    "upload.legend": "Upload child photo",
    "upload.title.default": "Click to upload",
    "upload.detail.default": "A clear, front-facing extreme close-up photo of the child with good lighting works best. Your photos are handled securely and used only to create your child's book.",
    "upload.title.accepted": "Photo accepted",
    "upload.title.error": "Photo not ready",
    "upload.detail.accepted": "Accepted for your book",
    "upload.error.missing": "Please upload one child photo before checkout.",
    "upload.error.count": "Please upload one child photo only.",
    "upload.error.attach": "That photo did not attach correctly. Please choose it again, or open this page in your browser.",
    "upload.error.largeOriginal": "Please choose a photo under 35 MB.",
    "upload.error.type": "Please choose an image file from your camera roll.",
    "upload.message.selected": "Photo accepted. We will prepare a secure upload copy when you proceed to checkout.",
    "upload.message.preparing": "Preparing a fresh photo copy for secure upload...",
    "upload.error.largePrepared": "That photo is too large to upload. Please choose a smaller photo.",
    "upload.message.prepared": "Photo accepted and prepared. It will upload securely as a fresh JPG for checkout.",
    "upload.error.prepare": "Instagram could not prepare this photo. Please open the page in your phone browser or choose another photo.",
    "package.legend": "Choose your package",
    "package.digital.title": "Digital Only - 49€",
    "package.digital.detail": "Ready-to-print PDF",
    "package.print.title": "Digital + Print - 99€ + VAT",
    "package.print.detail": "PDFs first, then a keepsake print with tracking",
    "package.consent": "I confirm I am the parent/guardian or have permission to upload this child's photo, and I agree to the <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">Privacy Policy</a> and <a href=\"terms.html\" target=\"_blank\" rel=\"noopener\">Terms</a>.",
    "package.confirm": "I have double-checked the child's name, story details, dedication, and spelling, and confirm everything is correct before checkout.",
    "package.checkout": "Takes about 2 minutes. Your photos are used only for your book.",
    "form.submit": "Proceed to Checkout",
    "form.secure": "Secure & Private",
    "contact.kicker": "Contact us",
    "contact.title": "Questions before you create?",
    "contact.body": "We are happy to help with photo choice, story ideas, delivery, or choosing the right package before you begin.",
    "contact.email.title": "Email us",
    "contact.faq.title": "Quick answers",
    "contact.faq.detail": "Visit the FAQ",
    "contact.name": "Your Name",
    "contact.help": "How can we help?",
    "contact.message.placeholder": "Ask us anything about creating your child's book",
    "contact.submit": "Send Message",
    "contact.note": "We will only use your message to reply to your question.",
    "status.checkout.mock.button": "Payment step mocked",
    "status.checkout.mock.message": "Backend URL not configured yet. The live payment flow will start here.",
    "status.checkout.preparing.button": "Preparing secure checkout...",
    "status.checkout.preparing.message": "Preparing your photo securely...",
    "status.checkout.photoMissing": "Please upload one valid child photo.",
    "status.checkout.uploading": "Uploading your order details securely...",
    "status.checkout.ready.button": "Checkout ready",
    "status.checkout.opening": "Opening secure checkout...",
    "status.checkout.saved": "Your request is saved. We will email the next step shortly.",
    "status.tryAgain": "Try again",
    "status.contact.mock.button": "Message ready",
    "status.contact.mock.message": "Backend URL not configured yet. This will send through Cloud Run.",
    "status.contact.sending.button": "Sending...",
    "status.contact.sending.message": "Sending your message securely...",
    "status.contact.sent.button": "Message sent",
    "status.contact.sent.message": "Thanks. We will reply by email soon.",
    "sticky.aria": "Create their MirrorTale book",
    "sticky.detail": "From €49",
    "footer.secure": "Secure & Private",
    "footer.care": "Made with Care",
    "footer.fast": "Fast Digital Delivery",
    "footer.quality": "Premium Quality",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms",
    "footer.rights": "© 2026 MirrorTale. All rights reserved.",
  },
  nl: {
    "document.title": "MirrorTale | Gepersonaliseerde kinderboeken",
    "site.language.aria": "Taal van de website",
    "nav.how.full": "Zo werkt het",
    "nav.how.short": "Zo",
    "nav.examples.full": "Voorbeeldboeken",
    "nav.examples.short": "Boeken",
    "nav.pricing": "Prijzen",
    "nav.faq": "FAQ",
    "nav.menu.open": "Menu openen",
    "nav.menu.close": "Menu sluiten",
    "nav.support": "Hulp",
    "cta.create": "Maak hun boek",
    "cta.examples": "Bekijk een echt boek →",
    "hero.title.1": "Niet alleen hun naam",
    "hero.title.2": "in een verhaal.",
    "hero.title.3a": "Hun gezicht",
    "hero.title.3b": "erin.",
    "hero.lede": "Gemaakt vanuit hun foto, favoriete dingen en wereld—en vóór levering nagekeken door een echte persoon.",
    "hero.price": "Vanaf €49 · Digitaal boek in 24–48u",
    "hero.art.alt": "Kind dat een stralend verhalenboek leest",
    "hero.badge.print": "Printed editie",
    "hero.badge.available": "nu beschikbaar",
    "hero.badge.tracked": "verzending met tracking",
    "hero.trust.1.title": "Herkenbare gelijkenis",
    "hero.trust.1.detail": "gemaakt vanuit hun foto",
    "hero.trust.2.title": "Menselijk nagekeken",
    "hero.trust.2.detail": "nagekeken voor levering",
    "hero.trust.3.title": "Digitaal boek",
    "hero.trust.3.detail": "klaar in 24-48u",
    "hero.trust.4.title": "Optionele hardcover",
    "hero.trust.4.detail": "een echt boek voor de boekenplank",
    "process.title": "Van foto tot afgewerkt <span class=\"title-accent title-accent-storybook\">verhalenboek</span>",
    "process.step.1": "Upload foto + details",
    "process.step.2": "Maak de illustratieve gelijkenis",
    "process.step.3": "Bouw het persoonlijke verhaal",
    "process.step.4": "Ontvang je boek in 24-48u",
    "examples.title": "Voorbeeldboeken",
    "examples.body": "Blader door een echt MirrorTale-boek en bekijk de verhaalstijl, personalisatie en afgewerkte pagina's die je kind ontvangt.",
    "examples.preview": "Bekijk boekvoorbeeld",
    "examples.instruction": "Klik of tik op een cover om het interactieve boekvoorbeeld hieronder te openen.",
    "preview.kicker": "Boekvoorbeeld",
    "preview.prefix": "Je bekijkt nu",
    "preview.helper": "Tik of swipe om te bladeren.",
    "preview.coverHelper": "Tik of swipe om te openen.",
    "preview.badge.active": "Wordt bekeken",
    "preview.badge.inactive": "Tik voor preview",
    "preview.mobile.cover": "Cover",
    "preview.mobile.back": "Achtercover",
    "preview.mobile.page": "Pagina {current} van {total}",
    "preview.mobile.tap": "Tik om te openen",
    "moments.title": "Gemaakt voor momenten die ouders onthouden",
    "moments.1.title": "Bedtijd voelt vertrouwd",
    "moments.1.body": "Een persoonlijk bedtijdverhaal kan pyjama's, tandenpoetsen en licht uit veranderen in een zacht avontuur dat je kind herkent.",
    "moments.2.title": "Een grootoudercadeau met hart",
    "moments.2.body": "Kies de hardcover als je een blijvend boek wilt dat grootouders kunnen geven, voorlezen en bewaren.",
    "moments.3.title": "Een held die ze herkennen",
    "moments.3.body": "Het geïllustreerde personage wordt gemaakt op basis van de foto van je kind, zodat het verhaal echt van hen voelt.",
    "cta.strip.text": "Klaar om een boek voor je kind te maken?",
    "cta.strip.button": "Start je boek",
    "trust.1.title": "Lijkt op<br />je kind",
    "trust.1.body": "Gemaakt vanuit hun echte foto, niet als generieke avatar.",
    "trust.2.title": "Echte details<br />verwerkt",
    "trust.2.body": "Namen, interesses en familieboodschappen vormen het verhaal.",
    "trust.3.title": "Hetzelfde kind,<br />elke pagina",
    "trust.3.body": "Het personage van je kind blijft herkenbaar doorheen het boek.",
    "trust.4.title": "Menselijk nagekeken<br />voor levering",
    "trust.4.body": "Elk afgewerkt boek krijgt een laatste kwaliteitscontrole.",
    "trust.5.title": "Premium hardcover,<br />om te bewaren",
    "trust.5.body": "Kies print als je een cadeauklare schat voor hun boekenplank wilt.",
    "trust.6.title": "Veilige foto-<br />verwerking",
    "trust.6.body": "Je foto's worden alleen gebruikt om het boek te maken.",
    "pricing.title": "Start digitaal.<br />Upgrade naar een blijvende herinnering.",
    "pricing.digital.title": "Alleen digitaal",
    "pricing.digital.1": "Printklare PDF",
    "pricing.digital.2": "Geleverd in 24-48u",
    "pricing.digital.3": "Premium persoonlijk verhaal op maat van je kind",
    "pricing.digital.cta": "Kies digitaal",
    "pricing.print.badge": "Bewaarupgrade",
    "pricing.print.title": "Digitaal + print",
    "pricing.print.note": "Voor ouders die willen dat het verhaal een bedtijdboek wordt om vast te houden, te geven en te bewaren.",
    "pricing.print.1": "Alles van Alleen digitaal, plus een fysiek bewaarexemplaar",
    "pricing.print.2": "Vierkante premium kleurhardcover van 22 x 22 cm voor kleine handen",
    "pricing.print.3": "Perfect voor bedtijd, verjaardagen, grootouders en herinneringsdozen",
    "pricing.print.4": "Printupdates met tracking via e-mail na bestelling",
    "pricing.print.cta": "Kies hardcover print",
    "pricing.reassurance": "Voor levering wordt elk boek handmatig nagekeken op gelijkenis. Als het duidelijk niet klopt, verbeteren we het.",
    "pricing.note": "Elk boek wordt op maat gemaakt met de foto en verhaalgegevens van je kind. Kies Digitaal + Print als je een cadeauklare herinnering wilt die je kind kan vasthouden, herlezen en bewaren.",
    "faq.title": "Veelgestelde<br />vragen",
    "faq.1.q": "Hoe lang duurt het digitale boek?",
    "faq.1.a": "Je cover-spread PDF en binnenpagina's PDF worden binnen 24-48u na betaling geleverd.",
    "faq.2.q": "Kan ik mijn eigen boek printen?",
    "faq.2.a": "Ja. De PDF van de digitale versie is speciaal geoptimaliseerd om te printen in een vierkant formaat van 22 x 22 cm.",
    "faq.3.q": "Waar leveren jullie hardcoverboeken?",
    "faq.3.a": "We richten ons eerst op Europa voor hardcoverlevering. Het verzendadres wordt veilig verzameld tijdens checkout voor printbestellingen.",
    "faq.4.q": "Hoe lang duurt het hardcoverboek?",
    "faq.4.a": "Je digitale PDF's worden binnen 24-48u geleverd. Het fysieke hardcoverboek wordt apart verzonden en kan tot 15 werkdagen duren in Europa.",
    "faq.5.q": "Hoe worden de foto's van mijn kind gebruikt?",
    "faq.5.a": "De foto's en verhaalgegevens van je kind worden alleen gebruikt om het bestelde boek te maken en na te kijken.",
    "faq.6.q": "Blijft mijn kind doorheen het boek hetzelfde lijken?",
    "faq.6.a": "We werken vanuit een vaste gelijkenis en controleren het eindboek handmatig, zodat je kind herkenbaar blijft van pagina tot pagina.",
    "faq.7.q": "Wat als het personage niet goed lijkt?",
    "faq.7.a": "Voor levering wordt elk boek handmatig nagekeken op gelijkenis. Als het duidelijk niet klopt, verbeteren we het.",
    "faq.8.q": "Welke foto werkt het best?",
    "faq.8.a": "Een duidelijke foto van voren in goed licht werkt het best. Vermijd zonnebrillen, filters of bedekte gezichten.",
    "faq.9.q": "Kan ik het boek bekijken voor het definitief is?",
    "faq.9.a": "Het boek wordt handmatig gecontroleerd voor levering, en de finale PDF wordt digitaal naar je gestuurd om te bekijken en gebruiken.",
    "form.title": "Maak het unieke verhalenboek van je kind",
    "form.reassurance": "Duurt ongeveer 2 minuten. Veilige upload, menselijke kwaliteitscheck, digitale PDF's in 24-48u en optionele printvervulling.",
    "form.assurance.1": "Foto's alleen gebruikt voor je boek",
    "form.assurance.2": "Handmatig nagekeken voor levering",
    "form.assurance.3": "Digitale PDF's in 24-48u",
    "form.assurance.4": "Printed boek optie bij checkout",
    "form.detail": "De naam, verhaalgegevens en opdracht van je kind sturen de personalisatie, dus controleer spelling goed voor checkout.",
    "form.parent": "Gegevens ouder",
    "form.parent.name": "Naam ouder / voogd",
    "form.parent.name.placeholder": "Vul je naam in",
    "form.email": "E-mailadres",
    "form.email.placeholder": "Vul je e-mailadres in",
    "form.child": "Gegevens kind",
    "form.child.name": "Naam van het kind",
    "form.child.name.placeholder": "Vul de naam van je kind in",
    "form.gender": "Geslacht",
    "form.gender.placeholder": "Selecteer geslacht",
    "form.gender.boy": "Jongen",
    "form.gender.girl": "Meisje",
    "form.age": "Leeftijd",
    "form.age.placeholder": "Selecteer leeftijd",
    "form.bookLanguage": "Boektaal",
    "form.bookLanguage.hint": "De verhaaltekst wordt in deze taal geschreven.",
    "form.story": "Verhaaldetails",
    "form.story.about": "Waar moet het verhaal over gaan?",
    "form.story.about.placeholder": "Voorbeeld: persoonlijke hygiëne, bedtijdroutine, zindelijkheid, uitstap naar de zoo...",
    "form.story.about.hint": "Suggesties: de dagelijkse les, emotionele groei, setting, avonturenstijl of moment dat je wilt vieren.",
    "form.story.loves": "Waar houdt je kind absoluut van?",
    "form.story.loves.placeholder": "Hobby's, speelgoed, activiteiten, dieren, kleuren, favoriete plekken...",
    "form.dedication": "Opdracht",
    "form.dedication.placeholder": "Voorbeeld: Voor Leo, wiens moed en verbeelding elke kamer verlichten.",
    "form.dedication.hint": "Dit verschijnt exact zo op de eerste pagina, dus schrijf het in de gekozen boektaal.",
    "upload.legend": "Upload kinderfoto",
    "upload.title.default": "Klik om te uploaden",
    "upload.detail.default": "Een duidelijke, frontale extreme close-up foto van het kind met goed licht werkt het best. Je foto's worden veilig verwerkt en alleen gebruikt om het boek van je kind te maken.",
    "upload.title.accepted": "Foto geaccepteerd",
    "upload.title.error": "Foto nog niet klaar",
    "upload.detail.accepted": "Geaccepteerd voor je boek",
    "upload.error.missing": "Upload één foto van je kind voor checkout.",
    "upload.error.count": "Upload precies één kinderfoto.",
    "upload.error.attach": "Die foto werd niet correct toegevoegd. Kies hem opnieuw of open deze pagina in je browser.",
    "upload.error.largeOriginal": "Kies een foto kleiner dan 35 MB.",
    "upload.error.type": "Kies een afbeeldingsbestand uit je foto's.",
    "upload.message.selected": "Foto geaccepteerd. We maken een veilige uploadkopie wanneer je naar checkout gaat.",
    "upload.message.preparing": "We maken een veilige kopie van je foto klaar...",
    "upload.error.largePrepared": "Die foto is te groot om te uploaden. Kies een kleinere foto.",
    "upload.message.prepared": "Foto geaccepteerd en klaargemaakt. Ze wordt veilig geüpload als nieuwe JPG voor checkout.",
    "upload.error.prepare": "Instagram kon deze foto niet voorbereiden. Open de pagina in je telefoonbrowser of kies een andere foto.",
    "package.legend": "Kies je pakket",
    "package.digital.title": "Alleen digitaal - 49€",
    "package.digital.detail": "Printklare PDF",
    "package.print.title": "Digitaal + print - 99€ + btw",
    "package.print.detail": "Eerst PDF's, daarna een gedrukt bewaarexemplaar met tracking",
    "package.consent": "Ik bevestig dat ik de ouder/voogd ben of toestemming heb om deze foto van het kind te uploaden, en ik ga akkoord met het <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">Privacybeleid</a> en de <a href=\"terms.html\" target=\"_blank\" rel=\"noopener\">Voorwaarden</a>.",
    "package.confirm": "Ik heb de naam, verhaaldetails, opdracht en spelling gecontroleerd en bevestig dat alles correct is voor checkout.",
    "package.checkout": "Duurt ongeveer 2 minuten. Je foto's worden alleen gebruikt voor je boek.",
    "form.submit": "Ga naar checkout",
    "form.secure": "Veilig & privé",
    "contact.kicker": "Contact",
    "contact.title": "Vragen voor je begint?",
    "contact.body": "We helpen graag met fotokeuze, verhaalideeën, levering of het juiste pakket.",
    "contact.email.title": "Mail ons",
    "contact.faq.title": "Snelle antwoorden",
    "contact.faq.detail": "Bekijk de FAQ",
    "contact.name": "Je naam",
    "contact.help": "Waarmee kunnen we helpen?",
    "contact.message.placeholder": "Vraag ons alles over het maken van het boek van je kind",
    "contact.submit": "Verstuur bericht",
    "contact.note": "We gebruiken je bericht alleen om op je vraag te antwoorden.",
    "status.checkout.mock.button": "Betaalstap gesimuleerd",
    "status.checkout.mock.message": "De backend-URL is nog niet ingesteld. De live betaalflow start hier.",
    "status.checkout.preparing.button": "Veilige checkout voorbereiden...",
    "status.checkout.preparing.message": "Je foto wordt veilig voorbereid...",
    "status.checkout.photoMissing": "Upload één geldige kinderfoto.",
    "status.checkout.uploading": "Je bestelgegevens worden veilig geüpload...",
    "status.checkout.ready.button": "Checkout klaar",
    "status.checkout.opening": "Veilige checkout openen...",
    "status.checkout.saved": "Je aanvraag is opgeslagen. We mailen de volgende stap binnenkort.",
    "status.tryAgain": "Probeer opnieuw",
    "status.contact.mock.button": "Bericht klaar",
    "status.contact.mock.message": "De backend-URL is nog niet ingesteld. Dit wordt via Cloud Run verstuurd.",
    "status.contact.sending.button": "Versturen...",
    "status.contact.sending.message": "Je bericht wordt veilig verstuurd...",
    "status.contact.sent.button": "Bericht verstuurd",
    "status.contact.sent.message": "Dank je. We antwoorden binnenkort per e-mail.",
    "sticky.aria": "Maak hun MirrorTale-boek",
    "sticky.detail": "Vanaf €49",
    "footer.secure": "Veilig & privé",
    "footer.care": "Met zorg gemaakt",
    "footer.fast": "Snelle digitale levering",
    "footer.quality": "Premium kwaliteit",
    "footer.privacy": "Privacybeleid",
    "footer.terms": "Voorwaarden",
    "footer.rights": "© 2026 MirrorTale. Alle rechten voorbehouden.",
  },
  fr: {
    "document.title": "MirrorTale | Livres personnalisés pour enfants",
    "site.language.aria": "Langue du site",
    "nav.how.full": "Comment ça marche",
    "nav.how.short": "Guide",
    "nav.examples.full": "Exemples",
    "nav.examples.short": "Livres",
    "nav.pricing": "Prix",
    "nav.faq": "FAQ",
    "nav.menu.open": "Ouvrir le menu",
    "nav.menu.close": "Fermer le menu",
    "nav.support": "Assistance",
    "cta.create": "Créer leur livre",
    "cta.examples": "Voir un vrai livre →",
    "hero.title.1": "Pas seulement leur nom",
    "hero.title.2": "dans une histoire.",
    "hero.title.3a": "Leur visage",
    "hero.title.3b": "dedans.",
    "hero.lede": "Créé à partir de leur photo, de leurs passions et de leur univers—puis vérifié par une vraie personne avant livraison.",
    "hero.price": "À partir de 49 € · Livre numérique en 24–48 h",
    "hero.art.alt": "Enfant lisant un livre lumineux",
    "hero.badge.print": "Édition imprimée",
    "hero.badge.available": "disponible maintenant",
    "hero.badge.tracked": "livraison suivie",
    "hero.trust.1.title": "Ressemblance reconnaissable",
    "hero.trust.1.detail": "créée à partir de sa photo",
    "hero.trust.2.title": "Vérifié par une personne",
    "hero.trust.2.detail": "vérifié avant livraison",
    "hero.trust.3.title": "Livre numérique",
    "hero.trust.3.detail": "prêt en 24-48h",
    "hero.trust.4.title": "Couverture rigide en option",
    "hero.trust.4.detail": "un vrai livre pour sa bibliothèque",
    "process.title": "De la photo au <span class=\"title-accent title-accent-storybook\">livre illustré</span> fini",
    "process.step.1": "Ajoutez photo + détails",
    "process.step.2": "Créez la ressemblance illustrée",
    "process.step.3": "Construisez l'histoire personnalisée",
    "process.step.4": "Recevez le livre en 24-48h",
    "examples.title": "Livres exemples",
    "examples.body": "Feuilletez un vrai livre MirrorTale ci-dessous pour voir la qualité de l'histoire, la personnalisation et les pages finales que votre enfant reçoit.",
    "examples.preview": "Voir l'aperçu du livre",
    "examples.instruction": "Cliquez ou touchez une couverture pour ouvrir l'aperçu interactif ci-dessous.",
    "preview.kicker": "Aperçu du livre",
    "preview.prefix": "Aperçu en cours",
    "preview.helper": "Touchez ou balayez pour tourner.",
    "preview.coverHelper": "Touchez ou balayez pour ouvrir.",
    "preview.badge.active": "En aperçu",
    "preview.badge.inactive": "Voir l'aperçu",
    "preview.mobile.cover": "Couverture",
    "preview.mobile.back": "Dos",
    "preview.mobile.page": "Page {current} sur {total}",
    "preview.mobile.tap": "Touchez pour ouvrir",
    "moments.title": "Créé pour les moments que les parents gardent",
    "moments.1.title": "Le coucher devient familier",
    "moments.1.body": "Une histoire personnalisée de routine du soir peut transformer pyjama, brossage des dents et extinction des lumières en douce aventure que votre enfant reconnaît.",
    "moments.2.title": "Un cadeau de grands-parents avec du cœur",
    "moments.2.body": "Choisissez la couverture rigide si vous voulez un souvenir que les grands-parents peuvent offrir, lire à voix haute et garder dans la famille.",
    "moments.3.title": "Un héros qu'ils reconnaissent",
    "moments.3.body": "Le personnage illustré est créé à partir de la photo de votre enfant, pour que l'histoire lui appartienne vraiment.",
    "cta.strip.text": "Prêt à créer un livre pour votre enfant ?",
    "cta.strip.button": "Commencer mon livre",
    "trust.1.title": "Ressemble à<br />votre enfant",
    "trust.1.body": "Créé à partir de sa vraie photo, pas d'un avatar générique.",
    "trust.2.title": "De vrais détails<br />intégrés",
    "trust.2.body": "Noms, centres d'intérêt et messages familiaux façonnent l'histoire.",
    "trust.3.title": "Le même enfant,<br />à chaque page",
    "trust.3.body": "Le personnage de votre enfant reste reconnaissable tout au long du livre.",
    "trust.4.title": "Vérifié par un humain<br />avant livraison",
    "trust.4.body": "Chaque livre terminé reçoit un dernier contrôle qualité.",
    "trust.5.title": "Couverture rigide premium,<br />faite pour durer",
    "trust.5.body": "Choisissez l'impression si vous voulez un trésor prêt à offrir pour sa bibliothèque.",
    "trust.6.title": "Traitement sécurisé<br />des photos",
    "trust.6.body": "Vos photos servent uniquement à créer le livre.",
    "pricing.title": "Commencez en numérique.<br />Ajoutez un souvenir imprimé.",
    "pricing.digital.title": "Numérique seulement",
    "pricing.digital.1": "PDF prêt à imprimer",
    "pricing.digital.2": "Livré en 24-48h",
    "pricing.digital.3": "Histoire personnalisée premium adaptée à votre enfant",
    "pricing.digital.cta": "Choisir le numérique",
    "pricing.print.badge": "Option souvenir",
    "pricing.print.title": "Numérique + imprimé",
    "pricing.print.note": "Pour les parents qui veulent transformer l'histoire en livre du soir à tenir, offrir et garder.",
    "pricing.print.1": "Tout le numérique, plus un exemplaire physique souvenir",
    "pricing.print.2": "Couverture rigide couleur premium 22 x 22 cm, pensée pour les petites mains",
    "pricing.print.3": "Parfait pour le coucher, les anniversaires, les grands-parents et les boîtes à souvenirs",
    "pricing.print.4": "Suivi d'impression par e-mail après commande",
    "pricing.print.cta": "Choisir l'impression hardcover",
    "pricing.reassurance": "Avant livraison, chaque livre est vérifié manuellement pour la ressemblance. Si le résultat manque clairement la cible, nous le corrigeons.",
    "pricing.note": "Chaque livre est créé sur mesure à partir de la photo et des détails de votre enfant. Choisissez Numérique + Imprimé si vous voulez un souvenir prêt à offrir que votre enfant pourra tenir, relire et garder.",
    "faq.title": "Questions<br />fréquentes",
    "faq.1.q": "Combien de temps prend le livre numérique ?",
    "faq.1.a": "Le PDF de couverture et le PDF des pages intérieures sont livrés dans les 24-48h après paiement.",
    "faq.2.q": "Puis-je imprimer mon propre livre ?",
    "faq.2.a": "Oui. Le PDF de la version numérique est optimisé pour une impression carrée au format 22 x 22 cm.",
    "faq.3.q": "Où livrez-vous les livres hardcover ?",
    "faq.3.a": "Nous nous concentrons d'abord sur l'Europe pour la livraison hardcover. L'adresse de livraison est collectée en toute sécurité pendant le checkout.",
    "faq.4.q": "Combien de temps prend le livre hardcover ?",
    "faq.4.a": "Vos PDF numériques sont livrés sous 24-48h. Le livre physique hardcover est expédié séparément et peut prendre jusqu'à 15 jours ouvrables en Europe.",
    "faq.5.q": "Comment les photos de mon enfant sont-elles utilisées ?",
    "faq.5.a": "Les photos et détails de votre enfant servent uniquement à créer et vérifier le livre commandé.",
    "faq.6.q": "La ressemblance de mon enfant restera-t-elle cohérente ?",
    "faq.6.a": "Nous partons d'une ressemblance de référence et vérifions le livre final manuellement pour que votre enfant reste reconnaissable page après page.",
    "faq.7.q": "Et si le personnage ne ressemble pas assez ?",
    "faq.7.a": "Avant livraison, chaque livre est vérifié manuellement pour la ressemblance. Si le résultat manque clairement la cible, nous le corrigeons.",
    "faq.8.q": "Quelle photo fonctionne le mieux ?",
    "faq.8.a": "Une photo claire, de face, avec une bonne lumière fonctionne le mieux. Évitez les lunettes de soleil, les filtres ou les visages couverts.",
    "faq.9.q": "Puis-je prévisualiser le livre avant finalisation ?",
    "faq.9.a": "Le livre est vérifié manuellement avant livraison, et le PDF final vous est envoyé numériquement pour relecture et utilisation.",
    "form.title": "Créez le livre unique de votre enfant",
    "form.reassurance": "Cela prend environ 2 minutes. Upload sécurisé, contrôle qualité humain, PDF numériques en 24-48h et impression optionnelle.",
    "form.assurance.1": "Photos utilisées uniquement pour votre livre",
    "form.assurance.2": "Vérifié manuellement avant livraison",
    "form.assurance.3": "PDF numériques en 24-48h",
    "form.assurance.4": "Option livre imprimé au checkout",
    "form.detail": "Le nom, les détails de l'histoire et la dédicace guident la personnalisation, donc vérifiez bien l'orthographe avant le checkout.",
    "form.parent": "Informations parent",
    "form.parent.name": "Nom du parent / tuteur",
    "form.parent.name.placeholder": "Entrez votre nom",
    "form.email": "Adresse e-mail",
    "form.email.placeholder": "Entrez votre e-mail",
    "form.child": "Informations enfant",
    "form.child.name": "Nom de l'enfant",
    "form.child.name.placeholder": "Entrez le nom de l'enfant",
    "form.gender": "Genre",
    "form.gender.placeholder": "Sélectionner le genre",
    "form.gender.boy": "Garçon",
    "form.gender.girl": "Fille",
    "form.age": "Âge",
    "form.age.placeholder": "Sélectionner l'âge",
    "form.bookLanguage": "Langue du livre",
    "form.bookLanguage.hint": "Le texte de l'histoire sera écrit dans cette langue.",
    "form.story": "Détails de l'histoire",
    "form.story.about": "De quoi doit parler l'histoire ?",
    "form.story.about.placeholder": "Exemple : hygiène, routine du coucher, propreté, sortie au zoo...",
    "form.story.about.hint": "Suggestions : le petit apprentissage, l'objectif émotionnel, le décor, le style d'aventure ou le moment à célébrer.",
    "form.story.loves": "Qu'est-ce que votre enfant adore ?",
    "form.story.loves.placeholder": "Loisirs, jouets, activités, animaux, couleurs, lieux préférés...",
    "form.dedication": "Message de dédicace",
    "form.dedication.placeholder": "Exemple : Pour Leo, dont le courage et l'imagination illuminent chaque pièce.",
    "form.dedication.hint": "Ce texte apparaît exactement ainsi sur la première page, donc écrivez-le dans la langue choisie pour le livre.",
    "upload.legend": "Uploader la photo de l'enfant",
    "upload.title.default": "Cliquez pour uploader",
    "upload.detail.default": "Une photo très rapprochée, claire et de face de l'enfant avec une bonne lumière fonctionne le mieux. Vos photos sont traitées en sécurité et utilisées uniquement pour créer le livre de votre enfant.",
    "upload.title.accepted": "Photo acceptée",
    "upload.title.error": "Photo pas prête",
    "upload.detail.accepted": "Acceptée pour votre livre",
    "upload.error.missing": "Veuillez uploader une photo de l'enfant avant le checkout.",
    "upload.error.count": "Veuillez uploader une seule photo de l'enfant.",
    "upload.error.attach": "Cette photo n'a pas été ajoutée correctement. Choisissez-la à nouveau ou ouvrez cette page dans votre navigateur.",
    "upload.error.largeOriginal": "Veuillez choisir une photo de moins de 35 Mo.",
    "upload.error.type": "Veuillez choisir un fichier image depuis vos photos.",
    "upload.message.selected": "Photo acceptée. Nous préparerons une copie sécurisée pour l'upload au moment du checkout.",
    "upload.message.preparing": "Préparation d'une copie sécurisée de la photo...",
    "upload.error.largePrepared": "Cette photo est trop volumineuse pour l'upload. Choisissez une photo plus petite.",
    "upload.message.prepared": "Photo acceptée et préparée. Elle sera uploadée en toute sécurité en JPG pour le checkout.",
    "upload.error.prepare": "Instagram n'a pas pu préparer cette photo. Ouvrez la page dans le navigateur de votre téléphone ou choisissez une autre photo.",
    "package.legend": "Choisissez votre formule",
    "package.digital.title": "Numérique seulement - 49€",
    "package.digital.detail": "PDF prêt à imprimer",
    "package.print.title": "Numérique + imprimé - 99€ + TVA",
    "package.print.detail": "PDF d'abord, puis un livre souvenir imprimé avec suivi",
    "package.consent": "Je confirme être le parent/tuteur ou avoir l'autorisation d'uploader la photo de cet enfant, et j'accepte la <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">Politique de confidentialité</a> et les <a href=\"terms.html\" target=\"_blank\" rel=\"noopener\">Conditions</a>.",
    "package.confirm": "J'ai vérifié le nom de l'enfant, les détails de l'histoire, la dédicace et l'orthographe, et je confirme que tout est correct avant le checkout.",
    "package.checkout": "Cela prend environ 2 minutes. Vos photos sont utilisées uniquement pour votre livre.",
    "form.submit": "Passer au checkout",
    "form.secure": "Sécurisé & privé",
    "contact.kicker": "Contact",
    "contact.title": "Des questions avant de créer ?",
    "contact.body": "Nous pouvons vous aider avec le choix de la photo, les idées d'histoire, la livraison ou le choix de la bonne formule.",
    "contact.email.title": "Nous écrire",
    "contact.faq.title": "Réponses rapides",
    "contact.faq.detail": "Voir la FAQ",
    "contact.name": "Votre nom",
    "contact.help": "Comment pouvons-nous aider ?",
    "contact.message.placeholder": "Posez-nous vos questions sur la création du livre de votre enfant",
    "contact.submit": "Envoyer le message",
    "contact.note": "Nous utiliserons votre message uniquement pour répondre à votre question.",
    "status.checkout.mock.button": "Paiement simulé",
    "status.checkout.mock.message": "L'URL backend n'est pas encore configurée. Le paiement en direct commencera ici.",
    "status.checkout.preparing.button": "Préparation du checkout sécurisé...",
    "status.checkout.preparing.message": "Préparation sécurisée de votre photo...",
    "status.checkout.photoMissing": "Veuillez uploader une photo valide de l'enfant.",
    "status.checkout.uploading": "Upload sécurisé des détails de votre commande...",
    "status.checkout.ready.button": "Checkout prêt",
    "status.checkout.opening": "Ouverture du checkout sécurisé...",
    "status.checkout.saved": "Votre demande est enregistrée. Nous vous enverrons bientôt la prochaine étape par e-mail.",
    "status.tryAgain": "Réessayer",
    "status.contact.mock.button": "Message prêt",
    "status.contact.mock.message": "L'URL backend n'est pas encore configurée. Ce message sera envoyé via Cloud Run.",
    "status.contact.sending.button": "Envoi...",
    "status.contact.sending.message": "Envoi sécurisé de votre message...",
    "status.contact.sent.button": "Message envoyé",
    "status.contact.sent.message": "Merci. Nous répondrons bientôt par e-mail.",
    "sticky.aria": "Créer leur livre MirrorTale",
    "sticky.detail": "À partir de 49 €",
    "footer.secure": "Sécurisé & privé",
    "footer.care": "Créé avec soin",
    "footer.fast": "Livraison numérique rapide",
    "footer.quality": "Qualité premium",
    "footer.privacy": "Confidentialité",
    "footer.terms": "Conditions",
    "footer.rights": "© 2026 MirrorTale. Tous droits réservés.",
  },
  de: {
    "document.title": "MirrorTale | Personalisierte Kinderbücher",
    "site.language.aria": "Sprache der Website",
    "nav.how.full": "So funktioniert es",
    "nav.how.short": "So",
    "nav.examples.full": "Beispielbücher",
    "nav.examples.short": "Bücher",
    "nav.pricing": "Preise",
    "nav.faq": "FAQ",
    "nav.menu.open": "Menü öffnen",
    "nav.menu.close": "Menü schließen",
    "nav.support": "Hilfe",
    "cta.create": "Ihr Buch erstellen",
    "cta.examples": "Ein echtes Buch ansehen →",
    "hero.title.1": "Nicht nur ihr Name",
    "hero.title.2": "in einer Geschichte.",
    "hero.title.3a": "Ihr Gesicht",
    "hero.title.3b": "darin.",
    "hero.lede": "Erstellt aus ihrem Foto, ihren Lieblingsdingen und ihrer Welt—und vor der Lieferung von einem Menschen geprüft.",
    "hero.price": "Ab 49 € · Digitales Buch in 24–48 Std.",
    "hero.art.alt": "Kind liest ein leuchtendes Bilderbuch",
    "hero.badge.print": "Druckausgabe",
    "hero.badge.available": "jetzt verfügbar",
    "hero.badge.tracked": "Sendungsverfolgung",
    "hero.trust.1.title": "Wiedererkennbare Ähnlichkeit",
    "hero.trust.1.detail": "aus dem Foto erstellt",
    "hero.trust.2.title": "Von Menschen geprüft",
    "hero.trust.2.detail": "vor Lieferung geprüft",
    "hero.trust.3.title": "Digitales Buch",
    "hero.trust.3.detail": "bereit in 24-48h",
    "hero.trust.4.title": "Optionales Hardcover",
    "hero.trust.4.detail": "ein echtes Buch fürs Regal",
    "process.title": "Vom Foto zum fertigen <span class=\"title-accent title-accent-storybook\">Bilderbuch</span>",
    "process.step.1": "Foto + Details hochladen",
    "process.step.2": "Illustrierte Ähnlichkeit erstellen",
    "process.step.3": "Personalisierte Geschichte bauen",
    "process.step.4": "Buch in 24-48h erhalten",
    "examples.title": "Beispielbücher",
    "examples.body": "Blättern Sie durch ein echtes MirrorTale-Buch und sehen Sie Storyqualität, Personalisierung und fertige Seiten.",
    "examples.preview": "Buchvorschau ansehen",
    "examples.instruction": "Klicken oder tippen Sie auf ein Cover, um die interaktive Buchvorschau unten zu öffnen.",
    "preview.kicker": "Buchvorschau",
    "preview.prefix": "Aktuelle Vorschau",
    "preview.helper": "Tippen oder wischen zum Blättern.",
    "preview.coverHelper": "Tippen oder wischen zum Öffnen.",
    "preview.badge.active": "Vorschau aktiv",
    "preview.badge.inactive": "Vorschau öffnen",
    "preview.mobile.cover": "Cover",
    "preview.mobile.back": "Rückcover",
    "preview.mobile.page": "Seite {current} von {total}",
    "preview.mobile.tap": "Zum Öffnen tippen",
    "moments.title": "Gemacht für Momente, an die Eltern sich erinnern",
    "moments.1.title": "Schlafenszeit fühlt sich vertraut an",
    "moments.1.body": "Eine personalisierte Abendroutine kann Schlafanzug, Zähneputzen und Licht aus in ein sanftes Abenteuer verwandeln, das Ihr Kind wiedererkennt.",
    "moments.2.title": "Ein Geschenk von Großeltern mit Herz",
    "moments.2.body": "Wählen Sie Hardcover, wenn Sie ein Erinnerungsstück möchten, das Großeltern schenken, vorlesen und in der Familie bewahren können.",
    "moments.3.title": "Ein Held, den sie erkennen",
    "moments.3.body": "Die illustrierte Figur entsteht aus dem Foto Ihres Kindes, damit sich die Geschichte wirklich wie seine eigene anfühlt.",
    "cta.strip.text": "Bereit, ein Buch für Ihr Kind zu erstellen?",
    "cta.strip.button": "Buch starten",
    "trust.1.title": "Sieht aus wie<br />Ihr Kind",
    "trust.1.body": "Aus dem echten Foto erstellt, nicht als generischer Avatar.",
    "trust.2.title": "Echte Details<br />eingewoben",
    "trust.2.body": "Namen, Interessen und Familiennotizen formen die Geschichte.",
    "trust.3.title": "Dasselbe Kind,<br />jede Seite",
    "trust.3.body": "Die Figur Ihres Kindes bleibt im ganzen Buch wiedererkennbar.",
    "trust.4.title": "Menschlich geprüft<br />vor Lieferung",
    "trust.4.body": "Jedes fertige Buch bekommt eine letzte Qualitätskontrolle.",
    "trust.5.title": "Premium-Hardcover,<br />zum Aufbewahren",
    "trust.5.body": "Wählen Sie Print, wenn Sie ein geschenkfertiges Buch fürs Regal möchten.",
    "trust.6.title": "Sichere Foto-<br />verarbeitung",
    "trust.6.body": "Ihre Fotos werden nur zur Erstellung des Buches verwendet.",
    "pricing.title": "Digital starten.<br />Zum Erinnerungsbuch upgraden.",
    "pricing.digital.title": "Nur digital",
    "pricing.digital.1": "Druckfertiges PDF",
    "pricing.digital.2": "Geliefert in 24-48h",
    "pricing.digital.3": "Premium-Geschichte, personalisiert für Ihr Kind",
    "pricing.digital.cta": "Digital wählen",
    "pricing.print.badge": "Erinnerungs-Upgrade",
    "pricing.print.title": "Digital + Print",
    "pricing.print.note": "Für Eltern, die aus der Geschichte ein Vorlesebuch machen möchten, das man halten, schenken und bewahren kann.",
    "pricing.print.1": "Alles aus Nur digital plus ein physisches Erinnerungsbuch",
    "pricing.print.2": "Quadratisches Premium-Farb-Hardcover 22 x 22 cm für kleine Hände",
    "pricing.print.3": "Perfekt für Schlafenszeit, Geburtstage, Großeltern und Erinnerungsboxen",
    "pricing.print.4": "Druck-Updates mit Tracking per E-Mail nach Bestellung",
    "pricing.print.cta": "Hardcover Print wählen",
    "pricing.reassurance": "Vor der Lieferung wird jedes Buch manuell auf die Ähnlichkeit geprüft. Wenn es klar nicht passt, korrigieren wir es.",
    "pricing.note": "Jedes Buch wird aus dem Foto und den Storydetails Ihres Kindes individuell erstellt. Wählen Sie Digital + Print, wenn Sie ein geschenkfertiges Erinnerungsbuch möchten.",
    "faq.title": "Häufige<br />Fragen",
    "faq.1.q": "Wie lange dauert das digitale Buch?",
    "faq.1.a": "Das Cover-PDF und das PDF mit den Innenseiten werden innerhalb von 24-48h nach Zahlung geliefert.",
    "faq.2.q": "Kann ich mein eigenes Buch drucken?",
    "faq.2.a": "Ja. Das PDF der digitalen Version ist speziell für den Druck im quadratischen Format 22 x 22 cm optimiert.",
    "faq.3.q": "Wohin versendet ihr Hardcover-Bücher?",
    "faq.3.a": "Wir konzentrieren uns zuerst auf Europa. Die Lieferadresse wird bei Print-Bestellungen sicher im Checkout erfasst.",
    "faq.4.q": "Wie lange dauert das Hardcover-Buch?",
    "faq.4.a": "Ihre digitalen PDFs werden innerhalb von 24-48h geliefert. Das physische Hardcover wird separat versendet und kann in Europa bis zu 15 Werktage dauern.",
    "faq.5.q": "Wie werden die Fotos meines Kindes genutzt?",
    "faq.5.a": "Die Fotos und Storydetails Ihres Kindes werden nur verwendet, um das bestellte Buch zu erstellen und zu prüfen.",
    "faq.6.q": "Sieht mein Kind im ganzen Buch gleich aus?",
    "faq.6.a": "Wir arbeiten mit einer Anker-Ähnlichkeit und prüfen das finale Buch manuell, damit Ihr Kind von Seite zu Seite wiedererkennbar bleibt.",
    "faq.7.q": "Was, wenn die Figur nicht richtig aussieht?",
    "faq.7.a": "Vor der Lieferung wird jedes Buch manuell auf die Ähnlichkeit geprüft. Wenn es klar nicht passt, korrigieren wir es.",
    "faq.8.q": "Welches Foto funktioniert am besten?",
    "faq.8.a": "Ein klares Foto von vorne bei gutem Licht funktioniert am besten. Vermeiden Sie Sonnenbrillen, Filter oder verdeckte Gesichter.",
    "faq.9.q": "Kann ich das Buch vor der Finalisierung ansehen?",
    "faq.9.a": "Das Buch wird vor der Lieferung manuell geprüft, und das finale PDF wird Ihnen digital zur Ansicht und Nutzung gesendet.",
    "form.title": "Erstellen Sie das einzigartige Bilderbuch Ihres Kindes",
    "form.reassurance": "Dauert etwa 2 Minuten. Sicherer Upload, menschliche Qualitätsprüfung, digitale PDFs in 24-48h und optionale Print-Erfüllung.",
    "form.assurance.1": "Fotos nur für Ihr Buch verwendet",
    "form.assurance.2": "Manuell geprüft vor Lieferung",
    "form.assurance.3": "Digitale PDFs in 24-48h",
    "form.assurance.4": "Gedrucktes Buch als Option im Checkout",
    "form.detail": "Name, Storydetails und Widmung Ihres Kindes steuern die Personalisierung. Bitte prüfen Sie die Schreibweise vor dem Checkout.",
    "form.parent": "Elterndaten",
    "form.parent.name": "Name Elternteil / Erziehungsberechtigte:r",
    "form.parent.name.placeholder": "Geben Sie Ihren Namen ein",
    "form.email": "E-Mail-Adresse",
    "form.email.placeholder": "Geben Sie Ihre E-Mail ein",
    "form.child": "Kinderdaten",
    "form.child.name": "Name des Kindes",
    "form.child.name.placeholder": "Geben Sie den Namen des Kindes ein",
    "form.gender": "Geschlecht",
    "form.gender.placeholder": "Geschlecht wählen",
    "form.gender.boy": "Junge",
    "form.gender.girl": "Mädchen",
    "form.age": "Alter",
    "form.age.placeholder": "Alter wählen",
    "form.bookLanguage": "Buchsprache",
    "form.bookLanguage.hint": "Der Storytext wird in dieser Sprache geschrieben.",
    "form.story": "Storydetails",
    "form.story.about": "Worum soll die Geschichte gehen?",
    "form.story.about.placeholder": "Beispiel: Hygiene, Abendroutine, Töpfchentraining, Ausflug in den Zoo...",
    "form.story.about.hint": "Vorschläge: Alltagsthema, emotionales Ziel, Umgebung, Abenteuerstil oder ein Moment, den Sie feiern möchten.",
    "form.story.loves": "Was liebt Ihr Kind besonders?",
    "form.story.loves.placeholder": "Hobbys, Spielzeug, Aktivitäten, Tiere, Farben, Lieblingsorte...",
    "form.dedication": "Widmung",
    "form.dedication.placeholder": "Beispiel: Für Leo, dessen Mut und Fantasie jeden Raum erhellen.",
    "form.dedication.hint": "Dies erscheint genau so auf der ersten Seite. Schreiben Sie es daher in der gewählten Buchsprache.",
    "upload.legend": "Kinderfoto hochladen",
    "upload.title.default": "Zum Hochladen klicken",
    "upload.detail.default": "Ein klares, frontales extremes Nahaufnahme-Foto des Kindes bei gutem Licht funktioniert am besten. Ihre Fotos werden sicher verarbeitet und nur verwendet, um das Buch Ihres Kindes zu erstellen.",
    "upload.title.accepted": "Foto akzeptiert",
    "upload.title.error": "Foto nicht bereit",
    "upload.detail.accepted": "Für Ihr Buch akzeptiert",
    "upload.error.missing": "Bitte laden Sie vor dem Checkout ein Kinderfoto hoch.",
    "upload.error.count": "Bitte laden Sie genau ein Kinderfoto hoch.",
    "upload.error.attach": "Dieses Foto wurde nicht korrekt angehängt. Wählen Sie es erneut oder öffnen Sie diese Seite im Browser.",
    "upload.error.largeOriginal": "Bitte wählen Sie ein Foto unter 35 MB.",
    "upload.error.type": "Bitte wählen Sie eine Bilddatei aus Ihren Fotos.",
    "upload.message.selected": "Foto akzeptiert. Wir bereiten beim Checkout eine sichere Upload-Kopie vor.",
    "upload.message.preparing": "Eine sichere Fotokopie wird vorbereitet...",
    "upload.error.largePrepared": "Dieses Foto ist zu groß zum Hochladen. Bitte wählen Sie ein kleineres Foto.",
    "upload.message.prepared": "Foto akzeptiert und vorbereitet. Es wird sicher als neues JPG für den Checkout hochgeladen.",
    "upload.error.prepare": "Instagram konnte dieses Foto nicht vorbereiten. Öffnen Sie die Seite im Browser Ihres Telefons oder wählen Sie ein anderes Foto.",
    "package.legend": "Paket wählen",
    "package.digital.title": "Nur digital - 49€",
    "package.digital.detail": "Druckfertiges PDF",
    "package.print.title": "Digital + Print - 99€ + MwSt.",
    "package.print.detail": "PDFs zuerst, danach ein Erinnerungsdruck mit Tracking",
    "package.consent": "Ich bestätige, dass ich Elternteil/Erziehungsberechtigte:r bin oder die Erlaubnis habe, das Foto dieses Kindes hochzuladen, und stimme der <a href=\"privacy.html\" target=\"_blank\" rel=\"noopener\">Datenschutzerklärung</a> und den <a href=\"terms.html\" target=\"_blank\" rel=\"noopener\">Bedingungen</a> zu.",
    "package.confirm": "Ich habe Namen, Storydetails, Widmung und Schreibweise geprüft und bestätige, dass vor dem Checkout alles korrekt ist.",
    "package.checkout": "Dauert etwa 2 Minuten. Ihre Fotos werden nur für Ihr Buch verwendet.",
    "form.submit": "Zum Checkout",
    "form.secure": "Sicher & privat",
    "contact.kicker": "Kontakt",
    "contact.title": "Fragen, bevor Sie starten?",
    "contact.body": "Wir helfen gerne bei Fotoauswahl, Storyideen, Lieferung oder der Wahl des richtigen Pakets.",
    "contact.email.title": "E-Mail senden",
    "contact.faq.title": "Schnelle Antworten",
    "contact.faq.detail": "FAQ ansehen",
    "contact.name": "Ihr Name",
    "contact.help": "Wie können wir helfen?",
    "contact.message.placeholder": "Fragen Sie uns alles zur Erstellung des Buches Ihres Kindes",
    "contact.submit": "Nachricht senden",
    "contact.note": "Wir verwenden Ihre Nachricht nur, um Ihre Frage zu beantworten.",
    "status.checkout.mock.button": "Zahlungsschritt simuliert",
    "status.checkout.mock.message": "Die Backend-URL ist noch nicht konfiguriert. Der Live-Checkout startet hier.",
    "status.checkout.preparing.button": "Sicheren Checkout vorbereiten...",
    "status.checkout.preparing.message": "Ihr Foto wird sicher vorbereitet...",
    "status.checkout.photoMissing": "Bitte laden Sie ein gültiges Kinderfoto hoch.",
    "status.checkout.uploading": "Ihre Bestelldaten werden sicher hochgeladen...",
    "status.checkout.ready.button": "Checkout bereit",
    "status.checkout.opening": "Sicheren Checkout öffnen...",
    "status.checkout.saved": "Ihre Anfrage ist gespeichert. Wir senden den nächsten Schritt bald per E-Mail.",
    "status.tryAgain": "Erneut versuchen",
    "status.contact.mock.button": "Nachricht bereit",
    "status.contact.mock.message": "Die Backend-URL ist noch nicht konfiguriert. Diese Nachricht wird über Cloud Run gesendet.",
    "status.contact.sending.button": "Senden...",
    "status.contact.sending.message": "Ihre Nachricht wird sicher gesendet...",
    "status.contact.sent.button": "Nachricht gesendet",
    "status.contact.sent.message": "Danke. Wir antworten bald per E-Mail.",
    "sticky.aria": "Ihr MirrorTale-Buch erstellen",
    "sticky.detail": "Ab 49 €",
    "footer.secure": "Sicher & privat",
    "footer.care": "Mit Sorgfalt erstellt",
    "footer.fast": "Schnelle digitale Lieferung",
    "footer.quality": "Premium-Qualität",
    "footer.privacy": "Datenschutz",
    "footer.terms": "Bedingungen",
    "footer.rights": "© 2026 MirrorTale. Alle Rechte vorbehalten.",
  },
};

const v5SiteLanguageCopy = {
  en: {
    "v5.skip": "Skip to content",
    "v5.nav.primary": "Primary navigation",
    "v5.nav.mobile": "Mobile navigation",
    "v5.nav.legal": "Legal links",
    "v5.menu.note": "Secure photo handling · Human reviewed",
    "v5.hero.accent": "Their face in it.",
    "v5.hero.secure": "Secure photo handling",
    "v5.hero.assurances": "Key assurances",
    "v5.process.kicker": "Made around who they are",
    "v5.process.title": "From photo to finished <em>storybook</em>",
    "v5.process.body": "One clear photo becomes a character, a world, and a book made just for them.",
    "v5.examples.kicker": "Real books, real pages",
    "v5.examples.title": "See what their story could feel like",
    "v5.examples.body": "Choose a cover, then tap or swipe through a finished MirrorTale book.",
    "v5.examples.aiden": "Preview Aiden",
    "v5.examples.elena": "Preview Elena",
    "v5.examples.noah": "Preview Noah",
    "v5.keepsake.kicker": "A gift they will not outgrow",
    "v5.keepsake.cta": "See packages",
    "v5.trust.kicker": "Thoughtful from upload to delivery",
    "v5.trust.title": "Personal feels better when it also feels safe",
    "v5.pricing.kicker": "Simple, transparent pricing",
    "v5.pricing.body": "Every option includes the same personalized story and human quality check.",
    "v5.pricing.digital": "Digital storybook",
    "v5.pricing.print": "Digital + hardcover",
    "v5.faq.kicker": "Questions, answered",
    "v5.faq.title": "Before you begin",
    "v5.intake.kicker": "About two minutes",
    "v5.intake.progress.1": "Their details",
    "v5.intake.progress.2": "Story",
    "v5.intake.progress.3": "Photo",
    "v5.intake.progress.4": "Package",
    "v5.intake.steps": "Order steps",
    "v5.intake.assurance": "Private by design",
    "v5.intake.fieldset.1": "Parent and child",
    "v5.footer.tagline": "One-of-one stories, made with care.",
    "v5.footer.contact": "Contact",
  },
  nl: {
    "v5.skip": "Ga naar de inhoud",
    "v5.nav.primary": "Hoofdnavigatie",
    "v5.nav.mobile": "Mobiele navigatie",
    "v5.nav.legal": "Juridische links",
    "v5.menu.note": "Veilige fotoverwerking · Menselijk nagekeken",
    "v5.hero.accent": "Hun gezicht erin.",
    "v5.hero.secure": "Veilige fotoverwerking",
    "v5.hero.assurances": "Belangrijkste garanties",
    "v5.process.kicker": "Gemaakt rond wie ze zijn",
    "v5.process.title": "Van foto tot afgewerkt <em>verhalenboek</em>",
    "v5.process.body": "Eén duidelijke foto wordt een personage, een wereld en een boek dat speciaal voor hen is gemaakt.",
    "v5.examples.kicker": "Echte boeken, echte pagina’s",
    "v5.examples.title": "Ontdek hoe hun verhaal kan aanvoelen",
    "v5.examples.body": "Kies een omslag en tik of veeg door een afgewerkt MirrorTale-boek.",
    "v5.examples.aiden": "Bekijk Aiden",
    "v5.examples.elena": "Bekijk Elena",
    "v5.examples.noah": "Bekijk Noah",
    "v5.keepsake.kicker": "Een cadeau waar ze niet uit groeien",
    "v5.keepsake.cta": "Bekijk pakketten",
    "v5.trust.kicker": "Zorgvuldig van upload tot levering",
    "v5.trust.title": "Persoonlijk voelt beter als het ook veilig voelt",
    "v5.pricing.kicker": "Eenvoudige, transparante prijzen",
    "v5.pricing.body": "Elke optie bevat hetzelfde gepersonaliseerde verhaal en een menselijke kwaliteitscontrole.",
    "v5.pricing.digital": "Digitaal verhalenboek",
    "v5.pricing.print": "Digitaal + hardcover",
    "v5.faq.kicker": "Vragen, beantwoord",
    "v5.faq.title": "Voor je begint",
    "v5.intake.kicker": "Ongeveer twee minuten",
    "v5.intake.progress.1": "Hun gegevens",
    "v5.intake.progress.2": "Verhaal",
    "v5.intake.progress.3": "Foto",
    "v5.intake.progress.4": "Pakket",
    "v5.intake.steps": "Bestelstappen",
    "v5.intake.assurance": "Privacy in het ontwerp",
    "v5.intake.fieldset.1": "Ouder en kind",
    "v5.footer.tagline": "Unieke verhalen, met zorg gemaakt.",
    "v5.footer.contact": "Contact",
  },
  fr: {
    "v5.skip": "Aller au contenu",
    "v5.nav.primary": "Navigation principale",
    "v5.nav.mobile": "Navigation mobile",
    "v5.nav.legal": "Liens juridiques",
    "v5.menu.note": "Photos traitées en sécurité · Vérifié par un humain",
    "v5.hero.accent": "Leur visage dedans.",
    "v5.hero.secure": "Photos traitées en sécurité",
    "v5.hero.assurances": "Garanties essentielles",
    "v5.process.kicker": "Créé autour de leur personnalité",
    "v5.process.title": "De la photo au <em>livre illustré</em> fini",
    "v5.process.body": "Une photo nette devient un personnage, un univers et un livre créé spécialement pour votre enfant.",
    "v5.examples.kicker": "De vrais livres, de vraies pages",
    "v5.examples.title": "Imaginez ce que leur histoire pourrait faire ressentir",
    "v5.examples.body": "Choisissez une couverture, puis touchez ou balayez un livre MirrorTale terminé.",
    "v5.examples.aiden": "Voir Aiden",
    "v5.examples.elena": "Voir Elena",
    "v5.examples.noah": "Voir Noah",
    "v5.keepsake.kicker": "Un cadeau qu’ils garderont longtemps",
    "v5.keepsake.cta": "Voir les formules",
    "v5.trust.kicker": "Soigné du téléchargement à la livraison",
    "v5.trust.title": "Le personnalisé est encore mieux lorsqu’il est aussi sécurisé",
    "v5.pricing.kicker": "Des prix simples et transparents",
    "v5.pricing.body": "Chaque formule comprend la même histoire personnalisée et un contrôle qualité humain.",
    "v5.pricing.digital": "Livre numérique",
    "v5.pricing.print": "Numérique + couverture rigide",
    "v5.faq.kicker": "Vos questions, nos réponses",
    "v5.faq.title": "Avant de commencer",
    "v5.intake.kicker": "Environ deux minutes",
    "v5.intake.progress.1": "Ses informations",
    "v5.intake.progress.2": "Histoire",
    "v5.intake.progress.3": "Photo",
    "v5.intake.progress.4": "Formule",
    "v5.intake.steps": "Étapes de commande",
    "v5.intake.assurance": "Confidentiel par conception",
    "v5.intake.fieldset.1": "Parent et enfant",
    "v5.footer.tagline": "Des histoires uniques, créées avec soin.",
    "v5.footer.contact": "Contact",
  },
  de: {
    "v5.skip": "Zum Inhalt springen",
    "v5.nav.primary": "Hauptnavigation",
    "v5.nav.mobile": "Mobile Navigation",
    "v5.nav.legal": "Rechtliche Links",
    "v5.menu.note": "Sichere Fotoverarbeitung · Von Menschen geprüft",
    "v5.hero.accent": "Ihr Gesicht darin.",
    "v5.hero.secure": "Sichere Fotoverarbeitung",
    "v5.hero.assurances": "Wichtige Zusagen",
    "v5.process.kicker": "Rund um ihre Persönlichkeit gestaltet",
    "v5.process.title": "Vom Foto zum fertigen <em>Bilderbuch</em>",
    "v5.process.body": "Ein klares Foto wird zu einer Figur, einer Welt und einem Buch, das nur für Ihr Kind gemacht ist.",
    "v5.examples.kicker": "Echte Bücher, echte Seiten",
    "v5.examples.title": "So könnte sich ihre Geschichte anfühlen",
    "v5.examples.body": "Wählen Sie ein Cover und tippen oder wischen Sie durch ein fertiges MirrorTale-Buch.",
    "v5.examples.aiden": "Aiden ansehen",
    "v5.examples.elena": "Elena ansehen",
    "v5.examples.noah": "Noah ansehen",
    "v5.keepsake.kicker": "Ein Geschenk, aus dem sie nicht herauswachsen",
    "v5.keepsake.cta": "Pakete ansehen",
    "v5.trust.kicker": "Sorgfältig vom Upload bis zur Lieferung",
    "v5.trust.title": "Persönlich fühlt sich besser an, wenn es auch sicher ist",
    "v5.pricing.kicker": "Einfache, transparente Preise",
    "v5.pricing.body": "Jede Option enthält dieselbe personalisierte Geschichte und eine menschliche Qualitätsprüfung.",
    "v5.pricing.digital": "Digitales Bilderbuch",
    "v5.pricing.print": "Digital + Hardcover",
    "v5.faq.kicker": "Fragen und Antworten",
    "v5.faq.title": "Bevor Sie beginnen",
    "v5.intake.kicker": "Etwa zwei Minuten",
    "v5.intake.progress.1": "Angaben zum Kind",
    "v5.intake.progress.2": "Geschichte",
    "v5.intake.progress.3": "Foto",
    "v5.intake.progress.4": "Paket",
    "v5.intake.steps": "Bestellschritte",
    "v5.intake.assurance": "Datenschutz von Anfang an",
    "v5.intake.fieldset.1": "Elternteil und Kind",
    "v5.footer.tagline": "Einzigartige Geschichten, mit Sorgfalt gemacht.",
    "v5.footer.contact": "Kontakt",
  },
};

const siteLanguageKeys = Object.keys({ ...siteLanguageCopy.en, ...v5SiteLanguageCopy.en });
const supportedSiteLanguages = configuredSiteLanguages.filter((language) => {
  const copy = { ...siteLanguageCopy[language], ...v5SiteLanguageCopy[language] };
  return siteLanguageKeys.every((key) => Object.prototype.hasOwnProperty.call(copy, key));
});

const siteLanguageBindings = [
  { key: "site.language.aria", selector: ".v3-language .visually-hidden, .v3-language-mobile > span" },
  { key: "site.language.aria", selector: "[data-site-language]", attr: "aria-label" },
  { key: "nav.how.full", selector: '.v3-nav a[href="#how-it-works"] .nav-full' },
  { key: "nav.how.short", selector: '.v3-nav a[href="#how-it-works"] .nav-short' },
  { key: "nav.examples.full", selector: '.v3-nav a[href="#examples"] .nav-full' },
  { key: "nav.examples.short", selector: '.v3-nav a[href="#examples"] .nav-short' },
  { key: "nav.pricing", selector: '.v3-nav a[href="#pricing"] .nav-full, .v3-nav a[href="#pricing"] .nav-short' },
  { key: "nav.faq", selector: '.v3-nav a[href="#faq"] .nav-full, .v3-nav a[href="#faq"] .nav-short' },
  { key: "cta.create", selector: ".v3-header-cta, .v3-hero-primary, .v3-mobile-sticky-cta strong" },
  { key: "cta.examples", selector: '.v3-text-link[href="#examples"]' },
  { key: "hero.title.1", selector: ".v3-hero-copy h1 > span:nth-child(1)" },
  { key: "hero.title.2", selector: ".v3-hero-copy h1 > span:nth-child(3)" },
  { key: "hero.title.3a", selector: ".v3-hero-copy .headline-piece:nth-child(1)" },
  { key: "hero.title.3b", selector: ".v3-hero-copy .headline-piece:nth-child(2)" },
  { key: "hero.lede", selector: ".v3-hero-lede" },
  { key: "hero.price", selector: ".v3-price-line" },
  { key: "hero.art.alt", selector: ".v3-hero-image", attr: "alt" },
  { key: "hero.trust.1.title", selector: ".v3-proof-row li:nth-child(1) span" },
  { key: "hero.trust.2.title", selector: ".v3-proof-row li:nth-child(2) span" },
  { key: "hero.trust.4.title", selector: ".v3-proof-row li:nth-child(3) span" },
  { key: "process.title", selector: "#how-it-works .section-title h2", html: true },
  { key: "process.step.1", selector: ".proof-step:nth-of-type(1) .proof-caption p" },
  { key: "process.step.2", selector: ".proof-step:nth-of-type(2) .proof-caption p" },
  { key: "process.step.3", selector: ".proof-step:nth-of-type(3) .proof-caption p" },
  { key: "process.step.4", selector: ".proof-step:nth-of-type(4) .proof-caption p" },
  { key: "examples.title", selector: ".example-intro h2" },
  { key: "examples.body", selector: ".example-intro > p" },
  { key: "examples.preview", selector: ".example-intro .button-outline[data-preview-target]" },
  { key: "examples.instruction", selector: ".example-instruction" },
  { key: "preview.kicker", selector: ".flipbook-preview-header .mini-kicker" },
  { key: "preview.prefix", selector: ".preview-title-prefix" },
  { key: "preview.mobile.tap", selector: ".mobile-tap-hint" },
  { key: "moments.title", selector: "#moments-title" },
  { key: "moments.1.title", selector: ".moments-grid article:nth-child(1) h3" },
  { key: "moments.1.body", selector: ".moments-grid article:nth-child(1) p" },
  { key: "moments.2.title", selector: ".moments-grid article:nth-child(2) h3" },
  { key: "moments.2.body", selector: ".moments-grid article:nth-child(2) p" },
  { key: "moments.3.title", selector: ".moments-grid article:nth-child(3) h3" },
  { key: "moments.3.body", selector: ".moments-grid article:nth-child(3) p" },
  { key: "cta.strip.text", selector: ".cta-strip p" },
  { key: "cta.strip.button", selector: ".cta-strip .button" },
  { key: "trust.1.title", selector: ".trust-grid article:nth-child(1) h3", html: true },
  { key: "trust.1.body", selector: ".trust-grid article:nth-child(1) p" },
  { key: "trust.2.title", selector: ".trust-grid article:nth-child(2) h3", html: true },
  { key: "trust.2.body", selector: ".trust-grid article:nth-child(2) p" },
  { key: "trust.3.title", selector: ".trust-grid article:nth-child(3) h3", html: true },
  { key: "trust.3.body", selector: ".trust-grid article:nth-child(3) p" },
  { key: "trust.4.title", selector: ".trust-grid article:nth-child(4) h3", html: true },
  { key: "trust.4.body", selector: ".trust-grid article:nth-child(4) p" },
  { key: "trust.5.title", selector: ".trust-grid article:nth-child(5) h3", html: true },
  { key: "trust.5.body", selector: ".trust-grid article:nth-child(5) p" },
  { key: "trust.6.title", selector: ".trust-grid article:nth-child(6) h3", html: true },
  { key: "trust.6.body", selector: ".trust-grid article:nth-child(6) p" },
  { key: "pricing.title", selector: ".pricing-heading h2", html: true },
  { key: "pricing.digital.title", selector: ".price-card:nth-child(1) h3" },
  { key: "pricing.digital.1", selector: ".price-card:nth-child(1) li:nth-child(1) span" },
  { key: "pricing.digital.2", selector: ".price-card:nth-child(1) li:nth-child(2) span" },
  { key: "pricing.digital.3", selector: ".price-card:nth-child(1) li:nth-child(3) span" },
  { key: "pricing.digital.cta", selector: '.price-card:nth-child(1) [data-package-target="digital"]' },
  { key: "pricing.print.badge", selector: ".print-card-badge" },
  { key: "pricing.print.title", selector: ".print-card h3" },
  { key: "pricing.print.note", selector: ".print-keepsake-note" },
  { key: "pricing.print.1", selector: ".print-card li:nth-child(1) span" },
  { key: "pricing.print.2", selector: ".print-card li:nth-child(2) span" },
  { key: "pricing.print.3", selector: ".print-card li:nth-child(3) span" },
  { key: "pricing.print.4", selector: ".print-card li:nth-child(4) span" },
  { key: "pricing.print.cta", selector: '.print-card [data-package-target="print"]' },
  { key: "pricing.reassurance", selector: ".pricing-reassurance" },
  { key: "pricing.note", selector: ".pricing-note" },
  { key: "faq.title", selector: ".faq-heading h2", html: true },
  { key: "faq.1.q", selector: ".faq-list details:nth-child(1) summary span" },
  { key: "faq.1.a", selector: ".faq-list details:nth-child(1) > p" },
  { key: "faq.2.q", selector: ".faq-list details:nth-child(2) summary span" },
  { key: "faq.2.a", selector: ".faq-list details:nth-child(2) > p" },
  { key: "faq.3.q", selector: ".faq-list details:nth-child(3) summary span" },
  { key: "faq.3.a", selector: ".faq-list details:nth-child(3) > p" },
  { key: "faq.4.q", selector: ".faq-list details:nth-child(4) summary span" },
  { key: "faq.4.a", selector: ".faq-list details:nth-child(4) > p" },
  { key: "faq.5.q", selector: ".faq-list details:nth-child(5) summary span" },
  { key: "faq.5.a", selector: ".faq-list details:nth-child(5) > p" },
  { key: "faq.6.q", selector: ".faq-list details:nth-child(6) summary span" },
  { key: "faq.6.a", selector: ".faq-list details:nth-child(6) > p" },
  { key: "faq.7.q", selector: ".faq-list details:nth-child(7) summary span" },
  { key: "faq.7.a", selector: ".faq-list details:nth-child(7) > p" },
  { key: "faq.8.q", selector: ".faq-list details:nth-child(8) summary span" },
  { key: "faq.8.a", selector: ".faq-list details:nth-child(8) > p" },
  { key: "faq.9.q", selector: ".faq-list details:nth-child(9) summary span" },
  { key: "faq.9.a", selector: ".faq-list details:nth-child(9) > p" },
  { key: "form.title", selector: ".intake-form > h2" },
  { key: "form.reassurance", selector: ".form-reassurance" },
  { key: "form.assurance.1", selector: ".form-assurance-list li:nth-child(1) span" },
  { key: "form.assurance.2", selector: ".form-assurance-list li:nth-child(2) span" },
  { key: "form.assurance.3", selector: ".form-assurance-list li:nth-child(3) span" },
  { key: "form.assurance.4", selector: ".form-assurance-list li:nth-child(4) span" },
  { key: "form.detail", selector: ".form-detail-note" },
  { key: "form.parent", selector: ".form-columns fieldset:nth-child(1) legend" },
  { key: "form.parent.name", labelFor: 'input[name="parent-name"]' },
  { key: "form.parent.name.placeholder", selector: 'input[name="parent-name"], input[name="contact-name"]', attr: "placeholder" },
  { key: "form.email", labelFor: 'input[name="email"]' },
  { key: "form.email.placeholder", selector: 'input[name="email"], input[name="contact-email"]', attr: "placeholder" },
  { key: "form.child", selector: ".form-columns fieldset:nth-child(2) legend" },
  { key: "form.child.name", labelFor: 'input[name="child-name"]' },
  { key: "form.child.name.placeholder", selector: 'input[name="child-name"]', attr: "placeholder" },
  { key: "form.gender", labelFor: 'select[name="gender"]' },
  { key: "form.gender.placeholder", selector: 'select[name="gender"] option[value=""]' },
  { key: "form.gender.boy", selector: 'select[name="gender"] option[value="Boy"]' },
  { key: "form.gender.girl", selector: 'select[name="gender"] option[value="Girl"]' },
  { key: "form.age", labelFor: 'select[name="age"]' },
  { key: "form.age.placeholder", selector: 'select[name="age"] option[value=""]' },
  { key: "form.bookLanguage", labelFor: 'select[name="book-language"]' },
  { key: "form.bookLanguage.hint", selector: 'select[name="book-language"] + .form-hint' },
  { key: "form.story", selector: ".form-columns fieldset:nth-child(3) legend" },
  { key: "form.story.about", labelFor: 'textarea[name="theme"]' },
  { key: "form.story.about.placeholder", selector: 'textarea[name="theme"]', attr: "placeholder" },
  { key: "form.story.about.hint", selector: 'textarea[name="theme"] + .form-hint' },
  { key: "form.story.loves", labelFor: 'input[name="interests"]' },
  { key: "form.story.loves.placeholder", selector: 'input[name="interests"]', attr: "placeholder" },
  { key: "form.dedication", labelFor: 'textarea[name="dedication"]' },
  { key: "form.dedication.placeholder", selector: 'textarea[name="dedication"]', attr: "placeholder" },
  { key: "form.dedication.hint", selector: 'textarea[name="dedication"] + .form-hint' },
  { key: "upload.legend", selector: ".form-columns fieldset:nth-child(4) legend" },
  { key: "package.legend", selector: ".form-columns fieldset:nth-child(5) legend" },
  { key: "package.legend", selector: ".package-selector", attr: "aria-label" },
  { key: "package.digital.title", selector: '.package-selector input[value="digital"] + span strong' },
  { key: "package.digital.detail", selector: '.package-selector input[value="digital"] + span em' },
  { key: "package.print.title", selector: '.package-selector input[value="print"] + span strong' },
  { key: "package.print.detail", selector: '.package-selector input[value="print"] + span em' },
  { key: "package.consent", selector: ".consent-check:not(.details-confirmation) span", html: true },
  { key: "package.confirm", selector: ".details-confirmation span" },
  { key: "package.checkout", selector: ".checkout-reassurance" },
  { key: "form.submit", selector: ".form-submit" },
  { key: "form.secure", selector: ".secure-note", trailingText: true },
  { key: "contact.kicker", selector: ".contact-copy .mini-kicker" },
  { key: "contact.title", selector: ".contact-copy h2" },
  { key: "contact.body", selector: ".contact-copy > p" },
  { key: "contact.email.title", selector: '.contact-links a[href^="mailto:"] strong' },
  { key: "contact.faq.title", selector: '.contact-links a[href="#faq"] strong' },
  { key: "contact.faq.detail", selector: '.contact-links a[href="#faq"] em' },
  { key: "contact.name", labelFor: 'input[name="contact-name"]' },
  { key: "form.email", labelFor: 'input[name="contact-email"]' },
  { key: "contact.help", labelFor: 'textarea[name="contact-message"]' },
  { key: "contact.message.placeholder", selector: 'textarea[name="contact-message"]', attr: "placeholder" },
  { key: "contact.submit", selector: ".contact-submit" },
  { key: "contact.note", selector: ".contact-note" },
  { key: "sticky.aria", selector: ".v3-mobile-sticky-cta", attr: "aria-label" },
  { key: "sticky.detail", selector: ".v3-mobile-sticky-cta em" },
  { key: "nav.support", selector: '.v3-mobile-legal a[href="#contact"]' },
  { key: "footer.privacy", selector: '.v3-mobile-legal a[href="privacy.html"]' },
  { key: "footer.terms", selector: '.v3-mobile-legal a[href="terms.html"]' },
  { key: "footer.secure", selector: ".footer-inner span:nth-child(1)", trailingText: true },
  { key: "footer.care", selector: ".footer-inner span:nth-child(2)", trailingText: true },
  { key: "footer.fast", selector: ".footer-inner span:nth-child(3)", trailingText: true },
  { key: "footer.quality", selector: ".footer-inner span:nth-child(4)", trailingText: true },
  { key: "footer.privacy", selector: '.footer-legal a[href="privacy.html"]' },
  { key: "footer.terms", selector: '.footer-legal a[href="terms.html"]' },
  { key: "footer.rights", selector: ".site-footer > p" },
];

const v5SiteLanguageBindings = [
  { key: "v5.skip", selector: ".skip-link" },
  { key: "site.language.aria", selector: ".v5-site-language .visually-hidden" },
  { key: "site.language.aria", selector: "[data-site-language]", attr: "aria-label" },
  { key: "v5.nav.primary", selector: ".v5-desktop-nav", attr: "aria-label" },
  { key: "v5.nav.mobile", selector: "#site-mobile-menu nav", attr: "aria-label" },
  { key: "nav.how.full", selector: '.v5-desktop-nav a[href="#how-it-works"], #site-mobile-menu a[href="#how-it-works"]' },
  { key: "nav.examples.full", selector: '.v5-desktop-nav a[href="#examples"], #site-mobile-menu a[href="#examples"]' },
  { key: "nav.pricing", selector: '.v5-desktop-nav a[href="#pricing"], #site-mobile-menu a[href="#pricing"]' },
  { key: "nav.faq", selector: '.v5-desktop-nav a[href="#faq"], #site-mobile-menu a[href="#faq"]' },
  { key: "cta.create", selector: '.v5-header-cta, #site-mobile-menu a[href="#intake"], .v5-hero-primary, .v5-sticky-cta strong' },
  { key: "v5.menu.note", selector: "#site-mobile-menu > p" },
  { key: "hero.title.1", selector: ".v5-hero h1 > span:nth-child(1)" },
  { key: "hero.title.2", selector: ".v5-hero h1 > span:nth-child(2)" },
  { key: "v5.hero.accent", selector: ".v5-hero h1 > em" },
  { key: "hero.lede", selector: ".v5-hero-copy" },
  { key: "cta.examples", selector: ".v5-text-link", leadingText: true },
  { key: "hero.price", selector: ".v5-price-note" },
  { key: "v5.hero.assurances", selector: ".v5-trust-line", attr: "aria-label" },
  { key: "hero.trust.2.title", selector: ".v5-trust-line li:nth-child(1)", trailingText: true },
  { key: "v5.hero.secure", selector: ".v5-trust-line li:nth-child(2)", trailingText: true },
  { key: "hero.trust.4.title", selector: ".v5-trust-line li:nth-child(3)", trailingText: true },
  { key: "v5.process.kicker", selector: ".v5-process .v5-kicker" },
  { key: "v5.process.title", selector: "#process-title", html: true },
  { key: "v5.process.body", selector: ".v5-process .v5-section-heading > p:last-child" },
  { key: "process.step.1", selector: ".v5-process-step:nth-child(1) h3" },
  { key: "process.step.2", selector: ".v5-process-step:nth-child(2) h3" },
  { key: "process.step.3", selector: ".v5-process-step:nth-child(3) h3" },
  { key: "process.step.4", selector: ".v5-process-step:nth-child(4) h3" },
  { key: "v5.examples.kicker", selector: ".v5-examples .v5-section-heading .v5-kicker" },
  { key: "v5.examples.title", selector: "#examples-title" },
  { key: "v5.examples.body", selector: ".v5-examples .v5-section-heading > p:last-child" },
  { key: "v5.examples.aiden", selector: '[data-book-key="aiden"] > span' },
  { key: "v5.examples.elena", selector: '[data-book-key="elena"] > span' },
  { key: "v5.examples.noah", selector: '[data-book-key="noah"] > span' },
  { key: "preview.kicker", selector: ".flipbook-preview-header .v5-kicker" },
  { key: "preview.helper", selector: "#active-preview-helper" },
  { key: "preview.mobile.tap", selector: ".mobile-tap-hint" },
  { key: "v5.keepsake.kicker", selector: ".v5-keepsake-copy .v5-kicker" },
  { key: "moments.2.title", selector: "#keepsake-title" },
  { key: "moments.2.body", selector: ".v5-keepsake-copy > p:nth-of-type(2)" },
  { key: "trust.5.title", selector: ".v5-keepsake-copy li:nth-child(1) strong" },
  { key: "trust.5.body", selector: ".v5-keepsake-copy li:nth-child(1) span", trailingText: true },
  { key: "trust.4.title", selector: ".v5-keepsake-copy li:nth-child(2) strong" },
  { key: "trust.4.body", selector: ".v5-keepsake-copy li:nth-child(2) span", trailingText: true },
  { key: "trust.3.title", selector: ".v5-keepsake-copy li:nth-child(3) strong" },
  { key: "trust.3.body", selector: ".v5-keepsake-copy li:nth-child(3) span", trailingText: true },
  { key: "v5.keepsake.cta", selector: '.v5-keepsake-copy a[href="#pricing"]' },
  { key: "v5.trust.kicker", selector: ".v5-trust .v5-kicker" },
  { key: "v5.trust.title", selector: "#trust-title" },
  { key: "trust.6.title", selector: ".v5-trust-grid article:nth-child(1) h3" },
  { key: "trust.6.body", selector: ".v5-trust-grid article:nth-child(1) p" },
  { key: "trust.4.title", selector: ".v5-trust-grid article:nth-child(2) h3" },
  { key: "trust.4.body", selector: ".v5-trust-grid article:nth-child(2) p" },
  { key: "hero.trust.3.title", selector: ".v5-trust-grid article:nth-child(3) h3" },
  { key: "hero.trust.3.body", selector: ".v5-trust-grid article:nth-child(3) p" },
  { key: "trust.5.title", selector: ".v5-trust-grid article:nth-child(4) h3" },
  { key: "trust.5.body", selector: ".v5-trust-grid article:nth-child(4) p" },
  { key: "v5.pricing.kicker", selector: ".v5-pricing .v5-kicker" },
  { key: "pricing.title", selector: "#pricing-title", html: true },
  { key: "v5.pricing.body", selector: ".v5-pricing .v5-section-heading > p:last-child" },
  { key: "v5.pricing.digital", selector: ".v5-price-card:nth-child(1) .v5-price-label" },
  { key: "v5.pricing.print", selector: ".v5-price-card:nth-child(2) .v5-price-label" },
  { key: "pricing.digital.1", selector: ".v5-price-card:nth-child(1) li:nth-child(1)" },
  { key: "pricing.digital.2", selector: ".v5-price-card:nth-child(1) li:nth-child(2)" },
  { key: "pricing.digital.3", selector: ".v5-price-card:nth-child(1) li:nth-child(3)" },
  { key: "trust.4.body", selector: ".v5-price-card:nth-child(1) li:nth-child(4)" },
  { key: "pricing.digital.cta", selector: '[data-package-target="digital"]' },
  { key: "pricing.print.1", selector: ".v5-price-card:nth-child(2) li:nth-child(1)" },
  { key: "pricing.print.2", selector: ".v5-price-card:nth-child(2) li:nth-child(2)" },
  { key: "pricing.print.3", selector: ".v5-price-card:nth-child(2) li:nth-child(3)" },
  { key: "pricing.print.4", selector: ".v5-price-card:nth-child(2) li:nth-child(4)" },
  { key: "pricing.print.cta", selector: '[data-package-target="print"]' },
  { key: "pricing.reassurance", selector: ".v5-pricing-reassurance" },
  { key: "v5.faq.kicker", selector: ".v5-faq .v5-kicker" },
  { key: "v5.faq.title", selector: "#faq-title" },
  { key: "faq.8.q", selector: ".v5-faq-list details:nth-child(1) summary", leadingText: true },
  { key: "faq.8.a", selector: ".v5-faq-list details:nth-child(1) p" },
  { key: "faq.5.q", selector: ".v5-faq-list details:nth-child(2) summary", leadingText: true },
  { key: "faq.5.a", selector: ".v5-faq-list details:nth-child(2) p" },
  { key: "faq.4.q", selector: ".v5-faq-list details:nth-child(3) summary", leadingText: true },
  { key: "faq.4.a", selector: ".v5-faq-list details:nth-child(3) p" },
  { key: "faq.7.q", selector: ".v5-faq-list details:nth-child(4) summary", leadingText: true },
  { key: "faq.7.a", selector: ".v5-faq-list details:nth-child(4) p" },
  { key: "v5.intake.kicker", selector: ".v5-intake-intro .v5-kicker" },
  { key: "form.title", selector: "#intake-title" },
  { key: "form.reassurance", selector: ".v5-intake-intro > p:nth-of-type(2)" },
  { key: "v5.intake.steps", selector: ".v5-form-progress", attr: "aria-label" },
  { key: "v5.intake.progress.1", selector: ".v5-form-progress li:nth-child(1)" },
  { key: "v5.intake.progress.2", selector: ".v5-form-progress li:nth-child(2)" },
  { key: "v5.intake.progress.3", selector: ".v5-form-progress li:nth-child(3)" },
  { key: "v5.intake.progress.4", selector: ".v5-form-progress li:nth-child(4)" },
  { key: "v5.intake.assurance", selector: ".v5-intake-assurance strong" },
  { key: "form.assurance.1", selector: ".v5-intake-assurance p", trailingText: true },
  { key: "v5.intake.fieldset.1", selector: ".form-columns fieldset:nth-child(1) legend", preserveFirst: true },
  { key: "form.story", selector: ".form-columns fieldset:nth-child(2) legend", preserveFirst: true },
  { key: "upload.legend", selector: ".form-columns fieldset:nth-child(3) legend", preserveFirst: true },
  { key: "package.legend", selector: ".form-columns fieldset:nth-child(4) legend", preserveFirst: true },
  { key: "form.parent.name", labelFor: 'input[name="parent-name"]' },
  { key: "form.parent.name.placeholder", selector: 'input[name="parent-name"]', attr: "placeholder" },
  { key: "form.email", labelFor: 'input[name="email"]' },
  { key: "form.email.placeholder", selector: 'input[name="email"]', attr: "placeholder" },
  { key: "form.child.name", labelFor: 'input[name="child-name"]' },
  { key: "form.child.name.placeholder", selector: 'input[name="child-name"]', attr: "placeholder" },
  { key: "form.age", labelFor: 'select[name="age"]' },
  { key: "form.age.placeholder", selector: 'select[name="age"] option[value=""]' },
  { key: "form.gender", labelFor: 'select[name="gender"]' },
  { key: "form.gender.placeholder", selector: 'select[name="gender"] option[value=""]' },
  { key: "form.gender.boy", selector: 'select[name="gender"] option[value="Boy"]' },
  { key: "form.gender.girl", selector: 'select[name="gender"] option[value="Girl"]' },
  { key: "form.bookLanguage", labelFor: 'select[name="book-language"]' },
  { key: "form.story.about", labelFor: 'textarea[name="theme"]' },
  { key: "form.story.about.placeholder", selector: 'textarea[name="theme"]', attr: "placeholder" },
  { key: "form.story.loves", labelFor: 'input[name="interests"]' },
  { key: "form.story.loves.placeholder", selector: 'input[name="interests"]', attr: "placeholder" },
  { key: "form.dedication", labelFor: 'textarea[name="dedication"]' },
  { key: "form.dedication.placeholder", selector: 'textarea[name="dedication"]', attr: "placeholder" },
  { key: "upload.title.default", selector: "[data-upload-title]" },
  { key: "upload.detail.default", selector: "[data-upload-detail]" },
  { key: "package.legend", selector: ".package-selector", attr: "aria-label" },
  { key: "package.digital.title", selector: '.package-selector input[value="digital"] + span strong' },
  { key: "package.digital.detail", selector: '.package-selector input[value="digital"] + span em' },
  { key: "package.print.title", selector: '.package-selector input[value="print"] + span strong' },
  { key: "package.print.detail", selector: '.package-selector input[value="print"] + span em' },
  { key: "package.consent", selector: ".consent-check:nth-of-type(1) span", html: true },
  { key: "package.confirm", selector: ".consent-check:nth-of-type(2) span" },
  { key: "form.submit", selector: ".form-submit" },
  { key: "form.secure", selector: ".secure-note", trailingText: true },
  { key: "contact.kicker", selector: ".v5-contact .v5-kicker" },
  { key: "contact.title", selector: "#contact-title" },
  { key: "contact.body", selector: ".v5-contact > div > p:last-child" },
  { key: "contact.name", labelFor: 'input[name="contact-name"]' },
  { key: "form.parent.name.placeholder", selector: 'input[name="contact-name"]', attr: "placeholder" },
  { key: "form.email", labelFor: 'input[name="contact-email"]' },
  { key: "form.email.placeholder", selector: 'input[name="contact-email"]', attr: "placeholder" },
  { key: "contact.help", labelFor: 'textarea[name="contact-message"]' },
  { key: "contact.message.placeholder", selector: 'textarea[name="contact-message"]', attr: "placeholder" },
  { key: "contact.submit", selector: ".contact-submit" },
  { key: "contact.note", selector: ".contact-note" },
  { key: "sticky.aria", selector: ".v5-sticky-cta", attr: "aria-label" },
  { key: "sticky.detail", selector: ".v5-sticky-cta em" },
  { key: "v5.footer.tagline", selector: ".v5-footer > p" },
  { key: "v5.nav.legal", selector: ".v5-footer nav", attr: "aria-label" },
  { key: "footer.privacy", selector: '.v5-footer a[href="privacy.html"]' },
  { key: "footer.terms", selector: '.v5-footer a[href="terms.html"]' },
  { key: "v5.footer.contact", selector: '.v5-footer a[href="#contact"]' },
  { key: "footer.rights", selector: ".v5-footer small" },
];

const normalizeSiteLanguage = (language) => {
  const base = String(language || "").trim().toLowerCase().slice(0, 2);
  return supportedSiteLanguages.includes(base) ? base : "en";
};

const getInitialSiteLanguage = () => {
  try {
    const stored = String(window.localStorage?.getItem(siteLanguageStorageKey) || "")
      .trim()
      .toLowerCase()
      .slice(0, 2);
    if (supportedSiteLanguages.includes(stored)) return stored;
  } catch (_error) {
    // The site still works when browser storage is unavailable.
  }
  return "en";
};

let currentSiteLanguage = getInitialSiteLanguage();

const getSiteCopy = (key, language = currentSiteLanguage) =>
  v5SiteLanguageCopy[language]?.[key] ?? siteLanguageCopy[language]?.[key] ?? "";

const syncMobileMenuLabel = () => {
  if (!mobileMenuToggle) return;

  const isOpen = Boolean(mobileMenu && !mobileMenu.hidden);
  const label = getSiteCopy(isOpen ? "nav.menu.close" : "nav.menu.open");
  mobileMenuToggle.setAttribute("aria-label", label);
  mobileMenuToggle.setAttribute("aria-expanded", String(isOpen));

  const icon = mobileMenuToggle.querySelector(".material-symbols-outlined");
  if (icon) icon.textContent = isOpen ? "close" : "menu";
};

const setMobileMenuOpen = (isOpen, { restoreFocus = false } = {}) => {
  if (!mobileMenu || !mobileMenuToggle) return;

  mobileMenu.hidden = !isOpen;
  document.body.classList.toggle("v3-menu-open", isOpen);
  syncMobileMenuLabel();

  if (restoreFocus) mobileMenuToggle.focus();
};

const setLabelPrefix = (controlSelector, value) => {
  const label = document.querySelector(controlSelector)?.closest("label");
  if (!label || !value) return;

  const textNode = Array.from(label.childNodes).find(
    (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()
  );

  if (textNode) {
    textNode.textContent = `\n                ${value}\n                `;
    return;
  }

  label.prepend(document.createTextNode(`${value} `));
};

const setTrailingText = (element, value) => {
  const textNode = Array.from(element.childNodes)
    .reverse()
    .find((node) => node.nodeType === Node.TEXT_NODE);

  if (textNode) {
    textNode.textContent = ` ${value}`;
    return;
  }

  element.append(document.createTextNode(` ${value}`));
};

const getLocalizedLanguageName = (languageCode) => {
  try {
    const displayNames = new Intl.DisplayNames([currentSiteLanguage], { type: "language" });
    const name = displayNames.of(languageCode);
    if (name) return name.charAt(0).toUpperCase() + name.slice(1);
  } catch (_error) {
    // Fall back to the current option text when Intl.DisplayNames is unavailable.
  }

  return "";
};

const updateBookLanguageOptions = () => {
  document.querySelectorAll('select[name="book-language"] option[value]').forEach((option) => {
    const localizedName = getLocalizedLanguageName(option.value);
    if (localizedName) option.textContent = localizedName;
  });
};

const originalLocalizedValues = new WeakMap();

const getOriginalLocalizedValue = (element, id, read) => {
  let values = originalLocalizedValues.get(element);
  if (!values) {
    values = new Map();
    originalLocalizedValues.set(element, values);
  }
  if (!values.has(id)) values.set(id, read());
  return values.get(id);
};

const findTextNode = (element, fromEnd = false) => {
  const nodes = Array.from(element.childNodes);
  if (fromEnd) nodes.reverse();
  return nodes.find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
};

const applyV5Binding = (binding) => {
  const value = getSiteCopy(binding.key);
  if (!value) return;

  if (binding.labelFor) {
    const label = document.querySelector(binding.labelFor)?.closest("label");
    if (!label) return;
    const textNode = findTextNode(label);
    if (!textNode) return;
    const original = getOriginalLocalizedValue(label, `label:${binding.key}`, () => textNode.textContent);
    textNode.textContent = currentSiteLanguage === "en" ? original : `${value} `;
    return;
  }

  document.querySelectorAll(binding.selector).forEach((element) => {
    const id = `${binding.key}:${binding.attr || (binding.html ? "html" : binding.trailingText ? "trailing" : binding.leadingText ? "leading" : binding.preserveFirst ? "preserveFirst" : "text")}`;
    if (binding.attr) {
      const original = getOriginalLocalizedValue(element, id, () => element.getAttribute(binding.attr) || "");
      element.setAttribute(binding.attr, currentSiteLanguage === "en" ? original : value);
      return;
    }
    if (binding.html) {
      const original = getOriginalLocalizedValue(element, id, () => element.innerHTML);
      element.innerHTML = currentSiteLanguage === "en" ? original : value;
      return;
    }
    if (binding.trailingText || binding.leadingText) {
      const textNode = findTextNode(element, binding.trailingText);
      if (!textNode) return;
      const original = getOriginalLocalizedValue(element, id, () => textNode.textContent);
      textNode.textContent = currentSiteLanguage === "en" ? original : binding.trailingText ? value : `${value} `;
      return;
    }
    if (binding.preserveFirst) {
      const textNode = findTextNode(element, true);
      if (!textNode) return;
      const original = getOriginalLocalizedValue(element, id, () => textNode.textContent);
      textNode.textContent = currentSiteLanguage === "en" ? original : ` ${value}`;
      return;
    }
    const original = getOriginalLocalizedValue(element, id, () => element.textContent);
    element.textContent = currentSiteLanguage === "en" ? original : value;
  });
};

const applySiteLanguageBindings = () => {
  document.documentElement.lang = currentSiteLanguage;
  document.title = getSiteCopy("document.title");

  if (document.body.classList.contains("v5-home")) {
    v5SiteLanguageBindings.forEach(applyV5Binding);
    updateBookLanguageOptions();
    return;
  }

  siteLanguageBindings.forEach((binding) => {
    const value = getSiteCopy(binding.key);
    if (!value) return;

    if (binding.labelFor) {
      setLabelPrefix(binding.labelFor, value);
      return;
    }

    document.querySelectorAll(binding.selector).forEach((element) => {
      if (binding.attr) {
        element.setAttribute(binding.attr, value);
      } else if (binding.html) {
        element.innerHTML = value;
      } else if (binding.trailingText) {
        setTrailingText(element, value);
      } else {
        element.textContent = value;
      }
    });
  });

  updateBookLanguageOptions();
};

const setSiteLanguage = (language, { persist = true } = {}) => {
  currentSiteLanguage = normalizeSiteLanguage(language);
  siteLanguageSelects.forEach((select) => {
    select.value = currentSiteLanguage;
  });

  syncMobileMenuLabel();

  if (persist) {
    try {
      window.localStorage?.setItem(siteLanguageStorageKey, currentSiteLanguage);
    } catch (_error) {
      // Non-essential preference persistence.
    }
  }

  applySiteLanguageBindings();
  window.mirrortaleSiteLanguage = {
    current: currentSiteLanguage,
    t: (key) => getSiteCopy(key),
  };

  if (orderPhotoInput?.files?.length) {
    updatePhotoUploadState();
  } else {
    resetPhotoUploadState();
  }

  if (typeof updatePreviewChrome === "function") updatePreviewChrome();
};

const attributionStorageKey = "mirrortale-attribution-v1";
const attributionKeys = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "platform",
  "creative_id",
];
const photoUploadFieldName = "child-photo";
const maxPhotoUploadBytes = 10 * 1024 * 1024;
const maxOriginalPhotoUploadBytes = 35 * 1024 * 1024;
const photoUploadCanvasMaxEdges = [2400, 2000, 1600];
const photoUploadJpegQualities = [0.9, 0.82, 0.74, 0.66];
const fallbackUploadTitle = uploadTitle?.textContent?.trim() || "Click to upload";
const fallbackUploadDetail =
  uploadDetail?.textContent?.trim() ||
  "A clear, front-facing extreme close-up photo of the child with good lighting works best.";
const photoMimeAliases = new Map([
  ["image/jpeg", "image/jpeg"],
  ["image/jpg", "image/jpeg"],
  ["image/pjpeg", "image/jpeg"],
  ["image/png", "image/png"],
  ["image/x-png", "image/png"],
  ["image/heic", "image/heic"],
  ["image/heif", "image/heif"],
  ["image/webp", "image/webp"],
  ["image/gif", "image/gif"],
  ["image/bmp", "image/bmp"],
  ["image/tiff", "image/tiff"],
  ["image/avif", "image/avif"],
]);
const photoMimeByExtension = new Map([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["jfif", "image/jpeg"],
  ["png", "image/png"],
  ["heic", "image/heic"],
  ["heif", "image/heif"],
  ["webp", "image/webp"],
  ["gif", "image/gif"],
  ["bmp", "image/bmp"],
  ["tif", "image/tiff"],
  ["tiff", "image/tiff"],
  ["avif", "image/avif"],
]);
const photoExtensionByMime = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/heic", "heic"],
  ["image/heif", "heif"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["image/bmp", "bmp"],
  ["image/tiff", "tif"],
  ["image/avif", "avif"],
]);
const createBookPages = ({ title, directory, interiorCount }) => [
  {
    src: `${directory}/cover-front.webp`,
    label: "Front cover",
    alt: `${title} front cover`,
  },
  ...Array.from({ length: interiorCount }, (_, index) => {
    const pageNumber = String(index + 1).padStart(2, "0");
    return {
      src: `${directory}/page-${pageNumber}.webp`,
      label: `Interior page ${index + 1}`,
      alt: `${title} interior page ${index + 1}`,
    };
  }),
  {
    src: `${directory}/cover-back.webp`,
    label: "Back cover",
    alt: `${title} back cover`,
  },
];

const createBookSpreads = (pages) => [
  {
    kind: "closed",
    cover: pages[0],
    label: "Closed book",
    count: "Cover",
  },
  ...Array.from({ length: Math.floor((pages.length - 2) / 2) }, (_, spreadIndex) => {
    const firstPage = spreadIndex * 2 + 1;
    const secondPage = firstPage + 1;

    return {
      kind: "open",
      left: pages[firstPage],
      right: pages[secondPage],
      label: `Open spread ${spreadIndex + 1}`,
      count: `Pages ${firstPage}-${secondPage}`,
    };
  }),
  {
    kind: "closed",
    cover: pages[pages.length - 1],
    label: "Back cover",
    count: "Back cover",
  },
];

const createBook = (book) => {
  const pages = createBookPages(book);
  return {
    ...book,
    pages,
    spreads: createBookSpreads(pages),
  };
};

const bookCatalog = {
  noah: createBook({
    key: "noah",
    title: "Noah Rides the Silver Wind",
    directory: "assets/books/noah",
    interiorCount: 26,
  }),
  aiden: createBook({
    key: "aiden",
    title: "Aiden Braves the Morning Bell",
    directory: "assets/books/aiden",
    interiorCount: 26,
  }),
  elena: createBook({
    key: "elena",
    title: "Elena Stirs Up a Friendship",
    directory: "assets/books/elena",
    interiorCount: 26,
  }),
};

let activeBook = bookCatalog.elena;
let activeViewIndex = 0;
let pageFlip = null;
let pageFlipBookKey = "";
let isSyncingPageFlip = false;
let lastPageTapAt = 0;
let activeMobilePageIndex = 0;
let isBookPreviewActive = false;
let mobileTouchStart = null;
let mobileMouseStart = null;
let mobileSwipeHandledAt = 0;
let mobileReaderAnimationTimer = null;
let mobileImageLoadToken = 0;
const mobilePreloadCache = new Set();

const buildApiUrl = (path) => {
  if (!siteConfig.apiBaseUrl) return "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.apiBaseUrl}${normalizedPath}`;
};

const parseApiResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  const body = await response.text();
  let payload = { message: body };

  if (body && contentType.includes("application/json")) {
    try {
      payload = JSON.parse(body);
    } catch {
      payload = { message: body };
    }
  }

  if (!response.ok) {
    const message =
      payload?.error?.message || payload?.message || "Something went wrong. Please try again.";
    throw new Error(message);
  }

  return payload;
};

const getButtonText = (button) => {
  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent.trim();
  }

  return button.dataset.originalText;
};

const setSubmitState = (button, text, isLoading = false) => {
  button.textContent = text;
  button.disabled = isLoading;
  button.toggleAttribute("aria-busy", isLoading);
};

const setFormStatus = (statusElement, message, tone = "neutral") => {
  if (!statusElement) return;
  statusElement.textContent = message;
  statusElement.dataset.tone = tone;
};

const clearFormStatusSoon = (statusElement, delay = 3200) => {
  window.setTimeout(() => setFormStatus(statusElement, ""), delay);
};

const formatPhotoFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "";

  const megabytes = bytes / (1024 * 1024);
  if (megabytes >= 1) {
    return `${megabytes.toFixed(megabytes >= 10 ? 0 : 1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const getFileExtension = (fileName = "") => {
  const match = String(fileName).toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] || "";
};

const getDeclaredFileType = (file) => String(file?.type || "").split(";")[0].trim().toLowerCase();

const getPhotoMimeType = (file) => {
  const declaredType = getDeclaredFileType(file);
  if (photoMimeAliases.has(declaredType)) return photoMimeAliases.get(declaredType);
  if (declaredType.startsWith("image/") && declaredType !== "image/svg+xml") return declaredType;

  const extension = getFileExtension(file?.name);
  return photoMimeByExtension.get(extension) || "";
};

const isLikelyPhotoFile = (file) => {
  const declaredType = getDeclaredFileType(file);
  const extension = getFileExtension(file?.name);

  if (declaredType === "image/svg+xml" || extension === "svg") return false;
  if (declaredType.startsWith("image/")) return true;
  if (photoMimeByExtension.has(extension)) return true;
  if (declaredType === "application/octet-stream" && !extension) return true;

  // Some in-app browsers strip name/type metadata from camera-roll picks.
  return !declaredType && !extension;
};

const getPhotoUploadBaseName = (file) => {
  const originalName = String(file?.name || "").trim();
  const cleanedName = originalName
    ? originalName.replace(/[\\/:*?"<>|]+/g, "-")
    : "child-photo";

  return cleanedName.replace(/\.[^.]*$/, "") || "child-photo";
};

const getPhotoUploadFileName = (file, mimeType) => {
  const fallbackExtension = photoExtensionByMime.get(mimeType) || "jpg";
  const originalName = String(file?.name || "").trim();
  const cleanedName = originalName
    ? originalName.replace(/[\\/:*?"<>|]+/g, "-")
    : `child-photo.${fallbackExtension}`;
  const extension = getFileExtension(cleanedName);

  if (photoMimeByExtension.get(extension) === mimeType) return cleanedName;

  return `${getPhotoUploadBaseName(file)}.${fallbackExtension}`;
};

const getJpegPhotoUploadFileName = (file) => `${getPhotoUploadBaseName(file)}.jpg`;

const createPhotoUploadFile = (file, mimeType, fileName) => {
  if (file.type === mimeType && file.name === fileName) return file;

  try {
    return new File([file], fileName, {
      type: mimeType,
      lastModified: file.lastModified || Date.now(),
    });
  } catch {
    return new Blob([file], { type: mimeType });
  }
};

const canvasToBlob = (canvas, type, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

const loadPhotoImage = (file) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("The selected photo could not be read in this browser."));
    };

    image.decoding = "async";
    image.src = url;
  });

const renderPhotoToJpegBlob = async (image, maxEdge, quality) => {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;

  if (!sourceWidth || !sourceHeight) {
    throw new Error("The selected photo does not have readable dimensions.");
  }

  const scale = Math.min(1, maxEdge / Math.max(sourceWidth, sourceHeight));
  const width = Math.max(1, Math.round(sourceWidth * scale));
  const height = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("This browser could not prepare the photo.");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  return canvasToBlob(canvas, "image/jpeg", quality);
};

const convertPhotoToJpeg = async (file) => {
  const image = await loadPhotoImage(file);
  let smallestBlob = null;

  for (const maxEdge of photoUploadCanvasMaxEdges) {
    for (const quality of photoUploadJpegQualities) {
      const blob = await renderPhotoToJpegBlob(image, maxEdge, quality);
      if (!blob) continue;

      if (!smallestBlob || blob.size < smallestBlob.size) {
        smallestBlob = blob;
      }

      if (blob.size <= maxPhotoUploadBytes) return blob;
    }
  }

  return smallestBlob;
};

const getPhotoValidation = () => {
  const files = orderPhotoInput?.files;
  const fileCount = files?.length || 0;

  if (!fileCount) {
    return {
      isValid: false,
      file: null,
      message: getSiteCopy("upload.error.missing"),
    };
  }

  if (fileCount !== 1) {
    return {
      isValid: false,
      file: files[0] || null,
      message: getSiteCopy("upload.error.count"),
    };
  }

  const file = files[0];

  if (!Number.isFinite(file.size) || file.size <= 0) {
    return {
      isValid: false,
      file,
      message: getSiteCopy("upload.error.attach"),
    };
  }

  if (file.size > maxOriginalPhotoUploadBytes) {
    return {
      isValid: false,
      file,
      message: getSiteCopy("upload.error.largeOriginal"),
    };
  }

  if (!isLikelyPhotoFile(file)) {
    return {
      isValid: false,
      file,
      message: getSiteCopy("upload.error.type"),
    };
  }

  const mimeType = getPhotoMimeType(file);
  const fileName = mimeType ? getPhotoUploadFileName(file, mimeType) : getJpegPhotoUploadFileName(file);

  return {
    isValid: true,
    file,
    fileName,
    mimeType,
    uploadFile: null,
    message: getSiteCopy("upload.message.selected"),
  };
};

const preparePhotoUpload = async (validation) => {
  if (!validation?.isValid || !validation.file) return validation;

  const { file } = validation;

  setUploadStatus(getSiteCopy("upload.message.preparing"), "neutral");

  try {
    const jpegBlob = await convertPhotoToJpeg(file);

    if (!jpegBlob || jpegBlob.size <= 0) {
      throw new Error("The selected photo could not be prepared.");
    }

    if (jpegBlob.size > maxPhotoUploadBytes) {
      return {
        ...validation,
        isValid: false,
        uploadFile: null,
        message: getSiteCopy("upload.error.largePrepared"),
      };
    }

    const fileName = getJpegPhotoUploadFileName(file);
    return {
      ...validation,
      isValid: true,
      file,
      fileName,
      mimeType: "image/jpeg",
      uploadFile: createPhotoUploadFile(jpegBlob, "image/jpeg", fileName),
      message: getSiteCopy("upload.message.prepared"),
    };
  } catch {
    return {
      ...validation,
      isValid: false,
      uploadFile: null,
      message: getSiteCopy("upload.error.prepare"),
    };
  }
};

const setUploadStatus = (message = "", tone = "neutral") => {
  if (!uploadStatus) return;
  uploadStatus.textContent = message;
  uploadStatus.dataset.tone = tone;
};

const resetPhotoUploadState = () => {
  uploadCard?.classList.remove("is-selected", "has-error");
  if (uploadTitle) uploadTitle.textContent = getSiteCopy("upload.title.default") || fallbackUploadTitle;
  if (uploadDetail) uploadDetail.textContent = getSiteCopy("upload.detail.default") || fallbackUploadDetail;
  setUploadStatus("");
};

const updatePhotoUploadState = ({ showMissingError = false } = {}) => {
  const validation = getPhotoValidation();

  if (!validation.file && !showMissingError) {
    resetPhotoUploadState();
    return validation;
  }

  uploadCard?.classList.toggle("is-selected", validation.isValid);
  uploadCard?.classList.toggle("has-error", !validation.isValid);

  if (uploadTitle) {
    uploadTitle.textContent = validation.isValid
      ? getSiteCopy("upload.title.accepted")
      : getSiteCopy("upload.title.error");
  }

  if (uploadDetail) {
    const fileSize = formatPhotoFileSize(validation.file?.size);
    uploadDetail.textContent = validation.isValid
      ? [getSiteCopy("upload.detail.accepted"), validation.file?.name, fileSize].filter(Boolean).join(" - ")
      : validation.message;
  }

  setUploadStatus(validation.message, validation.isValid ? "success" : "error");
  return validation;
};

const showPhotoUploadResult = (validation) => {
  if (!validation) return;

  uploadCard?.classList.toggle("is-selected", validation.isValid);
  uploadCard?.classList.toggle("has-error", !validation.isValid);

  if (uploadTitle) {
    uploadTitle.textContent = validation.isValid
      ? getSiteCopy("upload.title.accepted")
      : getSiteCopy("upload.title.error");
  }

  if (uploadDetail) {
    const fileSize = formatPhotoFileSize(validation.file?.size);
    uploadDetail.textContent = validation.isValid
      ? [getSiteCopy("upload.detail.accepted"), validation.file?.name, fileSize].filter(Boolean).join(" - ")
      : validation.message;
  }

  setUploadStatus(validation.message, validation.isValid ? "success" : "error");
};

const setFormDataPhoto = (formData, validation) => {
  if (!validation?.uploadFile) return;

  if (typeof formData.set === "function") {
    formData.set(photoUploadFieldName, validation.uploadFile, validation.fileName);
    return;
  }

  if (typeof formData.delete === "function") {
    formData.delete(photoUploadFieldName);
  }

  formData.append(photoUploadFieldName, validation.uploadFile, validation.fileName);
};

const safeStorageGet = (key) => {
  try {
    return window.localStorage?.getItem(key) || "";
  } catch {
    return "";
  }
};

const safeStorageSet = (key, value) => {
  try {
    window.localStorage?.setItem(key, value);
  } catch {
    // Attribution is helpful for measurement, but it must never block checkout.
  }
};

const readStoredAttribution = () => {
  const stored = safeStorageGet(attributionStorageKey);
  if (!stored) return {};

  try {
    return JSON.parse(stored);
  } catch {
    return {};
  }
};

const cleanAttributionValue = (value) => String(value || "").trim().slice(0, 240);

const getUrlAttribution = () => {
  const params = new URLSearchParams(window.location.search);
  const attribution = {};

  attributionKeys.forEach((key) => {
    const value = cleanAttributionValue(params.get(key));
    if (value) attribution[key] = value;
  });

  if (!attribution.creative_id && attribution.utm_content) {
    attribution.creative_id = attribution.utm_content;
  }

  return attribution;
};

const captureMarketingAttribution = () => {
  const current = getUrlAttribution();
  if (!Object.keys(current).length) return;

  const stored = readStoredAttribution();
  const touch = {
    ...current,
    landing_url: window.location.href,
    referrer: document.referrer || null,
    captured_at: new Date().toISOString(),
  };

  safeStorageSet(
    attributionStorageKey,
    JSON.stringify({
      firstTouch: stored.firstTouch || touch,
      lastTouch: touch,
    })
  );
};

const getMarketingAttribution = () => {
  const stored = readStoredAttribution();
  const current = getUrlAttribution();
  const fallbackTouch = Object.keys(current).length
    ? {
        ...current,
        landing_url: window.location.href,
        referrer: document.referrer || null,
      }
    : {};

  return {
    firstTouch: stored.firstTouch || fallbackTouch,
    lastTouch: stored.lastTouch || fallbackTouch,
  };
};

const appendMarketingAttribution = (formData) => {
  const attribution = getMarketingAttribution();

  ["firstTouch", "lastTouch"].forEach((touchKey) => {
    Object.entries(attribution[touchKey] || {}).forEach(([key, value]) => {
      const cleanValue = cleanAttributionValue(value);
      if (cleanValue) formData.append(`marketing_${touchKey}_${key}`, cleanValue);
    });
  });
};

const createContactPayload = (formElement) => {
  const fields = Object.fromEntries(new FormData(formElement).entries());

  return {
    name: String(fields["contact-name"] || "").trim(),
    email: String(fields["contact-email"] || "").trim(),
    message: String(fields["contact-message"] || "").trim(),
    source: {
      page: window.location.href,
      referrer: document.referrer || null,
      attribution: getMarketingAttribution(),
    },
  };
};

captureMarketingAttribution();

const shouldKeepHeroPoster = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
  Boolean(navigator.connection?.saveData);

const hydrateHeroVideo = () => {
  if (!heroVideo || heroVideo.dataset.loaded === "true") return;

  if (shouldKeepHeroPoster()) {
    heroVideo.dataset.state = "poster";
    return;
  }

  heroVideo.dataset.loaded = "true";
  heroVideo.querySelectorAll("source[data-src]").forEach((source) => {
    source.src = source.dataset.src;
    source.removeAttribute("data-src");
  });

  const markPosterFallback = () => {
    heroVideo.dataset.state = "poster";
  };

  const playHeroVideo = () => {
    const playback = heroVideo.play();
    if (!playback?.catch) return;

    playback
      .then(() => {
        heroVideo.dataset.state = "playing";
      })
      .catch(markPosterFallback);
  };

  heroVideo.addEventListener("error", markPosterFallback, { once: true });
  heroVideo.addEventListener("canplay", playHeroVideo, { once: true });
  heroVideo.load();
};

const scheduleHeroVideo = () => {
  if (!heroVideo) return;

  const queueHydration = () => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(hydrateHeroVideo, { timeout: 1600 });
      return;
    }

    window.setTimeout(hydrateHeroVideo, 700);
  };

  if (document.readyState === "complete") {
    queueHydration();
  } else {
    window.addEventListener("load", queueHydration, { once: true });
  }
};

scheduleHeroVideo();

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add("is-visible"));
}

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 16);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

let isStickyCtaTicking = false;

const updateMobileStickyCta = () => {
  isStickyCtaTicking = false;
  if (!mobileStickyCta) return;

  const intakeRect = intakeSection?.getBoundingClientRect();
  const intakeIsVisible = Boolean(
    intakeRect &&
      intakeRect.top < window.innerHeight * 0.82 &&
      intakeRect.bottom > window.innerHeight * 0.18
  );
  const contactRect = contactSection?.getBoundingClientRect();
  const contactIsVisible = Boolean(
    contactRect &&
      contactRect.top < window.innerHeight * 0.82 &&
      contactRect.bottom > window.innerHeight * 0.18
  );
  const pricingRect = pricingSection?.getBoundingClientRect();
  const pricingIsVisible = Boolean(
    pricingRect &&
      pricingRect.top < window.innerHeight * 0.82 &&
      pricingRect.bottom > window.innerHeight * 0.18
  );
  const finalCtaRect = finalCtaSection?.getBoundingClientRect();
  const finalCtaIsVisible = Boolean(
    finalCtaRect &&
      finalCtaRect.top < window.innerHeight * 0.82 &&
      finalCtaRect.bottom > window.innerHeight * 0.18
  );
  const heroCtaRect = heroPrimaryCta?.getBoundingClientRect();
  const heroCtaHasLeftViewport = Boolean(
    heroCtaRect && heroCtaRect.bottom < (header?.offsetHeight || 64)
  );
  const shouldShow =
    mobileStickyCtaMedia.matches &&
    heroCtaHasLeftViewport &&
    !document.body.classList.contains("v3-menu-open") &&
    !finalCtaIsVisible &&
    !pricingIsVisible &&
    !intakeIsVisible &&
    !contactIsVisible;

  mobileStickyCta.classList.toggle("is-visible", shouldShow);
  mobileStickyCta.classList.toggle(
    "is-near-intake",
    finalCtaIsVisible || pricingIsVisible || intakeIsVisible || contactIsVisible
  );
  document.body.classList.toggle("has-mobile-sticky-cta", shouldShow);
};

const scheduleMobileStickyCtaUpdate = () => {
  if (isStickyCtaTicking) return;
  isStickyCtaTicking = true;
  window.requestAnimationFrame(updateMobileStickyCta);
};

updateMobileStickyCta();
window.addEventListener("scroll", scheduleMobileStickyCtaUpdate, { passive: true });
window.addEventListener("resize", scheduleMobileStickyCtaUpdate);
if (mobileStickyCtaMedia.addEventListener) {
  mobileStickyCtaMedia.addEventListener("change", scheduleMobileStickyCtaUpdate);
} else {
  mobileStickyCtaMedia.addListener(scheduleMobileStickyCtaUpdate);
}

mobileMenuToggle?.addEventListener("click", () => {
  setMobileMenuOpen(Boolean(mobileMenu?.hidden));
  scheduleMobileStickyCtaUpdate();
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    setMobileMenuOpen(false);
    scheduleMobileStickyCtaUpdate();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || mobileMenu?.hidden) return;
  setMobileMenuOpen(false, { restoreFocus: true });
  scheduleMobileStickyCtaUpdate();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900 && mobileMenu && !mobileMenu.hidden) {
    setMobileMenuOpen(false);
  }
});

document.querySelectorAll(".faq-list details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (!detail.open) return;

    document.querySelectorAll(".faq-list details").forEach((other) => {
      if (other !== detail) other.removeAttribute("open");
    });
  });
});

const updateSelectedPackage = () => {
  packageOptions.forEach((option) => {
    const input = option.querySelector("input");
    option.classList.toggle("is-disabled", Boolean(input?.disabled));
    option.classList.toggle("is-selected", Boolean(input?.checked));
  });
};

const selectPackage = (packageValue) => {
  const input = Array.from(document.querySelectorAll('input[name="package"]')).find(
    (option) => option.value === packageValue
  );

  if (!input || input.disabled) return false;

  input.checked = true;
  input.dispatchEvent(new Event("change", { bubbles: true }));
  updateSelectedPackage();

  return true;
};

packageOptions.forEach((option) => {
  option.addEventListener("change", (event) => {
    updateSelectedPackage();

    const input = event.target?.matches?.('input[name="package"]')
      ? event.target
      : option.querySelector('input[name="package"]');

    if (input?.checked) {
      trackAnalyticsEvent("package_selected", {
        package: input.value,
        site_language: currentSiteLanguage,
      });
    }
  });
});

updateSelectedPackage();

orderPhotoInput?.addEventListener("change", () => {
  const validation = updatePhotoUploadState();
  if (validation.isValid) {
    trackAnalyticsEvent("photo_selected", {
      photo_type: getPhotoMimeType(validation.file) || "unknown",
      photo_size_mb: Number((validation.file.size / (1024 * 1024)).toFixed(2)),
    });
  }
});

orderPhotoInput?.addEventListener("cancel", () => {
  updatePhotoUploadState();
});

orderPhotoInput?.addEventListener("invalid", () => {
  updatePhotoUploadState({ showMissingError: true });
});

window.addEventListener("pageshow", () => {
  updatePhotoUploadState();
});

packageTargetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    trackAnalyticsEvent("package_cta_click", {
      package: button.dataset.packageTarget,
      location: button.closest("section[id]")?.id || "pricing",
      site_language: currentSiteLanguage,
    });
    selectPackage(button.dataset.packageTarget);
  });
});

const flipbook = {
  viewer: document.querySelector("#noah-flipbook"),
  pageFlipRoot: document.querySelector("#noah-pageflip"),
  pageFlipShell: document.querySelector("#noah-pageflip-shell"),
  pageCount: document.querySelector("#noah-page-count"),
  mobileReader: document.querySelector("#mobile-book-reader"),
  mobileImage: document.querySelector(".mobile-book-image"),
  mobileProgress: document.querySelector("#mobile-book-progress"),
  previewTitle: document.querySelector("#active-preview-title"),
  previewBookTitle: document.querySelector("#active-preview-title .preview-title-book"),
  previewHelper: document.querySelector("#active-preview-helper"),
};

const viewToPageIndex = (viewIndex) => {
  if (viewIndex <= 0) return 0;
  if (viewIndex >= activeBook.spreads.length - 1) return activeBook.pages.length - 1;
  return 1 + (viewIndex - 1) * 2;
};

const pageIndexToView = (pageIndex) => {
  if (pageIndex <= 0) return 0;
  if (pageIndex >= activeBook.pages.length - 1) return activeBook.spreads.length - 1;
  return Math.ceil(pageIndex / 2);
};

const updatePreviewChrome = () => {
  exampleBooks.forEach((card) => {
    const isActive = card.dataset.bookSlot === activeBook.key;
    const link = card.querySelector(".example-book-link");
    const badge = card.querySelector(".example-book-badge");

    card.classList.toggle("is-active", isActive);
    if (link) {
      if (isActive) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    }
    if (badge) {
      badge.textContent = isActive
        ? getSiteCopy("preview.badge.active")
        : getSiteCopy("preview.badge.inactive");
    }
  });

  if (flipbook.previewBookTitle) {
    flipbook.previewBookTitle.textContent = activeBook.title;
  } else if (flipbook.previewTitle) {
    flipbook.previewTitle.textContent = `${getSiteCopy("preview.prefix")} ${activeBook.title}`;
  }

  if (flipbook.previewHelper) {
    flipbook.previewHelper.textContent =
      activeMobilePageIndex <= 0
        ? getSiteCopy("preview.coverHelper")
        : getSiteCopy("preview.helper");
  }
};

const updateFlipbook = () => {
  const view = activeBook.spreads[activeViewIndex];

  if (flipbook.viewer) flipbook.viewer.dataset.book = activeBook.key;
  if (flipbook.pageCount) flipbook.pageCount.textContent = view.count;
  if (flipbook.pageFlipRoot) {
    flipbook.pageFlipRoot.setAttribute("aria-label", `Interactive ${activeBook.title} flipbook`);
  }

  if (flipbook.pageFlipShell) {
    flipbook.pageFlipShell.classList.toggle("is-front-cover", activeViewIndex === 0);
    flipbook.pageFlipShell.classList.toggle("is-back-cover", activeViewIndex === activeBook.spreads.length - 1);
    flipbook.pageFlipShell.classList.toggle("is-spread", view.kind === "open");
  }

  updatePreviewChrome();
};

const getMobilePageCount = () => {
  if (activeMobilePageIndex <= 0) return getSiteCopy("preview.mobile.cover");
  if (activeMobilePageIndex >= activeBook.pages.length - 1) return getSiteCopy("preview.mobile.back");
  return getSiteCopy("preview.mobile.page")
    .replace("{current}", activeMobilePageIndex)
    .replace("{total}", activeBook.pages.length - 2);
};

const getMobilePageState = () => {
  if (activeMobilePageIndex <= 0) return "closed";
  if (activeMobilePageIndex >= activeBook.pages.length - 1) return "back-cover";
  return "open";
};

const preloadMobilePage = (pageIndex) => {
  const page = activeBook.pages[pageIndex];
  if (!page || mobilePreloadCache.has(page.src)) return;

  mobilePreloadCache.add(page.src);
  const image = new Image();
  image.decoding = "async";
  image.src = page.src;
};

const preloadNearbyMobilePages = () => {
  preloadMobilePage(activeMobilePageIndex - 1);
  preloadMobilePage(activeMobilePageIndex + 1);
};

const renderMobileReader = (direction = 0) => {
  if (!flipbook.mobileReader || !flipbook.mobileImage) return;

  const page = activeBook.pages[activeMobilePageIndex] || activeBook.pages[0];
  const state = getMobilePageState();
  const pageCount = getMobilePageCount();
  const loadToken = ++mobileImageLoadToken;

  const animateLoadedPage = () => {
    if (direction === 0) return;

    flipbook.mobileReader.classList.remove("is-turning-next", "is-turning-prev");
    void flipbook.mobileReader.offsetWidth;
    flipbook.mobileReader.classList.add(direction > 0 ? "is-turning-next" : "is-turning-prev");

    window.clearTimeout(mobileReaderAnimationTimer);
    mobileReaderAnimationTimer = window.setTimeout(() => {
      flipbook.mobileReader?.classList.remove("is-turning-next", "is-turning-prev");
    }, 560);
  };

  const commitMobilePage = (nextImage = flipbook.mobileImage) => {
    if (loadToken !== mobileImageLoadToken) return;

    if (nextImage !== flipbook.mobileImage) {
      flipbook.mobileImage.replaceWith(nextImage);
      flipbook.mobileImage = nextImage;
    }

    flipbook.mobileReader.dataset.book = activeBook.key;
    flipbook.mobileReader.dataset.state = state;
    flipbook.mobileReader.setAttribute(
      "aria-label",
      `Mobile ${activeBook.title} book preview, ${pageCount}`
    );

    if (flipbook.mobileProgress) {
      flipbook.mobileProgress.textContent = pageCount;
    }

    flipbook.mobileReader.classList.remove("is-loading");
    updatePreviewChrome();
    animateLoadedPage();
    if (isBookPreviewActive) preloadNearbyMobilePages();
  };

  flipbook.mobileReader.classList.add("is-loading");

  if (flipbook.mobileImage.getAttribute("src") === page.src) {
    flipbook.mobileImage.alt = page.alt;
    commitMobilePage();
    return;
  }

  const nextImage = flipbook.mobileImage.cloneNode(false);
  nextImage.src = page.src;
  nextImage.alt = page.alt;
  nextImage.draggable = false;
  nextImage.decoding = "async";

  let didFinishLoading = false;
  const finishLoading = () => {
    if (didFinishLoading) return;
    didFinishLoading = true;
    commitMobilePage(nextImage);
  };
  nextImage.addEventListener("load", finishLoading, { once: true });
  nextImage.addEventListener("error", finishLoading, { once: true });

  if (nextImage.complete) {
    window.requestAnimationFrame(finishLoading);
  } else if (nextImage.decode) {
    nextImage.decode().then(finishLoading).catch(() => {
      if (nextImage.complete) finishLoading();
    });
  }
};

const goToMobilePage = (nextIndex) => {
  const boundedIndex = Math.min(Math.max(nextIndex, 0), activeBook.pages.length - 1);

  if (boundedIndex === activeMobilePageIndex) {
    renderMobileReader();
    return;
  }

  const direction = boundedIndex > activeMobilePageIndex ? 1 : -1;
  activeMobilePageIndex = boundedIndex;
  renderMobileReader(direction);
  trackAnalyticsEvent("book_preview_page_turned", {
    book: activeBook.key,
    direction: direction > 0 ? "next" : "previous",
    page_index: activeMobilePageIndex,
    preview_mode: "mobile",
  });
};

const handleMobileReaderClick = (event) => {
  if (!flipbook.mobileReader) return;
  if (event.target.closest("a, button, input, select, textarea, label")) return;
  if (Date.now() - mobileSwipeHandledAt < 360) return;

  if (activeMobilePageIndex <= 0) {
    goToMobilePage(1);
    return;
  }

  const bounds = flipbook.mobileReader.getBoundingClientRect();
  const isPreviousTap = event.clientX < bounds.left + bounds.width / 2;
  goToMobilePage(activeMobilePageIndex + (isPreviousTap ? -1 : 1));
};

const handleMobileTouchStart = (event) => {
  const touch = event.touches?.[0];
  if (!touch) return;

  mobileTouchStart = {
    x: touch.clientX,
    y: touch.clientY,
    time: Date.now(),
  };
};

const handleMobileTouchEnd = (event) => {
  const touch = event.changedTouches?.[0];
  if (!touch || !mobileTouchStart) return;

  const deltaX = touch.clientX - mobileTouchStart.x;
  const deltaY = touch.clientY - mobileTouchStart.y;
  const isHorizontalSwipe = Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;
  mobileTouchStart = null;

  if (!isHorizontalSwipe) return;

  event.preventDefault();
  mobileSwipeHandledAt = Date.now();
  goToMobilePage(activeMobilePageIndex + (deltaX < 0 ? 1 : -1));
};

const handleMobileMouseDown = (event) => {
  if (event.button !== 0) return;

  mobileMouseStart = {
    x: event.clientX,
    y: event.clientY,
    time: Date.now(),
  };
};

const handleMobileMouseUp = (event) => {
  if (!mobileMouseStart) return;

  const deltaX = event.clientX - mobileMouseStart.x;
  const deltaY = event.clientY - mobileMouseStart.y;
  const isHorizontalSwipe = Math.abs(deltaX) > 42 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25;
  mobileMouseStart = null;

  if (!isHorizontalSwipe) return;

  event.preventDefault();
  mobileSwipeHandledAt = Date.now();
  goToMobilePage(activeMobilePageIndex + (deltaX < 0 ? 1 : -1));
};

const handleMobileReaderKeydown = (event) => {
  if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    goToMobilePage(activeMobilePageIndex + 1);
  }

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToMobilePage(activeMobilePageIndex - 1);
  }
};

const syncPageFlipToView = (viewIndex, direction, previousIndex) => {
  if (!pageFlip || isSyncingPageFlip) return;

  const targetPageIndex = viewToPageIndex(viewIndex);

  if (Math.abs(viewIndex - previousIndex) <= 1) {
    direction > 0 ? pageFlip.flipNext("bottom") : pageFlip.flipPrev("bottom");
    return;
  }

  pageFlip.flip(targetPageIndex, direction > 0 ? "bottom" : "top");
};

const goToBookView = (nextIndex, options = {}) => {
  if (nextIndex < 0 || nextIndex >= activeBook.spreads.length) return;
  if (nextIndex === activeViewIndex) {
    updateFlipbook();
    return;
  }

  const { syncPageFlip = true } = options;
  const previousIndex = activeViewIndex;
  const direction = nextIndex > activeViewIndex ? 1 : -1;
  activeViewIndex = nextIndex;
  updateFlipbook();
  trackAnalyticsEvent("book_preview_page_turned", {
    book: activeBook.key,
    direction: direction > 0 ? "next" : "previous",
    view_index: activeViewIndex,
    preview_mode: "desktop",
  });

  if (syncPageFlip) syncPageFlipToView(nextIndex, direction, previousIndex);
};

document.querySelectorAll("[data-preview-target]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const target = document.getElementById(trigger.dataset.previewTarget);
    if (!target) return;

    event.preventDefault();
    const selectedBookKey = trigger.dataset.bookKey || "noah";
    trackAnalyticsEvent("book_preview_opened", {
      book: selectedBookKey,
      location: trigger.closest("section[id]")?.id || "examples",
      site_language: currentSiteLanguage,
    });
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("book", selectedBookKey);
    nextUrl.hash = target.id;

    isBookPreviewActive = true;
    selectBook(selectedBookKey);
    ensurePageFlipInitialized();
    window.history.replaceState(null, "", nextUrl);
    target.scrollIntoView({
      behavior: "smooth",
      block: window.matchMedia("(max-width: 640px)").matches ? "start" : "center",
    });
  });
});

const syncViewFromPageFlip = (pageIndex) => {
  const nextViewIndex = pageIndexToView(pageIndex);
  if (nextViewIndex === activeViewIndex) return;

  isSyncingPageFlip = true;
  goToBookView(nextViewIndex, { syncPageFlip: false });
  isSyncingPageFlip = false;
};

const handleBookTap = (event) => {
  if (!pageFlip || !flipbook.pageFlipShell) return;
  if (event.target.closest("a, button, input, select, textarea, label")) return;

  event.preventDefault();
  event.stopPropagation();

  const now = Date.now();
  if (now - lastPageTapAt < 650) return;
  lastPageTapAt = now;

  const bounds = flipbook.pageFlipRoot?.getBoundingClientRect() || flipbook.pageFlipShell.getBoundingClientRect();
  const isPreviousTap = event.clientX < bounds.left + bounds.width / 2;
  goToBookView(activeViewIndex + (isPreviousTap ? -1 : 1));
};

function selectBook(bookKey) {
  const nextBook = bookCatalog[bookKey] || bookCatalog.noah;
  const isNewBook = nextBook.key !== activeBook.key;

  activeBook = nextBook;
  activeViewIndex = 0;
  activeMobilePageIndex = 0;
  updateFlipbook();
  renderMobileReader();

  if (!pageFlip) return;

  if (isNewBook || pageFlipBookKey !== activeBook.key) {
    initPageFlip();
    return;
  }

  pageFlip.flip(0, "top");
}

const resetPageFlipRoot = () => {
  if (!flipbook.pageFlipShell) return null;

  if (pageFlip?.destroy) {
    try {
      pageFlip.destroy();
    } catch (_error) {
      // A fresh root below is the reliable fallback if the vendor instance is mid-animation.
    }
  }

  pageFlip = null;
  pageFlipBookKey = "";
  flipbook.pageFlipShell.textContent = "";
  const root = document.createElement("div");
  root.className = "pageflip-book";
  root.id = "noah-pageflip";
  root.setAttribute("aria-label", `Interactive ${activeBook.title} flipbook`);
  flipbook.pageFlipShell.append(root);
  flipbook.pageFlipRoot = root;

  return root;
};

const initPageFlip = () => {
  if (!window.St?.PageFlip) return;
  if (pageFlip && pageFlipBookKey === activeBook.key) return;

  const root = resetPageFlipRoot();
  if (!root) return;

  const pageElements = activeBook.pages.map((page, index) => {
    const item = document.createElement("div");
    item.className = "pageflip-page";
    if (index === 0 || index === activeBook.pages.length - 1) item.dataset.density = "hard";

    const image = document.createElement("img");
    image.src = page.src;
    image.alt = page.alt;
    image.draggable = false;
    image.decoding = "async";
    if (index > 1) image.loading = "lazy";
    item.append(image);

    return item;
  });

  pageFlip = new window.St.PageFlip(root, {
    width: 520,
    height: 520,
    size: "stretch",
    minWidth: 260,
    maxWidth: 560,
    minHeight: 260,
    maxHeight: 560,
    drawShadow: true,
    flippingTime: 1000,
    usePortrait: false,
    startZIndex: 10,
    autoSize: true,
    maxShadowOpacity: 0.72,
    showCover: true,
    mobileScrollSupport: true,
    swipeDistance: 24,
    clickEventForward: true,
    useMouseEvents: false,
    showPageCorners: true,
  });

  pageFlip.loadFromHTML(pageElements);
  pageFlipBookKey = activeBook.key;
  pageFlip.on("flip", (event) => syncViewFromPageFlip(Number(event.data) || 0));
  pageFlip.on("init", (event) => syncViewFromPageFlip(Number(event.data?.page) || 0));
};

const ensurePageFlipInitialized = () => {
  isBookPreviewActive = true;
  if (pageFlip && pageFlipBookKey === activeBook.key) return;
  initPageFlip();
};

const scheduleLazyPageFlipInit = () => {
  if (!flipbook.viewer) return;

  if (!("IntersectionObserver" in window)) return;

  const pageFlipObserver = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      ensurePageFlipInitialized();
      pageFlipObserver.disconnect();
    },
    {
      rootMargin: "220px 0px",
      threshold: 0.01,
    }
  );

  pageFlipObserver.observe(flipbook.viewer);
};

if (flipbook.viewer) {
  updateFlipbook();
  renderMobileReader();
  flipbook.pageFlipShell?.addEventListener("click", handleBookTap, true);
  flipbook.mobileReader?.addEventListener("click", handleMobileReaderClick);
  flipbook.mobileReader?.addEventListener("keydown", handleMobileReaderKeydown);
  flipbook.mobileReader?.addEventListener("touchstart", handleMobileTouchStart, { passive: true });
  flipbook.mobileReader?.addEventListener("touchend", handleMobileTouchEnd, { passive: false });
  flipbook.mobileReader?.addEventListener("mousedown", handleMobileMouseDown);
  flipbook.mobileReader?.addEventListener("mouseup", handleMobileMouseUp);

  const initialBookKey = new URLSearchParams(window.location.search).get("book");
  if (initialBookKey) selectBook(initialBookKey);
  if (window.location.hash === "#noah-flipbook" || window.location.hash === "#examples") {
    ensurePageFlipInitialized();
  } else {
    scheduleLazyPageFlipInit();
  }
}

siteLanguageSelects.forEach((select) => {
  select.addEventListener("change", () => {
    setSiteLanguage(select.value);
    trackAnalyticsEvent("language_changed", {
      site_language: currentSiteLanguage,
    });
  });
});

setSiteLanguage(currentSiteLanguage, { persist: false });

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = form.querySelector(".form-submit");
  if (!button) return;

  const statusElement = form.querySelector(".form-status");
  const originalText = getButtonText(button);
  const ordersUrl = buildApiUrl(apiEndpoints.orders);
  const photoValidation = updatePhotoUploadState({ showMissingError: true });

  if (!photoValidation.isValid) {
    trackAnalyticsEvent("checkout_validation_error", {
      reason: "photo_invalid",
      package: getSelectedPackageValue(),
      site_language: currentSiteLanguage,
    });
    setFormStatus(statusElement, photoValidation.message, "error");
    orderPhotoInput?.focus();
    return;
  }

  const checkoutAnalyticsParams = {
    package: getSelectedPackageValue(),
    book_language: getSelectedBookLanguage(),
    site_language: currentSiteLanguage,
  };
  trackAnalyticsEvent("checkout_started", checkoutAnalyticsParams);

  if (!ordersUrl) {
    trackAnalyticsEvent("checkout_mocked", checkoutAnalyticsParams);
    setSubmitState(button, getSiteCopy("status.checkout.mock.button"));
    setFormStatus(
      statusElement,
      getSiteCopy("status.checkout.mock.message"),
      "neutral"
    );
    button.classList.add("is-complete");

    window.setTimeout(() => {
      setSubmitState(button, originalText);
      button.classList.remove("is-complete");
      setFormStatus(statusElement, "");
    }, 2600);

    return;
  }

  button.classList.remove("is-complete");
  setSubmitState(button, getSiteCopy("status.checkout.preparing.button"), true);
  setFormStatus(statusElement, getSiteCopy("status.checkout.preparing.message"), "neutral");

  try {
    const preparedPhoto = await preparePhotoUpload(photoValidation);
    showPhotoUploadResult(preparedPhoto);

    if (!preparedPhoto?.isValid || !preparedPhoto.uploadFile) {
      throw new Error(preparedPhoto?.message || getSiteCopy("status.checkout.photoMissing"));
    }

    const orderData = new FormData(form);
    setFormDataPhoto(orderData, preparedPhoto);
    appendMarketingAttribution(orderData);

    setFormStatus(statusElement, getSiteCopy("status.checkout.uploading"), "neutral");

    const response = await fetch(ordersUrl, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: orderData,
    });
    const payload = await parseApiResponse(response);

    button.classList.add("is-complete");
    setSubmitState(button, getSiteCopy("status.checkout.ready.button"));

    if (payload.checkoutUrl) {
      trackAnalyticsEvent("checkout_redirected", checkoutAnalyticsParams);
      setFormStatus(statusElement, getSiteCopy("status.checkout.opening"), "success");
      window.location.assign(payload.checkoutUrl);
      return;
    }

    trackAnalyticsEvent("checkout_request_saved", checkoutAnalyticsParams);
    setFormStatus(statusElement, getSiteCopy("status.checkout.saved"), "success");

    window.setTimeout(() => {
      setSubmitState(button, originalText);
      button.classList.remove("is-complete");
    }, 3200);
  } catch (error) {
    trackAnalyticsEvent("checkout_error", {
      ...checkoutAnalyticsParams,
      error_type: error.name || "Error",
    });
    setSubmitState(button, getSiteCopy("status.tryAgain"));
    setFormStatus(statusElement, error.message, "error");

    window.setTimeout(() => {
      setSubmitState(button, originalText);
    }, 3200);
  }
});

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = contactForm.querySelector(".contact-submit");
  if (!button) return;

  const statusElement = contactForm.querySelector(".contact-status");
  const originalText = getButtonText(button);
  const contactUrl = buildApiUrl(apiEndpoints.contact);
  trackAnalyticsEvent("contact_form_submitted", {
    site_language: currentSiteLanguage,
  });

  if (!contactUrl) {
    trackAnalyticsEvent("contact_form_mocked", {
      site_language: currentSiteLanguage,
    });
    setSubmitState(button, getSiteCopy("status.contact.mock.button"));
    setFormStatus(
      statusElement,
      getSiteCopy("status.contact.mock.message"),
      "neutral"
    );
    button.classList.add("is-complete");

    window.setTimeout(() => {
      setSubmitState(button, originalText);
      button.classList.remove("is-complete");
      setFormStatus(statusElement, "");
    }, 2400);

    return;
  }

  button.classList.remove("is-complete");
  setSubmitState(button, getSiteCopy("status.contact.sending.button"), true);
  setFormStatus(statusElement, getSiteCopy("status.contact.sending.message"), "neutral");

  try {
    await parseApiResponse(
      await fetch(contactUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createContactPayload(contactForm)),
      })
    );

    setSubmitState(button, getSiteCopy("status.contact.sent.button"));
    setFormStatus(statusElement, getSiteCopy("status.contact.sent.message"), "success");
    trackAnalyticsEvent("contact_form_sent", {
      site_language: currentSiteLanguage,
    });
    button.classList.add("is-complete");

    window.setTimeout(() => {
      setSubmitState(button, originalText);
      button.classList.remove("is-complete");
      contactForm.reset();
      clearFormStatusSoon(statusElement);
    }, 2600);
  } catch (error) {
    trackAnalyticsEvent("contact_form_error", {
      error_type: error.name || "Error",
      site_language: currentSiteLanguage,
    });
    setSubmitState(button, getSiteCopy("status.tryAgain"));
    setFormStatus(statusElement, error.message, "error");

    window.setTimeout(() => {
      setSubmitState(button, originalText);
    }, 3200);
  }
});
