<script setup lang="ts">
import { RouterLink } from "vue-router";
import { privacy } from "../data/privacy";
import { formatDate } from "../data/content";
import { openCookieSettings } from "../cookieConsent";
</script>

<template>
  <article class="document-page" aria-labelledby="privacy-title">
    <RouterLink class="document-back" to="/">← На главную</RouterLink>
    <p class="eyebrow">ПЕРСОНАЛЬНЫЕ ДАННЫЕ И COOKIE</p>
    <h1 id="privacy-title">Политика<br /><span>конфиденциальности</span></h1>
    <p class="document-lead">
      Какие данные обрабатываются на сайте, зачем нужна аналитика и как
      управлять своим выбором.
    </p>
    <p class="document-date">
      Редакция от <time :datetime="privacy.updatedAt">{{ formatDate(privacy.updatedAt) }}</time>
    </p>
    <ol class="document-rules">
      <li v-for="section in privacy.sections" :key="section.title">
        <h2>{{ section.title }}</h2>
        <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </li>
    </ol>
    <div class="document-actions privacy-actions">
      <button class="button button-outline" type="button" @click="openCookieSettings">Настроить cookie</button>
      <RouterLink class="document-inline-link" to="/consent/">Текст согласия на обработку данных</RouterLink>
    </div>
    <p class="document-external">
      <a href="https://yandex.ru/legal/metrica_termsofuse/ru/" target="_blank" rel="noopener noreferrer">Условия и обработка данных Метрики</a> ·
      <a href="https://yandex.ru/legal/confidential/" target="_blank" rel="noopener noreferrer">Конфиденциальность Яндекса</a> ·
      <a href="https://yandex.ru/support/metrica/ru/general/cookie-usage" target="_blank" rel="noopener noreferrer">Cookie Метрики</a> ·
      <a href="https://yandex.ru/support/metrica/ru/general/opt-out" target="_blank" rel="noopener noreferrer">Блокировщик Яндекс Метрики</a> ·
      <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement" target="_blank" rel="noopener noreferrer">Конфиденциальность GitHub</a>
    </p>
    <section class="document-operator" aria-labelledby="operator-title" data-nosnippet>
      <h2 id="operator-title">Оператор и контакт для обращений</h2>
      <p>Владелец сайта и оператор персональных данных: {{ privacy.operator }}.</p>
      <p>Вопросы об обработке данных и обращения:
        <a :href="`mailto:${privacy.email}`">{{ privacy.email }}</a>.
      </p>
    </section>
  </article>
</template>
