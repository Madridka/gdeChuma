<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { formatDate, news, site } from "../data/content";
import Icon from "./Icon.vue";
const sortedNews = computed(() =>
  [...news].sort((a, b) =>
    (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""),
  ),
);
const track = ref<HTMLDivElement>();
const canPrevious = ref(false);
const canNext = ref(false);
let observer: ResizeObserver | undefined;
function updateControls() {
  const element = track.value;
  if (!element) return;
  canPrevious.value = element.scrollLeft > 2;
  canNext.value =
    element.scrollLeft + element.clientWidth < element.scrollWidth - 2;
}
function move(direction: number) {
  const element = track.value;
  if (!element) return;
  const card = element.querySelector("article");
  element.scrollBy({
    left: direction * ((card?.getBoundingClientRect().width ?? 320) + 18),
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
}
onMounted(() => {
  observer = new ResizeObserver(updateControls);
  if (track.value) observer.observe(track.value);
  updateControls();
});
onBeforeUnmount(() => observer?.disconnect());
</script>
<template>
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
    <div class="news-controls">
      <p>
        {{ sortedNews.length }} публикаций · разные источники, общий контекст
      </p>
      <div class="news-arrows">
        <button
          type="button"
          aria-label="Предыдущие новости"
          aria-controls="news-track"
          :disabled="!canPrevious"
          @click="move(-1)"
        >
          ←</button
        ><button
          type="button"
          aria-label="Следующие новости"
          aria-controls="news-track"
          :disabled="!canNext"
          @click="move(1)"
        >
          →
        </button>
      </div>
    </div>
    <div
      id="news-track"
      ref="track"
      class="news-track"
      tabindex="0"
      role="region"
      aria-label="Лента новостей. Прокручивайте стрелками или свайпом"
      @scroll.passive="updateControls"
    >
      <article
        v-for="(item, index) in sortedNews"
        :key="item.id"
        class="news-card"
        :class="{ 'news-featured': index === 0 }"
      >
        <div class="news-topline">
          <span class="news-category">{{ item.category }}</span
          ><time v-if="item.publishedAt" :datetime="item.publishedAt">{{
            formatDate(item.publishedAt)
          }}</time
          ><span v-else>Дата в источнике</span>
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
      Новости из открытых публикаций. Даты относятся к материалам источников.
      Листайте — паника в подборку не включена.
    </p>
  </section>
</template>
