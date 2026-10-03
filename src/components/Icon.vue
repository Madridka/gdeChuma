<script setup lang="ts">
withDefaults(
  defineProps<{
    name:
      "pin" | "info" | "crosshair" | "external" | "book" | "music" | "refresh";
  }>(),
  {},
);
</script>

<template>
  <svg
    class="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.7"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'pin'">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </template>
    <template v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-9h.01" />
    </template>
    <template v-else-if="name === 'crosshair'">
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
    </template>
    <template v-else-if="name === 'external'">
      <path
        d="M14 3h7v7m0-7L10 14M10 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-6"
      />
    </template>
    <template v-else-if="name === 'book'">
      <path
        d="M12 5v16M3 3c4-1 7 0 9 2 2-2 5-3 9-2v16c-4-1-7 0-9 2-2-2-5-3-9-2Z"
      />
    </template>
    <template v-else-if="name === 'music'">
      <path d="M9 18V5l11-2v13M9 9l11-2" />
      <ellipse cx="6" cy="18" rx="3" ry="2" />
      <ellipse cx="17" cy="16" rx="3" ry="2" />
    </template>
    <template v-else>
      <path d="M20 7v5h-5M4 17v-5h5" />
      <path d="M5.5 7a8 8 0 0 1 13-1L20 8M4 16l1.5 2a8 8 0 0 0 13-1" />
    </template>
  </svg>
</template>
