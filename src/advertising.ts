import { hasAnalyticsConsent } from "./cookieConsent";
import { advertisingEnabled } from "./config";

const loaderUrl = "https://yandex.ru/ads/system/context.js";
export const advertisingBlockId = "R-A-20171821-1";
export const advertisingContainerId = `yandex_rtb_${advertisingBlockId}`;

declare global {
  interface Window {
    yaContextCb?: Array<() => void>;
    Ya?: {
      Context: {
        AdvManager: {
          render(options: { blockId: string; renderTo: string }, onNoAd?: () => void): void;
        };
      };
    };
  }
}

let loaderStarted = false;
let loaderReady: Promise<void> | undefined;

export function loadAdvertising() {
  if (
    !advertisingEnabled || !hasAnalyticsConsent() || !import.meta.env.PROD ||
    !["gdechuma.ru", "www.gdechuma.ru"].includes(window.location.hostname)
  ) return Promise.reject(new Error("Advertising is unavailable"));

  if (!loaderReady) {
    window.yaContextCb = window.yaContextCb || [];
    loaderReady = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.async = true;
      script.src = loaderUrl;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Advertising loader failed"));
      loaderStarted = true;
      // The Yandex loader is inserted into <head> once per document.
      document.head.append(script);
    });
  }
  return loaderReady;
}

export function stopAdvertising() {
  // Removing a script/slot does not stop an already running advertising SDK.
  // A reload after saving the refusal ends its timers, frames and callbacks.
  if (loaderStarted) window.location.reload();
}
