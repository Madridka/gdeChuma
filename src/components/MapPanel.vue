<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from "vue";
import { formatDate, markerNotice, placeWord, site } from "../data/content";
import type { MapPoint } from "../data/content";
import Icon from "./Icon.vue";

const props = defineProps<{ points: MapPoint[] }>();
const selectedId = ref(props.points[0]?.id);
const selected = computed(
  () =>
    props.points.find((point) => point.id === selectedId.value) ??
    props.points[0],
);
const mapStatus = ref<"loading" | "ready" | "error">("loading");
const reloadKey = ref(0);
const focusRequest = ref(0);
const MapCanvas = defineAsyncComponent({
  loader: () => import("./MapCanvas.vue"),
  timeout: 15000,
  onError(_error, _retry, fail) {
    mapStatus.value = "error";
    fail();
  },
});

function retry() {
  mapStatus.value = "loading";
  reloadKey.value++;
}

function focusIrkutsk() {
  selectedId.value = props.points[0]?.id;
  focusRequest.value++;
}
</script>

<template>
  <div class="map-layout">
    <div class="map-column">
      <div class="map-topbar">
        <span class="map-label"><Icon name="pin" /> Иркутск и окрестности</span>
        <div class="map-actions">
          <button
            class="map-locate map-retry"
            type="button"
            @click="retry"
            aria-label="Обновить карту"
            title="Обновить карту"
          >
            <Icon name="refresh" />
          </button>
          <button class="map-locate" type="button" @click="focusIrkutsk">
            <Icon name="crosshair" /> К Иркутску
          </button>
        </div>
      </div>
      <div class="map-surface" aria-label="Карта мест, упомянутых в новостях">
        <MapCanvas
          :key="reloadKey"
          :points="points"
          :selected-id="selectedId"
          :focus-request="focusRequest"
          @status="mapStatus = $event"
        />
        <div v-if="mapStatus === 'loading'" class="map-message" role="status">
          Загружаем карту…
        </div>
        <div
          v-if="mapStatus === 'error'"
          class="map-message map-error"
          role="status"
        >
          <Icon name="info" />
          <div>
            <strong>Карта сейчас недоступна</strong>
            <p>Адрес и источники доступны в карточке места.</p>
          </div>
          <button class="button button-small" type="button" @click="retry">
            <Icon name="refresh" /> Повторить
          </button>
        </div>
      </div>
    </div>

    <aside class="place-panel" aria-label="Карточка места">
      <div class="place-panel-heading">
        <span class="eyebrow">НА КАРТЕ</span
        ><span class="count-badge"
          >{{ points.length }} {{ placeWord(points.length) }}</span
        >
      </div>
      <div
        v-if="points.length > 1"
        class="point-picker"
        aria-label="Выберите место"
      >
        <button
          v-for="point in points"
          :key="point.id"
          type="button"
          :class="{ active: selected?.id === point.id }"
          :aria-pressed="selected?.id === point.id"
          @click="selectedId = point.id"
        >
          {{ point.name }}
        </button>
      </div>
      <template v-if="selected">
        <span class="place-category">Место, упомянутое в новостях</span>
        <h3>{{ selected.name }}</h3>
        <p class="place-address"><Icon name="pin" /> {{ selected.address }}</p>
        <p class="place-description">{{ selected.description }}</p>
        <div class="place-notice">
          <Icon name="info" />
          <p>{{ markerNotice }}</p>
        </div>
        <div class="place-sources">
          <a
            v-for="source in selected.sources"
            :key="source.url"
            :href="source.url"
            target="_blank"
            rel="noopener noreferrer"
            >{{ source.label }}<Icon name="external"
          /></a>
        </div>
        <p class="checked-date">
          Проверено
          <time :datetime="selected.checkedAt">{{
            formatDate(selected.checkedAt)
          }}</time>
        </p>
      </template>
      <p v-else class="place-description">Пока нет отмеченных мест.</p>
      <div class="editor-note">
        Адреса из открытых публикаций.<br />Источники указаны в карточке.
        <a
          :href="site.map.externalUrl"
          target="_blank"
          rel="noopener noreferrer"
          >Открыть место в Яндекс Картах <Icon name="external"
        /></a>
      </div>
    </aside>
  </div>
</template>
