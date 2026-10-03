<script setup lang="ts">
import { ref } from "vue";
import Icon from "./Icon.vue";
import { formatDate, irkutskBrief } from "../data/content";

const query = ref("");
const error = ref("");
const result = ref<{ city: string; isIrkutsk: boolean }>();
const maxLength = 120;

function checkCity() {
  error.value = "";
  result.value = undefined;
  const value = query.value.trim().normalize("NFKC");
  if (!value) {
    error.value = "Введите город или адрес.";
    return;
  }
  if (value.length > maxLength) {
    error.value = "Достаточно 120 символов. Попробуйте написать короче.";
    return;
  }
  if (
    /[\u0000-\u001f\u007f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/u.test(value)
  ) {
    error.value =
      "В адресе есть невидимые служебные символы. Введите его обычным текстом.";
    return;
  }
  const isIrkutsk =
    /(?:^|[^\p{L}\p{N}])(?:иркутск(?:а|у|ом|е)?|irkutsk)(?=$|[^\p{L}\p{N}])/iu.test(
      value,
    );
  result.value = { city: value, isIrkutsk };
}
</script>

<template>
  <section class="city-check content-section" aria-labelledby="city-heading">
    <div class="city-intro">
      <p class="eyebrow">СВЕДЕНИЯ ИЗ ПУБЛИКАЦИЙ</p>
      <h2 id="city-heading">Что известно по вашему городу?</h2>
      <p>Введите город или адрес. Покажем сведения из подборки.</p>
    </div>
    <form class="city-form" @submit.prevent="checkCity">
      <label for="city-query">Город или адрес</label>
      <div class="city-input-row">
        <input
          id="city-query"
          v-model="query"
          type="text"
          name="city"
          placeholder="Например, Томск"
          :maxlength="maxLength"
          autocomplete="off"
          spellcheck="false"
          :aria-invalid="Boolean(error)"
          :aria-describedby="error ? 'city-note city-error' : 'city-note'"
          @input="
            error = '';
            result = undefined;
          "
        /><button class="button" type="submit">
          <Icon name="crosshair" /> Проверить
        </button>
      </div>
      <p id="city-note" class="city-note">
        Поиск по опубликованной подборке. Ввод остаётся в вашем браузере.
      </p>
      <p v-if="error" id="city-error" class="city-error" role="alert">
        {{ error }}
      </p>
    </form>
    <div
      v-if="result"
      class="city-result"
      :class="{ 'city-result-irkutsk': result.isIrkutsk }"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="city-result-copy">
        <span class="news-category">{{
          result.isIrkutsk ? "ПО СООБЩЕНИЯМ ВЛАСТЕЙ" : "СВЕДЕНИЯ В ПОДБОРКЕ"
        }}</span>
        <p class="city-result-query">{{ result.city }}</p>
        <h3>
          {{
            result.isIrkutsk
              ? irkutskBrief.title
              : "В подборке пока нет сведений по этому городу."
          }}
        </h3>
        <template v-if="result.isIrkutsk">
          <p class="city-brief-date">
            Сообщения от
            <time :datetime="irkutskBrief.publishedAt">{{
              formatDate(irkutskBrief.publishedAt)
            }}</time>
            · Проверено
            <time :datetime="irkutskBrief.checkedAt">{{
              formatDate(irkutskBrief.checkedAt)
            }}</time>
          </p>
          <ul class="city-brief-list">
            <li v-for="item in irkutskBrief.items" :key="item">{{ item }}</li>
          </ul>
          <p class="city-brief-note">{{ irkutskBrief.note }}</p>
          <div class="city-brief-sources">
            <a
              v-for="source in irkutskBrief.sources"
              :key="source.url"
              :href="source.url"
              target="_blank"
              rel="noopener noreferrer"
              >{{ source.label }} <Icon name="external"
            /></a>
          </div>
          <small
            >Краткий пересказ опубликованных сообщений. Сайт не является
            официальным каналом оповещения.</small
          >
        </template>
        <p v-else>
          Отсутствие записи не означает отсутствия заболевания. Здесь нет
          непрерывного мониторинга эпидемиологической ситуации.
        </p>
      </div>
    </div>
  </section>
</template>
