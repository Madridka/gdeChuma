<script setup lang="ts">
import { RouterLink } from "vue-router";
import { privacy } from "../data/privacy";
import { formatDate } from "../data/content";
import { openCookieSettings } from "../cookieConsent";
</script>

<template>
  <article class="document-page" aria-labelledby="consent-title">
    <RouterLink class="document-back" to="/">← На главную</RouterLink>
    <p class="eyebrow">ДОБРОВОЛЬНЫЙ ВЫБОР</p>
    <h1 id="consent-title">Согласие<br /><span>на обработку данных.</span></h1>
    <p class="document-date">
      Редакция от <time :datetime="privacy.updatedAt">{{ formatDate(privacy.updatedAt) }}</time>
    </p>
    <div class="consent-text">
      <p v-for="paragraph in privacy.consent" :key="paragraph">{{ paragraph }}</p>
    </div>
    <div class="document-actions privacy-actions">
      <button class="button button-outline" type="button" @click="openCookieSettings">Настроить cookie</button>
      <RouterLink class="document-inline-link" to="/privacy/">Политика конфиденциальности</RouterLink>
    </div>
    <section class="document-operator" aria-labelledby="consent-operator-title" data-nosnippet>
      <h2 id="consent-operator-title">Оператор сайта</h2>
      <p>{{ privacy.operator }}. Контакт для обращений:
        <a :href="`mailto:${privacy.email}`">{{ privacy.email }}</a>.
      </p>
    </section>
  </article>
</template>
