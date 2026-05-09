const reveals = document.querySelectorAll(".reveal");
const header = document.querySelector(".site-header");
const form = document.querySelector(".intake-form");
const intakeSection = document.querySelector("#intake");
const contactForm = document.querySelector(".contact-form");
const contactSection = document.querySelector("#contact");
const mobileStickyCta = document.querySelector(".mobile-sticky-cta");
const packageOptions = document.querySelectorAll(".package-selector label");
const exampleBooks = document.querySelectorAll(".example-book[data-book-slot]");
const mobileStickyCtaMedia = window.matchMedia("(max-width: 760px)");
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
let isSyncingPageFlip = false;
let lastPageTapAt = 0;
let activeMobilePageIndex = 0;
let mobileTouchStart = null;
let mobileMouseStart = null;
let mobileSwipeHandledAt = 0;
let mobileReaderAnimationTimer = null;
let mobileImageLoadToken = 0;
const mobilePreloadCache = new Set();

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
  const shouldShow =
    mobileStickyCtaMedia.matches && window.scrollY > 280 && !intakeIsVisible && !contactIsVisible;

  mobileStickyCta.classList.toggle("is-visible", shouldShow);
  mobileStickyCta.classList.toggle("is-near-intake", intakeIsVisible || contactIsVisible);
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
    option.classList.toggle("is-selected", Boolean(input?.checked));
  });
};

packageOptions.forEach((option) => {
  option.addEventListener("change", updateSelectedPackage);
});

updateSelectedPackage();

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
    if (badge) badge.textContent = isActive ? "Previewing" : "Tap to preview";
  });

  if (flipbook.previewBookTitle) {
    flipbook.previewBookTitle.textContent = activeBook.title;
  } else if (flipbook.previewTitle) {
    flipbook.previewTitle.textContent = `Now previewing ${activeBook.title}`;
  }

  if (flipbook.previewHelper) {
    flipbook.previewHelper.textContent =
      activeMobilePageIndex <= 0
        ? "Tap the cover to open, then swipe or tap to turn."
        : "Tap the page or swipe to turn.";
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
  if (activeMobilePageIndex <= 0) return "Cover";
  if (activeMobilePageIndex >= activeBook.pages.length - 1) return "Back cover";
  return `Page ${activeMobilePageIndex} of ${activeBook.pages.length - 2}`;
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
    preloadNearbyMobilePages();
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

  if (syncPageFlip) syncPageFlipToView(nextIndex, direction, previousIndex);
};

document.querySelectorAll("[data-preview-target]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const target = document.getElementById(trigger.dataset.previewTarget);
    if (!target) return;

    event.preventDefault();
    const selectedBookKey = trigger.dataset.bookKey || "noah";
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("book", selectedBookKey);
    nextUrl.hash = target.id;

    selectBook(selectedBookKey);
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

  if (isNewBook || !pageFlip) {
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
  pageFlip.on("flip", (event) => syncViewFromPageFlip(Number(event.data) || 0));
  pageFlip.on("init", (event) => syncViewFromPageFlip(Number(event.data?.page) || 0));
};

if (flipbook.viewer) {
  updateFlipbook();
  renderMobileReader();
  initPageFlip();
  flipbook.pageFlipShell?.addEventListener("click", handleBookTap, true);
  flipbook.mobileReader?.addEventListener("click", handleMobileReaderClick);
  flipbook.mobileReader?.addEventListener("keydown", handleMobileReaderKeydown);
  flipbook.mobileReader?.addEventListener("touchstart", handleMobileTouchStart, { passive: true });
  flipbook.mobileReader?.addEventListener("touchend", handleMobileTouchEnd, { passive: false });
  flipbook.mobileReader?.addEventListener("mousedown", handleMobileMouseDown);
  flipbook.mobileReader?.addEventListener("mouseup", handleMobileMouseUp);

  const initialBookKey = new URLSearchParams(window.location.search).get("book");
  if (initialBookKey) selectBook(initialBookKey);
}

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = form.querySelector(".form-submit");
  if (!button) return;

  const originalText = button.textContent;
  button.textContent = "Payment step mocked";
  button.classList.add("is-complete");

  window.setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("is-complete");
  }, 2400);
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const button = contactForm.querySelector(".contact-submit");
  if (!button) return;

  const originalText = button.textContent;
  button.textContent = "Message ready";
  button.classList.add("is-complete");

  window.setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove("is-complete");
  }, 2200);
});
