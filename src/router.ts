import { nextTick } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { trackPageView } from "./analytics";
import { applyPageSeo, getPageSeo } from "./seo";
import HomeView from "./views/HomeView.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView,
      meta: getPageSeo("/"),
    },
    {
      path: "/rules/",
      component: () => import("./views/RulesView.vue"),
      meta: getPageSeo("/rules/"),
    },
    {
      path: "/project/",
      component: () => import("./views/ProjectView.vue"),
      meta: getPageSeo("/project/"),
    },
    {
      path: "/privacy/",
      component: () => import("./views/PrivacyView.vue"),
      meta: getPageSeo("/privacy/"),
    },
    {
      path: "/consent/",
      component: () => import("./views/ConsentView.vue"),
      meta: getPageSeo("/consent/"),
    },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return { ...savedPosition, behavior: "instant" };
    const sectionAnchor =
      to.path === "/" && ["#map", "#news", "#about"].includes(to.hash);
    const ruleAnchor =
      to.path.startsWith("/rules") && /^#rule-\d{1,3}$/.test(to.hash);
    if (sectionAnchor || ruleAnchor || to.hash === "#main") {
      return {
        el: to.hash,
        behavior:
          to.path !== from.path ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        top:
          (document.querySelector(".site-header")?.getBoundingClientRect()
            .height ?? 90) + 20,
      };
    }
    return { top: 0, behavior: "instant" };
  },
});
router.beforeEach((to) =>
  to.path === "/" && to.hash === "#rules"
    ? { path: "/rules/", replace: true }
    : true,
);
router.afterEach(async (to, _from, failure) => {
  if (failure) return;
  applyPageSeo(to.path);
  await nextTick();
  trackPageView(to.fullPath);
});
