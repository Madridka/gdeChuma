<script setup lang="ts">
import { RouterLink } from "vue-router";
import { site } from "../data/content";
import Icon from "../components/Icon.vue";
</script>
<template>
  <article class="document-page project-page" aria-labelledby="project-title">
    <RouterLink class="document-back" to="/">← На главную</RouterLink>
    <p class="eyebrow">О ПРОЕКТЕ</p>
    <h1 id="project-title">
      Новости читаем.<br /><span>Панику не листаем.</span>
    </h1>
    <p class="document-lead">
      ГдеЧУМА — информационно-развлекательный сайт об инфоповодах вокруг чумы.
      Немного новостей, немного истории и немного совершенно несерьёзного чая.
    </p>
    <div class="project-cards">
      <section>
        <span class="fact-number">01</span>
        <h2>Публикации, а не слуховая карта</h2>
        <p>
          Информация берётся из открытых источников. У каждой новости есть дата,
          название издания и ссылка на полный текст. Версии и мнения сохраняют
          этот статус. Подборка обновляется по мере появления и проверки
          материалов.
        </p>
      </section>
      <section>
        <span class="fact-number">02</span>
        <h2>Адреса с контекстом</h2>
        <p>
          Карта показывает места, упомянутые в публикациях. Метка обозначает
          адрес учреждения, а не подтверждённый очаг, опасную территорию или
          чью-либо виновность. Официальные сведения следует искать в актуальных
          сообщениях компетентных органов.
        </p>
      </section>
      <section>
        <span class="fact-number">03</span>
        <h2>Юмор с понятной подписью</h2>
        <p>
          Игровой поиск, чайный режим и персонаж в костюме придуманы для сайта.
          Это художественные элементы. Реальные новостные публикации и справка о
          болезни сопровождаются источниками; шутки не подменяют медицинские
          выводы.
        </p>
      </section>
      <section>
        <span class="fact-number">04</span>
        <h2>Просто открыть и почитать</h2>
        <p>
          Регистрации, пользовательских отметок и комментариев нет. Ввод города
          остаётся в браузере. Карта и внешние страницы работают по правилам
          соответствующих сервисов. Музыкальная пасхалка открывается только по
          нажатию.
        </p>
      </section>
    </div>
    <div class="document-contact">
      <h2>Источники — рядом. Условия — отдельно.</h2>
      <p>
        Для полного контекста читайте исходные материалы. Для условий
        использования есть отдельная страница.
      </p>
      <div class="document-actions">
        <RouterLink class="button button-outline" to="/rules/"
          >Правила и условия <Icon name="external" /></RouterLink
        ><a
          class="document-correction"
          :href="site.issuesUrl"
          target="_blank"
          rel="noopener noreferrer"
          >Сообщить о неточности <Icon name="external"
        /></a>
      </div>
    </div>
  </article>
</template>
