<script setup lang="ts">
import Icon from "../components/Icon.vue";
import MapPanel from "../components/MapPanel.vue";
import CityCheck from "../components/CityCheck.vue";
import NewsFeed from "../components/NewsFeed.vue";
import YandexAd from "../components/YandexAd.vue";
import { advertisingEnabled } from "../config";
import { facts, questions, history, placeWord, points } from "../data/content";
</script>
<template>
  <section id="map" class="map-section" aria-labelledby="map-heading">
    <div class="intro">
      <div>
        <p class="eyebrow intro-eyebrow">
          <span class="tiny-pin"></span> НОВОСТИ НА КАРТЕ · НЕМНОГО С ЮМОРОМ
        </p>
        <h1 id="map-heading">Где чума? <span>Без паники.</span></h1>
        <p class="intro-description">
          Новости о чуме, публикации об Иркутской области и карта упомянутых
          мест. Разбираемся, что известно, по открытым источникам.
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
  <NewsFeed />
  <YandexAd v-if="advertisingEnabled" />
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
    <p class="about-intro">
      Название громкое, история длинная. За средневековым образом стоит
      бактериальная инфекция, которую изучают и лечат сегодня.
    </p>
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
          История пандемий — не адрес первого появления. Единственное
          достоверное место возникновения болезни здесь не утверждается.
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
    <div class="plague-questions">
      <div class="question-heading">
        <p class="eyebrow">БЕЗ СРЕДНЕВЕКОВЫХ МИФОВ</p>
        <h3>Вопросы без паники</h3>
        <p>У чумы нет приложения. Зато есть исследования.</p>
      </div>
      <div class="question-list">
        <details v-for="question in questions" :key="question.title">
          <summary>{{ question.title }}</summary>
          <p>{{ question.text }}</p>
        </details>
      </div>
    </div>
    <div class="about-sources">
      <span>Читать подробнее:</span
      ><a
        href="https://www.who.int/ru/news-room/fact-sheets/detail/plague"
        target="_blank"
        rel="noopener noreferrer"
        >Справка ВОЗ <Icon name="external" /></a
      ><a
        href="https://www.who.int/publications/m/item/epi-win-digest-54-plague-in-the-21st-century-new-evidence-to-control-a-re-emerging-zoonotic-disease"
        target="_blank"
        rel="noopener noreferrer"
        >История пандемий · ВОЗ <Icon name="external" /></a
      ><a
        href="https://www.cdc.gov/plague/about/index.html"
        target="_blank"
        rel="noopener noreferrer"
        >Как распространяется · CDC <Icon name="external"
      /></a>
    </div>
  </section>
  <CityCheck />
</template>
