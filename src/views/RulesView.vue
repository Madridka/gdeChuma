<script setup lang="ts">
import { RouterLink } from "vue-router";
import { rules } from "../data/rules";
import { formatDate, site } from "../data/content";
</script>
<template>
  <article class="document-page" aria-labelledby="rules-title">
    <a class="document-back" href="/">← На главную</a>
    <p class="eyebrow">ПРАВИЛА И УСЛОВИЯ ИСПОЛЬЗОВАНИЯ</p>
    <h1 id="rules-title">Шутки шутками.<br /><span>Контекст важен.</span></h1>
    <p class="document-lead">
      Открытые публикации, научная справка и художественные элементы имеют
      разное назначение. Здесь описаны условия их использования и ограничения
      сервиса.
    </p>
    <p class="document-date">
      Редакция от
      <time :datetime="site.updatedAt">{{ formatDate(site.updatedAt) }}</time>
    </p>
    <nav class="document-contents" aria-label="Разделы правил">
      <a
        v-for="(rule, index) in rules"
        :key="rule.title"
        :href="`#rule-${index + 1}`"
        >{{ String(index + 1).padStart(2, "0") }} / {{ rule.title }}</a
      >
    </nav>
    <ol class="document-rules">
      <li
        v-for="(rule, index) in rules"
        :id="`rule-${index + 1}`"
        :key="rule.title"
      >
        <h2>{{ rule.title }}</h2>
        <p>{{ rule.text }}</p>
      </li>
    </ol>
    <p class="document-external">
      <RouterLink to="/privacy/">Политика конфиденциальности</RouterLink>
      ·
      <RouterLink to="/consent/">Согласие на обработку данных</RouterLink>
      ·
      <a
        href="https://yandex.ru/legal/metrica_termsofuse/"
        target="_blank"
        rel="noopener noreferrer"
        >Условия Яндекс Метрики</a
      >
      ·
      <a
        href="https://yandex.ru/legal/confidential/"
        target="_blank"
        rel="noopener noreferrer"
        >Конфиденциальность Яндекса</a
      >
      ·
      <a
        href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
        target="_blank"
        rel="noopener noreferrer"
        >Конфиденциальность GitHub</a
      >
    </p>
  </article>
</template>
