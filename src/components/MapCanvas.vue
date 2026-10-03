<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { site } from "../data/content";
import type { MapPoint } from "../data/content";

const props = defineProps<{
  points: MapPoint[];
  selectedId?: string;
  focusRequest: number;
}>();
const emit = defineEmits<{
  status: [status: "loading" | "ready" | "error"];
}>();
const revision = ref(0);
const focusSelected = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

// Only finite, geographically valid coordinates can enter the trusted widget URL.
const validPoints = computed(() =>
  props.points.filter(
    (point) =>
      Number.isFinite(point.latitude) &&
      Math.abs(point.latitude) <= 90 &&
      Number.isFinite(point.longitude) &&
      Math.abs(point.longitude) <= 180,
  ),
);
const widgetUrl = computed(() => {
  const selected = focusSelected.value
    ? validPoints.value.find((point) => point.id === props.selectedId)
    : undefined;
  const center = selected
    ? [selected.latitude, selected.longitude]
    : site.map.center;
  const url = new URL("https://yandex.ru/map-widget/v1/");
  url.searchParams.set("ll", `${center[1]},${center[0]}`);
  url.searchParams.set("z", String(selected ? 14 : site.map.zoom));
  url.searchParams.set(
    "pt",
    validPoints.value
      .map((point) => `${point.longitude},${point.latitude},pm2orm`)
      .join("~"),
  );
  url.searchParams.set("l", "map");
  url.searchParams.set("lang", "ru_RU");
  return url.href;
});

function startLoading() {
  if (timer) clearTimeout(timer);
  emit("status", "loading");
  timer = setTimeout(() => emit("status", "error"), 15000);
}

function loaded() {
  if (timer) clearTimeout(timer);
  // Cross-origin iframe load cannot prove that all provider tiles loaded.
  // A permanent reload button and a direct map link remain available.
  emit("status", "ready");
}

function failed() {
  if (timer) clearTimeout(timer);
  emit("status", "error");
}

watch(
  () => props.selectedId,
  () => {
    focusSelected.value = true;
    revision.value++;
    startLoading();
  },
);
watch(
  () => props.focusRequest,
  () => {
    focusSelected.value = false;
    revision.value++;
    startLoading();
  },
);
watch(() => props.points, startLoading, { deep: true });
onMounted(startLoading);
onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});
</script>

<template>
  <iframe
    :key="revision"
    :src="widgetUrl"
    class="map-canvas map-widget"
    title="Яндекс Карты: места, упомянутые в публикациях"
    data-testid="map-widget"
    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    allow="geolocation 'none'; camera 'none'; microphone 'none'; payment 'none'"
    referrerpolicy="strict-origin-when-cross-origin"
    @load="loaded"
    @error="failed"
  ></iframe>
</template>
