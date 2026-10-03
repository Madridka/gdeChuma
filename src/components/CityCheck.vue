<script setup lang="ts">
import { ref } from "vue";
import Icon from "./Icon.vue";

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
      <p class="eyebrow">МИНУТКА НЕСЕРЬЁЗНОСТИ</p>
      <h2 id="city-heading">Есть ли у вас чума в городе?</h2>
      <p>Введите город или адрес. Ответим с юмором.</p>
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
        Шуточный поиск. Введённый адрес не проверяется — чайный режим включён.
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
        <span class="news-category">ШУТОЧНЫЙ ОТВЕТ</span>
        <p class="city-result-query">{{ result.city }}</p>
        <h3>
          {{
            result.isIrkutsk
              ? "Иркутск, у вас особый чайный режим."
              : "По нашей шуточной карте — всё спокойно!"
          }}
        </h3>
        <p>
          {{
            result.isIrkutsk
              ? "Наш персонаж уже надел костюм и отправился за чаем. Новости читаем, панику оставляем за кадром."
              : "Чума на нашей карте не отметилась. Пусть так и остаётся — а вы пока заваривайте чай."
          }}
        </p>
        <small>Игровой ответ, не эпидемиологическая сводка.</small>
      </div>
      <figure v-if="result.isIrkutsk" class="city-character">
        <img
          src="/images/irkutsk-tea.png"
          alt="Вымышленный персонаж в защитном костюме с кружкой чая"
          width="1254"
          height="1254"
          loading="lazy"
          decoding="async"
        />
        <figcaption>Вымышленный персонаж · иллюстрация</figcaption>
      </figure>
    </div>
  </section>
</template>
