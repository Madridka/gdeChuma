import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView,
      meta: { title: "ГдеЧУМА — смотрим новости без паники" },
    },
    {
      path: "/rules/",
      component: () => import("./views/RulesView.vue"),
      meta: { title: "Правила и условия — ГдеЧУМА" },
    },
    {
      path: "/project/",
      component: () => import("./views/ProjectView.vue"),
      meta: { title: "О проекте — ГдеЧУМА" },
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
router.afterEach((to) => {
  document.title = String(to.meta.title ?? "ГдеЧУМА");
  const canonical = document.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (canonical) canonical.href = new URL(to.path, "https://gdechuma.ru").href;
});
