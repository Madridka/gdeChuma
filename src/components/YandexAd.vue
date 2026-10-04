<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  advertisingBlockId, advertisingContainerId, loadAdvertising,
} from "../advertising";
import { cookieChoice, hasAnalyticsConsent, openCookieSettings } from "../cookieConsent";

const container = ref<HTMLElement>();
const unavailable = ref(false);
let active = true;
let generation = 0;
let stopWatching: (() => void) | undefined;

async function showAdvertising() {
  const attempt = ++generation;
  unavailable.value = false;
  if (!hasAnalyticsConsent()) return;
  try {
    await loadAdvertising();
    if (!active || attempt !== generation || !hasAnalyticsConsent() || !container.value?.isConnected) return;
    window.yaContextCb!.push(() => {
      if (!active || attempt !== generation || !hasAnalyticsConsent() || !container.value?.isConnected) return;
      try {
        window.Ya!.Context.AdvManager.render({
          blockId: advertisingBlockId,
          renderTo: advertisingContainerId,
        }, () => {
          if (active && attempt === generation) unavailable.value = true;
        });
      } catch { unavailable.value = true; }
    });
  } catch {
    if (active && attempt === generation) unavailable.value = true;
  }
}

onMounted(() => {
  stopWatching = watch(cookieChoice, showAdvertising, { immediate: true, flush: "post" });
});
onBeforeUnmount(() => {
  active = false;
  generation++;
  stopWatching?.();
});
</script>

<template>
  <section class="advertising-section content-section" aria-label="Реклама" data-nosnippet>
    <p class="advertising-label">Реклама</p>
    <!-- Yandex.RTB R-A-20171821-1 -->
    <div v-if="cookieChoice === 'accepted'" :id="advertisingContainerId" ref="container" class="advertising-slot"></div>
    <p v-if="cookieChoice !== 'accepted'" class="advertising-note">
      Реклама Яндекса загружается с вашего согласия.
      <button type="button" class="advertising-settings" @click="openCookieSettings">Настроить cookie</button>
    </p>
    <p v-else-if="unavailable" class="advertising-note">Сейчас нет доступного объявления.</p>
  </section>
</template>
