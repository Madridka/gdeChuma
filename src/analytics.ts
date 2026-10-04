import { hasAnalyticsConsent } from "./cookieConsent";

const counterId = 113383793;
const tagUrl = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;

interface Metrika {
  (...args: unknown[]): void;
  a?: IArguments[];
  l?: number;
}

declare global {
  interface Window {
    ym?: Metrika;
    disableYaCounter113383793?: boolean;
  }
}

let initialized = false;
let previousUrl: string | undefined;

export function initializeAnalytics() {
  if (
    initialized ||
    !hasAnalyticsConsent() ||
    !import.meta.env.PROD ||
    !["gdechuma.ru", "www.gdechuma.ru"].includes(window.location.hostname)
  ) {
    return;
  }

  window.disableYaCounter113383793 = false;

  const metrika: Metrika =
    window.ym ??
    function () {
      (metrika.a ??= []).push(arguments);
    };
  window.ym = metrika;
  metrika.l ??= Date.now();

  if (!Array.from(document.scripts).some((script) => script.src === tagUrl)) {
    const script = document.createElement("script");
    script.async = true;
    script.src = tagUrl;
    document.head.append(script);
  }

  // The router sends the first view and subsequent views after rendering.
  // Disable the automatic view to avoid counting the first visit twice.
  metrika(counterId, "init", {
    ssr: true,
    defer: true,
    webvisor: true,
    clickmap: true,
    ecommerce: "dataLayer",
    referrer: document.referrer,
    url: window.location.href,
    accurateTrackBounce: true,
    trackLinks: true,
    disableYtm: true,
  });
  initialized = true;
}

export function trackPageView(path: string) {
  if (!initialized || !window.ym || !hasAnalyticsConsent()) return;

  const url = new URL(path, window.location.origin);
  // Section anchors are scrolling within a page, not additional page views.
  url.hash = "";
  if (url.href === previousUrl) return;

  window.ym(counterId, "hit", url.href, {
    title: document.title,
    referer: previousUrl ?? document.referrer,
  });
  previousUrl = url.href;
}

export function stopAnalytics() {
  window.disableYaCounter113383793 = true;
  if (initialized) {
    // Discard pending views if consent is withdrawn before the tag loads.
    window.ym?.a?.splice(0);
    window.ym?.(counterId, "destruct");
  }
  initialized = false;
  previousUrl = undefined;

  // Third-party Yandex cookies cannot be deleted by this site's JavaScript.
  const domains = ["", window.location.hostname, "gdechuma.ru"];
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0]?.trim();
    if (!name?.startsWith("_ym")) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""} SameSite=Lax`;
    }
  }
  try {
    for (const storage of [localStorage, sessionStorage]) {
      for (const key of Object.keys(storage)) {
        if (key.startsWith("_ym")) storage.removeItem(key);
      }
    }
  } catch { /* Storage can be blocked by the visitor's browser. */ }
}
