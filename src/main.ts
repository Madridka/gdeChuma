import { createApp, nextTick, watch } from "vue";
import App from "./App.vue";
import { router } from "./router";
import { initializeAnalytics, stopAnalytics, trackPageView } from "./analytics";
import { cookieChoice, startConsentSync } from "./cookieConsent";
import { stopAdvertising } from "./advertising";
import "./style.css";

watch(cookieChoice, async (choice) => {
  if (choice !== "accepted") {
    stopAnalytics();
    stopAdvertising();
    return;
  }
  initializeAnalytics();
  await router.isReady();
  await nextTick();
  trackPageView(router.currentRoute.value.fullPath);
}, { flush: "sync" });
startConsentSync();
if (cookieChoice.value !== "accepted") stopAnalytics();
initializeAnalytics();
createApp(App).use(router).mount("#app");
