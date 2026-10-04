<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import Icon from "./components/Icon.vue";
import CookieBanner from "./components/CookieBanner.vue";
import { openCookieSettings } from "./cookieConsent";
import { site } from "./data/content";
const route = useRoute();
const easterEggOpen = ref(false);
const musicDialog = ref<HTMLDialogElement>();
function openMusic() {
  if (!musicDialog.value || musicDialog.value.open) return;
  musicDialog.value.showModal();
  easterEggOpen.value = true;
}
function closeMusic() {
  musicDialog.value?.close();
}
function closeOnBackdrop(event: MouseEvent) {
  if (event.target === musicDialog.value) closeMusic();
}
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
    if (musicDialog.value?.open) closeMusic();
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
  <main id="main" class="page-container ym-disable-keys" tabindex="-1"><RouterView /></main>
  <footer class="site-footer">
    <div class="footer-inner">
      <RouterLink class="brand footer-brand" :to="{ path: '/', hash: '#map' }"
        ><span
          >Где<span class="brand-accent">ЧУМА</span
          ><span class="brand-dot">.</span></span
        ></RouterLink
      >
      <nav class="footer-links" aria-label="О сайте">
        <RouterLink to="/project/">О проекте</RouterLink>
        <RouterLink to="/rules/">Правила</RouterLink>
        <RouterLink to="/privacy/">Политика конфиденциальности</RouterLink>
        <button class="footer-cookie-settings" type="button" @click="openCookieSettings">
          Настроить cookie
        </button>
      </nav>
      <button
        class="easter-egg"
        type="button"
        :aria-expanded="easterEggOpen"
        aria-controls="vova-track"
        aria-haspopup="dialog"
        @click="openMusic"
      >
        <Icon name="music" /> Чума?
      </button>
      <p class="footer-caption">© 2026 · Сделано с юмором. Читать с головой.</p>
    </div>
  </footer>
  <CookieBanner />
  <dialog
    id="vova-track"
    ref="musicDialog"
    class="music-dialog"
    aria-labelledby="music-title"
    @close="easterEggOpen = false"
    @click="closeOnBackdrop"
  >
    <button
      class="music-close"
      type="button"
      aria-label="Закрыть музыкальную пасхалку"
      @click="closeMusic"
    >
      ×
    </button>
    <p class="eyebrow">МУЗЫКАЛЬНАЯ ПАСХАЛочка</p>
    <h2 id="music-title">Та самая «Чума».</h2>
    <a
      class="button"
      :href="site.songUrl"
      target="_blank"
      rel="noopener noreferrer"
      >Иракли — «Вова-чума» · Яндекс Музыка <Icon name="external"
    /></a>
    <small
      >Запись откроется по ссылке. Автоматического воспроизведения нет.</small
    >
  </dialog>
</template>
