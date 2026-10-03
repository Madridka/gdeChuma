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
const isDragging = ref(false);
let drag:
  | {
      pointerId: number;
      startX: number;
      startY: number;
      scrollLeft: number;
      moved: boolean;
    }
  | undefined;
let suppressClick = false;
function startDrag(event: PointerEvent) {
  if (event.pointerType !== "mouse" || event.button !== 0 || !track.value)
    return;
  suppressClick = false;
  drag = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    scrollLeft: track.value.scrollLeft,
    moved: false,
  };
  isDragging.value = true;
}
function moveDrag(event: PointerEvent) {
  const element = track.value;
  if (!drag || !element || event.pointerId !== drag.pointerId) return;
  const distance = event.clientX - drag.startX;
  if (!drag.moved) {
    if (
      Math.abs(distance) < 6 ||
      Math.abs(distance) < Math.abs(event.clientY - drag.startY)
    )
      return;
    drag.moved = true;
    element.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  element.scrollLeft = drag.scrollLeft - distance;
}
function endDrag(event: PointerEvent) {
  if (!drag || drag.pointerId !== event.pointerId) return;
  suppressClick = drag.moved && event.type === "pointerup";
  drag = undefined;
  isDragging.value = false;
  if (track.value?.hasPointerCapture(event.pointerId))
    track.value.releasePointerCapture(event.pointerId);
}
function leaveDrag(event: PointerEvent) {
  if (!track.value?.hasPointerCapture(event.pointerId)) endDrag(event);
}
function guardClick(event: MouseEvent) {
  if (!suppressClick || event.detail === 0) return;
  suppressClick = false;
  event.preventDefault();
  event.stopPropagation();
}
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
      :class="{ 'is-dragging': isDragging }"
      tabindex="0"
      role="region"
      aria-label="Лента новостей. Прокручивайте стрелками или свайпом"
      @scroll.passive="updateControls"
      @pointerdown="startDrag"
      @pointermove="moveDrag"
      @pointerup="endDrag"
      @pointercancel="endDrag"
      @pointerleave="leaveDrag"
      @lostpointercapture="endDrag"
      @click.capture="guardClick"
      @dragstart.prevent
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
