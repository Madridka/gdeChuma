<script setup lang="ts">
import { ref } from "vue";
import Icon from "./Icon.vue";
import { cityJokes, irkutskJokes, unknownCityJokes, type CityJoke } from "../data/cityJokes";
import { distanceOrigin, findCityDistance } from "../data/cityDistances";

const query = ref("");
const error = ref("");
const result = ref<{ city: string; headline: string; joke: CityJoke; note: string }>();
const maxLength = 120;
let lastJoke = -1;

function answerCity(city: string) {
  const knownCity = findCityDistance(city);
  const isIrkutsk = knownCity?.name === distanceOrigin.name;
  const replies = isIrkutsk ? irkutskJokes : knownCity ? cityJokes : unknownCityJokes;
  lastJoke = lastJoke < 0 ? Math.floor(Math.random() * replies.length) : (lastJoke + 1) % replies.length;
  const joke = replies[lastJoke]!;
  const distance = knownCity ? new Intl.NumberFormat("ru-RU").format(knownCity.distanceKm) : "";
  const note = isIrkutsk
    ? "Доктор — вымышленный персонаж. Ответ шуточный, ситуацию в городе не оценивает."
    : knownCity
      ? "Расстояние примерное, по прямой от центра Иркутска до центра города, с округлением до 10 км. По дорогам путь будет другим. Ответ доктора шуточный."
      : "Уточните название одного города. Расстояние пока не указываем. Ответ доктора шуточный.";
  result.value = { city, joke, headline: joke.headline.replace("{distance}", `около ${distance}`), note };
}

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
  answerCity(value);
}
</script>

<template>
  <section class="city-check content-section" aria-labelledby="city-heading">
    <div class="city-intro">
      <p class="eyebrow">ВОРОНЬИЙ НАВИГАТОР · ШУТОЧНЫЙ РЕЖИМ</p>
      <h2 id="city-heading">Доктор чумы уже едет к вам?</h2>
      <p>Назовите город — доктор посмотрит в карту, допьёт чай и что-нибудь ответит.</p>
    </div>
    <form class="city-form ym-disable-submit" @submit.prevent="checkCity">
      <label for="city-query">Город или адрес</label>
      <div class="city-input-row">
        <input
          id="city-query"
          class="ym-disable-keys"
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
        Доктор шутит, адрес никуда не отправляем. Ввод остаётся в вашем браузере.
      </p>
      <p v-if="error" id="city-error" class="city-error" role="alert">
        {{ error }}
      </p>
    </form>
    <div
      v-if="result"
      class="city-result"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div class="city-result-copy">
        <span class="news-category">ШУТОЧНЫЙ ОТВЕТ ДОКТОРА</span>
        <p class="city-result-query ym-hide-content">{{ result.city }}</p>
        <h3>{{ result.headline }}</h3>
        <p>{{ result.joke.text }}</p>
        <small>{{ result.note }}</small>
        <button class="button button-outline city-another" type="button" @click="answerCity(result.city)">
          <Icon name="refresh" /> Ещё ответ доктора
        </button>
      </div>
      <figure class="city-character">
        <img :src="result.joke.image" :alt="result.joke.alt" width="1024" height="1024" loading="lazy" decoding="async" />
        <figcaption>{{ result.joke.caption }}</figcaption>
      </figure>
    </div>
  </section>
</template>
