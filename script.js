const reveals = document.querySelectorAll(".reveal");
const header = document.querySelector(".site-header");
const form = document.querySelector(".intake-form");
const intakeSection = document.querySelector("#intake");
const contactForm = document.querySelector(".contact-form");
const contactSection = document.querySelector("#contact");
const pricingSection = document.querySelector("#pricing");
const mobileStickyCta = document.querySelector(".mobile-sticky-cta");
const packageOptions = document.querySelectorAll(".package-selector label");
const packageTargetButtons = document.querySelectorAll("[data-package-target]");
const exampleBooks = document.querySelectorAll(".example-book[data-book-slot]");
const heroVideo = document.querySelector("[data-hero-video]");
const orderPhotoInput = form?.querySelector('input[name="child-photo"]');
const uploadCard = orderPhotoInput?.closest(".upload-card");
const uploadTitle = uploadCard?.querySelector("[data-upload-title]");
const uploadDetail = uploadCard?.querySelector("[data-upload-detail]");
const uploadStatus = form?.querySelector("[data-upload-status]");
const mobileStickyCtaMedia = window.matchMedia("(max-width: 760px)");
const normalizeApiBaseUrl = (value) => String(value || "").trim().replace(/\/+$/, "");
const siteConfig = {
  apiBaseUrl: normalizeApiBaseUrl(
    window.MirrorTaleConfig?.apiBaseUrl ||
      document.querySelector('meta[name="mirrortale-api-base-url"]')?.content
  ),
};
const apiEndpoints = {
  orders: "/orders",
  contact: "/contact",
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
const defaultUploadTitle = uploadTitle?.textContent?.trim() || "Click to upload";
const defaultUploadDetail = uploadDetail?.textContent?.trim() || "Camera-roll photos accepted";
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
      message: "Please upload one child photo before checkout.",
    };
  }

  if (fileCount !== 1) {
    return {
      isValid: false,
      file: files[0] || null,
      message: "Please upload one child photo only.",
    };
  }

  const file = files[0];

  if (!Number.isFinite(file.size) || file.size <= 0) {
    return {
      isValid: false,
      file,
      message: "That photo did not attach correctly. Please choose it again, or open this page in your browser.",
    };
  }

  if (file.size > maxOriginalPhotoUploadBytes) {
    return {
      isValid: false,
      file,
      message: "Please choose a photo under 35 MB.",
    };
  }

  if (!isLikelyPhotoFile(file)) {
    return {
      isValid: false,
      file,
      message: "Please choose an image file from your camera roll.",
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
    message: "Photo selected. We will prepare a fresh upload copy when you proceed to checkout.",
  };
};

const preparePhotoUpload = async (validation) => {
  if (!validation?.isValid || !validation.file) return validation;

  const { file } = validation;

  setUploadStatus("Preparing a fresh photo copy for secure upload...", "neutral");

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
        message: "That photo is too large to upload. Please choose a smaller photo.",
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
      message: "Photo prepared successfully. It will upload as a fresh JPG for checkout.",
    };
  } catch {
    return {
      ...validation,
      isValid: false,
      uploadFile: null,
      message:
        "Instagram could not prepare this photo. Please open the page in your phone browser or choose another photo.",
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
  if (uploadTitle) uploadTitle.textContent = defaultUploadTitle;
  if (uploadDetail) uploadDetail.textContent = defaultUploadDetail;
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
    uploadTitle.textContent = validation.isValid ? "Photo ready" : "Photo not ready";
  }

  if (uploadDetail) {
    const fileSize = formatPhotoFileSize(validation.file?.size);
    uploadDetail.textContent = validation.isValid
      ? [validation.file?.name || "Selected photo", fileSize].filter(Boolean).join(" - ")
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
    uploadTitle.textContent = validation.isValid ? "Photo ready" : "Photo not ready";
  }

  if (uploadDetail) {
    const fileSize = formatPhotoFileSize(validation.file?.size);
    uploadDetail.textContent = validation.isValid
      ? [validation.file?.name || "Selected photo", fileSize].filter(Boolean).join(" - ")
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
  const shouldShow =
    mobileStickyCtaMedia.matches &&
    window.scrollY > 280 &&
    !pricingIsVisible &&
    !intakeIsVisible &&
    !contactIsVisible;

  mobileStickyCta.classList.toggle("is-visible", shouldShow);
  mobileStickyCta.classList.toggle(
    "is-near-intake",
    pricingIsVisible || intakeIsVisible || contactIsVisible
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
  option.addEventListener("change", updateSelectedPackage);
});

updateSelectedPackage();

orderPhotoInput?.addEventListener("change", () => {
  updatePhotoUploadState();
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

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const button = form.querySelector(".form-submit");
  if (!button) return;

  const statusElement = form.querySelector(".form-status");
  const originalText = getButtonText(button);
  const ordersUrl = buildApiUrl(apiEndpoints.orders);
  const photoValidation = updatePhotoUploadState({ showMissingError: true });

  if (!photoValidation.isValid) {
    setFormStatus(statusElement, photoValidation.message, "error");
    orderPhotoInput?.focus();
    return;
  }

  if (!ordersUrl) {
    setSubmitState(button, "Payment step mocked");
    setFormStatus(
      statusElement,
      "Backend URL not configured yet. The live payment flow will start here.",
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
  setSubmitState(button, "Preparing secure checkout...", true);
  setFormStatus(statusElement, "Preparing your photo securely...", "neutral");

  try {
    const preparedPhoto = await preparePhotoUpload(photoValidation);
    showPhotoUploadResult(preparedPhoto);

    if (!preparedPhoto?.isValid || !preparedPhoto.uploadFile) {
      throw new Error(preparedPhoto?.message || "Please upload one valid child photo.");
    }

    const orderData = new FormData(form);
    setFormDataPhoto(orderData, preparedPhoto);
    appendMarketingAttribution(orderData);

    setFormStatus(statusElement, "Uploading your order details securely...", "neutral");

    const response = await fetch(ordersUrl, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: orderData,
    });
    const payload = await parseApiResponse(response);

    button.classList.add("is-complete");
    setSubmitState(button, "Checkout ready");

    if (payload.checkoutUrl) {
      setFormStatus(statusElement, "Opening secure checkout...", "success");
      window.location.assign(payload.checkoutUrl);
      return;
    }

    setFormStatus(
      statusElement,
      "Your request is saved. We will email the next step shortly.",
      "success"
    );

    window.setTimeout(() => {
      setSubmitState(button, originalText);
      button.classList.remove("is-complete");
    }, 3200);
  } catch (error) {
    setSubmitState(button, "Try again");
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

  if (!contactUrl) {
    setSubmitState(button, "Message ready");
    setFormStatus(
      statusElement,
      "Backend URL not configured yet. This will send through Cloud Run.",
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
  setSubmitState(button, "Sending...", true);
  setFormStatus(statusElement, "Sending your message securely...", "neutral");

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

    setSubmitState(button, "Message sent");
    setFormStatus(statusElement, "Thanks. We will reply by email soon.", "success");
    button.classList.add("is-complete");

    window.setTimeout(() => {
      setSubmitState(button, originalText);
      button.classList.remove("is-complete");
      contactForm.reset();
      clearFormStatusSoon(statusElement);
    }, 2600);
  } catch (error) {
    setSubmitState(button, "Try again");
    setFormStatus(statusElement, error.message, "error");

    window.setTimeout(() => {
      setSubmitState(button, originalText);
    }, 3200);
  }
});
