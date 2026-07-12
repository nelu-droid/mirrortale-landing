(() => {
  const measurementId = document.querySelector('meta[name="ga4-measurement-id"]')?.content?.trim();
  const pageEventName = document.querySelector('meta[name="analytics-page-event"]')?.content?.trim();
  const consentStorageKey = "mirrortale-analytics-consent-v1";
  const gtagScriptId = "mirrortale-ga4-script";
  const maxParamLength = 160;
  let analyticsLoaded = false;
  let initialEventsSent = false;

  const readConsent = () => {
    try {
      return window.localStorage?.getItem(consentStorageKey) || "";
    } catch {
      return "";
    }
  };

  const writeConsent = (value) => {
    try {
      window.localStorage?.setItem(consentStorageKey, value);
    } catch {
      // Analytics consent must never block the page.
    }
  };

  const hasConsent = () => readConsent() === "granted";

  const cleanParamValue = (value) => {
    if (value === null || value === undefined) return undefined;
    if (typeof value === "number" || typeof value === "boolean") return value;
    return String(value).trim().slice(0, maxParamLength);
  };

  const cleanParams = (params = {}) =>
    Object.fromEntries(
      Object.entries(params)
        .map(([key, value]) => [key, cleanParamValue(value)])
        .filter(([, value]) => value !== undefined && value !== "")
    );

  const loadAnalytics = () => {
    if (!measurementId || analyticsLoaded) return false;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };

    if (!document.getElementById(gtagScriptId)) {
      const script = document.createElement("script");
      script.id = gtagScriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.append(script);
    }

    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
      send_page_view: true,
    });

    analyticsLoaded = true;
    return true;
  };

  const track = (eventName, params = {}) => {
    if (!measurementId || !eventName || !hasConsent()) return false;
    loadAnalytics();
    window.gtag?.("event", eventName, cleanParams(params));
    return true;
  };

  const sendInitialEvents = () => {
    if (initialEventsSent || !hasConsent()) return;
    initialEventsSent = true;
    loadAnalytics();

    if (pageEventName) {
      track(pageEventName, {
        page_path: window.location.pathname,
        page_title: document.title,
      });
    }
  };

  const dismissConsentBanner = () => {
    document.querySelector("[data-analytics-consent-banner]")?.remove();
  };

  const grantConsent = () => {
    writeConsent("granted");
    dismissConsentBanner();
    sendInitialEvents();
    track("analytics_consent_granted");
  };

  const denyConsent = () => {
    writeConsent("denied");
    dismissConsentBanner();
  };

  const getClickLocation = (element) => {
    const section = element.closest("section[id], header, footer, main");
    if (!section) return "page";
    if (section.id) return section.id;
    if (section.classList.contains("site-header")) return "header";
    if (section.classList.contains("site-footer")) return "footer";
    return section.tagName.toLowerCase();
  };

  const trackLinkClick = (event) => {
    const link = event.target.closest?.("a[href]");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const text = link.textContent.trim().replace(/\s+/g, " ");
    const params = {
      link_text: text,
      link_url: href,
      location: getClickLocation(link),
    };

    if (href === "#intake" || href.endsWith("/#intake")) {
      track("cta_click", params);
    } else if (href.startsWith("mailto:")) {
      track("contact_link_click", params);
    } else if (href.includes("privacy.html") || href.includes("terms.html")) {
      track("legal_link_click", params);
    }
  };

  const createConsentBanner = () => {
    if (!measurementId || readConsent()) return;

    const banner = document.createElement("div");
    banner.className = "analytics-consent";
    banner.dataset.analyticsConsentBanner = "true";
    banner.setAttribute("role", "region");
    banner.setAttribute("aria-label", "Analytics preferences");
    banner.innerHTML = `
      <p>We use optional analytics to understand visits and improve MirrorTale. No child photos or form details are sent.</p>
      <div class="analytics-consent-actions">
        <button class="analytics-consent-secondary" type="button" data-analytics-consent="denied">Essential only</button>
        <button class="analytics-consent-primary" type="button" data-analytics-consent="granted">Allow analytics</button>
      </div>
    `;

    banner.addEventListener("click", (event) => {
      const button = event.target.closest("[data-analytics-consent]");
      if (!button) return;

      if (button.dataset.analyticsConsent === "granted") {
        grantConsent();
      } else {
        denyConsent();
      }
    });

    document.body.append(banner);
  };

  window.mirrortaleAnalytics = {
    consent: (value) => (value === "granted" ? grantConsent() : denyConsent()),
    hasConsent,
    track,
  };

  document.addEventListener("click", trackLinkClick);

  const initialize = () => {
    if (hasConsent()) sendInitialEvents();
    createConsentBanner();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
