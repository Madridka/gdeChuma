<script setup lang="ts">
import { computed, ref } from "vue";
import Icon from "./components/Icon.vue";
import MapPanel from "./components/MapPanel.vue";
import CityCheck from "./components/CityCheck.vue";
import { rules } from "./data/rules";
import {
  facts,
  formatDate,
  history,
  news,
  placeWord,
  points,
  site,
} from "./data/content";

const easterEggOpen = ref(false);
const sortedNews = computed(() =>
  [...news].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
);
</script>

<template>
  <a class="skip-link" href="#main">К содержимому</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="#map" aria-label="ГдеЧУМА — к карте"
        ><span class="brand-icon"><Icon name="pin" /></span
        ><span
          >Где<span class="brand-accent">ЧУМА</span
          ><span class="brand-dot">.</span></span
        ></a
      >
      <nav class="main-nav" aria-label="Главная навигация">
        <a class="nav-map" href="#map">Карта</a><a href="#news">Новости</a
        ><a href="#about">Про чуму</a><a href="#rules">Правила</a>
      </nav>
      <span class="header-note">Неофициально. Без паники.</span>
    </div>
  </header>

  <main id="main" class="page-container">
    <section id="map" class="map-section" aria-labelledby="map-heading">
      <div class="intro">
        <div>
          <p class="eyebrow intro-eyebrow">
            <span class="tiny-pin"></span> НОВОСТИ НА КАРТЕ · НЕМНОГО С ЮМОРОМ
          </p>
          <h1 id="map-heading">Где чума? <span>Без паники.</span></h1>
          <p class="intro-description">
            Смотрим, о чём пишут. Разбираемся, что известно.
          </p>
        </div>
        <div class="intro-stamp">
          <span class="stamp-number">{{
            points.length.toString().padStart(2, "0")
          }}</span
          ><span
            >{{ placeWord(points.length) }} на карте.<br />Ноль прогнозов.</span
          >
        </div>
      </div>
      <MapPanel :points="points" />
    </section>

    <CityCheck />

    <section id="news" class="content-section" aria-labelledby="news-heading">
      <div class="section-heading">
        <div>
          <p class="eyebrow">01 / ИНФОПОВОД И КОНТЕКСТ</p>
          <h2 id="news-heading">Что пишут про чуму</h2>
        </div>
        <p class="section-meta">
          Подборка обновлена<br /><time :datetime="site.updatedAt">{{
            formatDate(site.updatedAt)
          }}</time>
        </p>
      </div>
      <div class="news-grid">
        <article
          v-for="(item, index) in sortedNews"
          :key="item.id"
          class="news-card"
          :class="{ 'news-featured': index === 0 }"
        >
          <div class="news-topline">
            <span class="news-category">{{ item.category }}</span
            ><time :datetime="item.publishedAt">{{
              formatDate(item.publishedAt)
            }}</time>
          </div>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <a
            class="news-source"
            :href="item.url"
            target="_blank"
            rel="noopener noreferrer"
            ><span>{{ item.source }}<small>Читать источник</small></span
            ><Icon name="external"
          /></a>
        </article>
      </div>
      <p class="section-footnote">
        Подборку обновляет автор вручную. Дата публикации — дата материала
        источника.
      </p>
    </section>

    <section
      id="about"
      class="content-section about-section"
      aria-labelledby="about-heading"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">02 / МИНУТКА ФАКТОВ</p>
          <h2 id="about-heading">Чума — это не только мем</h2>
        </div>
        <span class="section-tag"><Icon name="book" /> По материалам ВОЗ</span>
      </div>
      <div class="facts-grid">
        <article v-for="fact in facts" :key="fact.number" class="fact-card">
          <span class="fact-number">{{ fact.number }}</span>
          <h3>{{ fact.title }}</h3>
          <p>{{ fact.description }}</p>
        </article>
      </div>
      <div class="history-block">
        <div class="history-intro">
          <p class="eyebrow">КОРОТКАЯ ИСТОРИЯ</p>
          <h3>Знакома человечеству<br />уже тысячи лет</h3>
          <p>
            Единственное точное место и время первого появления болезни здесь не
            утверждаются.
          </p>
        </div>
        <ol class="history-timeline">
          <li v-for="event in history" :key="event.period">
            <span class="history-period">{{ event.period }}</span>
            <h4>{{ event.title }}</h4>
            <p>{{ event.description }}</p>
          </li>
        </ol>
      </div>
      <div class="about-sources">
        <span>Проверить факты:</span
        ><a
          href="https://www.who.int/ru/news-room/fact-sheets/detail/plague"
          target="_blank"
          rel="noopener noreferrer"
          >Справка ВОЗ <Icon name="external" /></a
        ><a
          href="https://www.who.int/publications/m/item/epi-win-digest-54-plague-in-the-21st-century-new-evidence-to-control-a-re-emerging-zoonotic-disease"
          target="_blank"
          rel="noopener noreferrer"
          >Исторический обзор ВОЗ <Icon name="external"
        /></a>
      </div>
    </section>

    <section
      id="rules"
      class="content-section rules-section"
      aria-labelledby="rules-heading"
    >
      <div class="rules-heading">
        <span class="rules-icon"><Icon name="info" /></span>
        <p class="eyebrow">03 / МЕЛКИЙ ШРИФТ? НЕТ, НОРМАЛЬНЫЙ.</p>
        <h2 id="rules-heading">Шутки шутками.<br />Источники — источниками.</h2>
        <a
          class="button button-outline"
          :href="site.issuesUrl"
          target="_blank"
          rel="noopener noreferrer"
          >Сообщить о неточности <Icon name="external"
        /></a>
      </div>
      <div class="rules-copy">
        <h3>Правила и о проекте</h3>
        <p>
          ГдеЧУМА — информационно-развлекательный проект с элементами юмора.
          Используем открытые публикации, указываем источники и даты. Версии из
          материалов сохраняют статус версий: сайт не подтверждает диагнозы и не
          приписывает кому-либо вину.
        </p>
        <p>
          Карта показывает адреса из публикаций. Поиск выдаёт заранее заданную
          шутку. Они не описывают реальную опасность и не подтверждают наличие
          или отсутствие заболевания. Для медицинских решений нужны специалисты
          и актуальные официальные сообщения.
        </p>
        <p>
          Администрация не гарантирует полноту, точность, актуальность сторонних
          сведений и бесперебойную работу сервиса. В пределах, допускаемых
          законодательством, она не несёт ответственности за сторонний контент,
          технические сбои и последствия самостоятельного использования
          материалов.
        </p>
        <details class="rules-details">
          <summary>Полные правила и ограничения ответственности</summary>
          <ol class="rules-list">
            <li v-for="rule in rules" :key="rule.title">
              <h4>{{ rule.title }}</h4>
              <p>{{ rule.text }}</p>
            </li>
          </ol>
        </details>
        <p class="privacy-note">
          Ввод города обрабатывается только в вашем браузере и не сохраняется
          приложением. Карта Яндекса и внешние сайты работают по своим правилам
          и могут использовать cookies.
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
          >.
        </p>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <a class="brand footer-brand" href="#map"
        ><span
          >Где<span class="brand-accent">ЧУМА</span
          ><span class="brand-dot">.</span></span
        ></a
      >
      <p>© 2026 · Сделано с юмором. Читать с головой.</p>
      <button
        class="easter-egg"
        type="button"
        :aria-expanded="easterEggOpen"
        aria-controls="vova-track"
        @click="easterEggOpen = !easterEggOpen"
      >
        <Icon name="music" /> Чума?
      </button>
    </div>
    <div v-if="easterEggOpen" id="vova-track" class="easter-egg-content">
      <span>Та самая чума, которую можно послушать.</span
      ><a :href="site.songUrl" target="_blank" rel="noopener noreferrer"
        >Иракли — «Вова-чума» <Icon name="external"
      /></a>
    </div>
  </footer>
</template>
