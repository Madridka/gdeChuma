<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { markerNotice, site } from "../data/content";
import type { MapPoint } from "../data/content";

const props = defineProps<{
  points: MapPoint[];
  selectedId?: string;
  focusRequest: number;
}>();
const emit = defineEmits<{
  select: [id: string];
  status: [status: "loading" | "ready" | "error"];
}>();
const container = ref<HTMLDivElement>();
let map: L.Map | undefined;
let tiles: L.TileLayer | undefined;
let markers: L.LayerGroup | undefined;
let observer: ResizeObserver | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
let hadTileError = false;
let isUnavailable = false;
let destroyed = false;
const byId = new Map<string, L.Marker>();

function setStatus(status: "loading" | "ready" | "error") {
  if (destroyed) return;
  isUnavailable = status === "error";
  emit("status", status);
}

function popupFor(point: MapPoint) {
  const content = document.createElement("div");
  content.className = "point-popup";
  const category = document.createElement("span");
  category.textContent = "Место, упомянутое в новостях";
  const heading = document.createElement("strong");
  heading.textContent = point.name;
  const address = document.createElement("p");
  address.textContent = point.address;
  const notice = document.createElement("p");
  notice.className = "popup-notice";
  notice.textContent = markerNotice;
  content.append(category, heading, address, notice);
  return content;
}

function renderPoints() {
  if (!map || !markers) return;
  markers.clearLayers();
  byId.clear();
  for (const point of props.points) {
    const marker = L.marker([point.latitude, point.longitude], {
      title: point.name,
      alt: point.name,
      keyboard: true,
      icon: L.divIcon({
        className: "custom-map-marker",
        html: '<span class="marker-body"><span></span></span>',
        iconSize: [36, 46],
        iconAnchor: [18, 46],
        popupAnchor: [0, -43],
      }),
    });
    marker.bindPopup(popupFor(point), { maxWidth: 280 });
    marker.on("click", () => emit("select", point.id));
    marker.addTo(markers);
    byId.set(point.id, marker);
  }
}

function selectPoint() {
  const marker = props.selectedId ? byId.get(props.selectedId) : undefined;
  if (marker && map) {
    map.panTo(marker.getLatLng(), {
      animate: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
    marker.openPopup();
  }
}

onMounted(() => {
  if (!container.value) return;
  try {
    map = L.map(container.value, {
      center: site.map.center,
      zoom: site.map.zoom,
      zoomControl: false,
      scrollWheelZoom: false,
      minZoom: 3,
      maxZoom: 19,
      attributionControl: true,
      zoomAnimation: !window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches,
    });
    L.control.zoom({ position: "bottomleft" }).addTo(map);
    tiles = L.tileLayer(site.map.tileUrl, {
      attribution: site.map.attribution,
      maxZoom: 19,
    });
    tiles.on("loading", () => {
      hadTileError = false;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setStatus("error"), 12000);
    });
    tiles.on("tileerror", () => {
      hadTileError = true;
    });
    tiles.on("load", () => {
      if (timer) clearTimeout(timer);
      // A partial map is also marked unavailable rather than silently hiding failed tiles.
      setStatus(hadTileError ? "error" : "ready");
    });
    tiles.addTo(map);
    markers = L.layerGroup().addTo(map);
    renderPoints();
    observer = new ResizeObserver(() => map?.invalidateSize());
    observer.observe(container.value);
  } catch {
    setStatus("error");
  }
});

watch(() => props.points, renderPoints, { deep: true });
watch(() => props.selectedId, selectPoint);
watch(
  () => props.focusRequest,
  () => {
    map?.setView(site.map.center, site.map.zoom, { animate: false });
    if (isUnavailable) tiles?.redraw();
  },
);

onBeforeUnmount(() => {
  destroyed = true;
  if (timer) clearTimeout(timer);
  observer?.disconnect();
  map?.remove();
});
</script>

<template>
  <div ref="container" class="map-canvas" data-testid="map-canvas"></div>
</template>
