<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import {
  closeCookieSettings,
  cookieChoice,
  cookieSettingsOpen,
  setCookieConsent,
} from "../cookieConsent";

const banner = ref<HTMLElement>();
const mounted = ref(false);
onMounted(() => { mounted.value = true; });
watch(cookieSettingsOpen, (open) => {
  if (open) banner.value?.focus();
}, { flush: "post" });
</script>

<template>
  <div v-if="mounted && cookieSettingsOpen" class="cookie-banner-space" aria-hidden="true"></div>
  <aside
    v-if="mounted && cookieSettingsOpen"
    ref="banner"
    class="cookie-banner"
    role="region"
    aria-labelledby="cookie-title"
    tabindex="-1"
    data-testid="cookie-banner"
    data-nosnippet
  >
    <div class="cookie-copy">
      <h2 id="cookie-title">Ваш выбор: cookie, аналитика и реклама</h2>
      <p>
        С вашего согласия мы используем cookie, Яндекс Метрику и Вебвизор для
        анализа посещений и улучшения сайта. При согласии также может подключаться
        реклама Рекламной сети Яндекса и загружается встроенная Яндекс Карта.
        Рекламный сервис может использовать cookie и сведения об устройстве
        для подбора объявлений и учёта показов. Без согласия Метрика и реклама не запускаются;
        читать сайт можно в любом случае.
      </p>
      <p>
        Нажимая «Принять», вы даёте
        <RouterLink to="/consent/">согласие на обработку данных</RouterLink>
        на описанных условиях. Подробности — в
        <RouterLink to="/privacy/">Политике конфиденциальности</RouterLink>.
        Выбор можно изменить внизу любой страницы.
      </p>
      <p v-if="cookieChoice !== null" class="cookie-current" role="status">
        Сейчас {{ cookieChoice === "accepted" ? "аналитика и реклама разрешены" : "аналитика и реклама отключены" }}.
      </p>
    </div>
    <div class="cookie-actions">
      <button class="button" type="button" @click="setCookieConsent('accepted')">
        Принять
      </button>
      <button class="button button-outline" type="button" @click="setCookieConsent('rejected')">
        Отклонить
      </button>
      <button v-if="cookieChoice !== null" class="cookie-close" type="button" @click="closeCookieSettings">
        Закрыть без изменений
      </button>
    </div>
  </aside>
</template>
