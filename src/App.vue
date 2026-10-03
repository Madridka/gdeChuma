<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import Icon from "./components/Icon.vue";
import { site } from "./data/content";
const route = useRoute();
const easterEggOpen = ref(false);
const activeSection = ref("map");
const navigation = [
  { id: "map", label: "Карта" },
  { id: "news", label: "Новости" },
  { id: "about", label: "Про чуму" },
];
let frame = 0;
function updateSection() {
  if (route.path !== "/") return;
  const offset =
    (document.querySelector(".site-header")?.getBoundingClientRect().height ??
      90) + 70;
  let current = "map";
  for (const item of navigation) {
    const element = document.getElementById(item.id);
    if (element && element.getBoundingClientRect().top <= offset)
      current = item.id;
  }
  activeSection.value = current;
}
function onScroll() {
  cancelAnimationFrame(frame);
  frame = requestAnimationFrame(updateSection);
}
watch(
  () => route.fullPath,
  async () => {
    easterEggOpen.value = false;
    activeSection.value = navigation.some(
      (item) => `#${item.id}` === route.hash,
    )
      ? route.hash.slice(1)
      : "map";
    await nextTick();
    onScroll();
  },
);
onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
  cancelAnimationFrame(frame);
});
</script>
<template>
  <a class="skip-link" href="#main">К содержимому</a>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink
        class="brand"
        :to="{ path: '/', hash: '#map' }"
        aria-label="ГдеЧУМА — к карте"
        ><span class="brand-icon"><Icon name="pin" /></span
        ><span
          >Где<span class="brand-accent">ЧУМА</span
          ><span class="brand-dot">.</span></span
        ></RouterLink
      >
      <nav class="main-nav" aria-label="Главная навигация">
        <RouterLink
          v-for="item in navigation"
          :key="item.id"
          :to="{ path: '/', hash: `#${item.id}` }"
          :class="{
            'nav-active': route.path === '/' && activeSection === item.id,
          }"
          :aria-current="
            route.path === '/' && activeSection === item.id
              ? 'location'
              : undefined
          "
          >{{ item.label }}</RouterLink
        >
      </nav>
      <span class="header-note">Неофициально. Без паники.</span>
    </div>
  </header>
  <main id="main" class="page-container" tabindex="-1"><RouterView /></main>
  <footer class="site-footer">
    <div class="footer-inner">
      <RouterLink class="brand footer-brand" :to="{ path: '/', hash: '#map' }"
        ><span
          >Где<span class="brand-accent">ЧУМА</span
          ><span class="brand-dot">.</span></span
        ></RouterLink
      >
      <nav class="footer-links" aria-label="О сайте">
        <RouterLink to="/project/">О проекте</RouterLink
        ><RouterLink to="/rules/">Правила</RouterLink
        ><a :href="site.issuesUrl" target="_blank" rel="noopener noreferrer"
          >Сообщить о неточности</a
        >
      </nav>
      <button
        class="easter-egg"
        type="button"
        :aria-expanded="easterEggOpen"
        aria-controls="vova-track"
        @click="easterEggOpen = !easterEggOpen"
      >
        <Icon name="music" /> Чума?
      </button>
      <p class="footer-caption">© 2026 · Сделано с юмором. Читать с головой.</p>
    </div>
    <div v-if="easterEggOpen" id="vova-track" class="easter-egg-content">
      <span>Та самая чума, которую можно послушать.</span
      ><a :href="site.songUrl" target="_blank" rel="noopener noreferrer"
        >Иракли — «Вова-чума» <Icon name="external"
      /></a>
    </div>
  </footer>
</template>
