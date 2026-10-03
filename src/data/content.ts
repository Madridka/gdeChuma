export interface SourceLink {
  label: string;
  url: string;
}

export interface MapPoint {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  description: string;
  checkedAt: string;
  sources: SourceLink[];
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  publishedAt: string;
  source: string;
  url: string;
  category: "Сообщение СМИ" | "Исследования" | "Справка";
}

export const site = {
  updatedAt: "2026-10-03",
  issuesUrl: "https://github.com/Madridka/gdeChuma/issues/new",
  songUrl: "https://www.youtube.com/watch?v=X0CTWa6GfbE",
  map: {
    tileUrl: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    center: [52.275346, 104.321407] as [number, number],
    zoom: 11,
  },
};

export const markerNotice =
  "Метка обозначает адрес учреждения и не подтверждает наличие заражения или опасность территории.";

export const points: MapPoint[] = [
  {
    id: "irkutsk-institute",
    name: "Иркутский противочумный институт",
    address: "Иркутск, ул. Трилиссера, 78",
    // Координаты из ссылки «Маршрут» карточки 2ГИС:
    // https://2gis.ru/irkutsk/directions/points/|104.321407,52.275346;1548640652905815
    latitude: 52.275346,
    longitude: 104.321407,
    description:
      "Институт упоминается в публикации «Медиазоны» от 2 октября 2026 года о событиях в Иркутской области. Детали о чуме в материале приводятся со ссылками на СМИ и телеграм-каналы; метка не является подтверждением этих сообщений.",
    checkedAt: "2026-10-03",
    sources: [
      {
        label: "Публикация «Медиазоны»",
        url: "https://zona.media/news/2026/10/02/plague",
      },
      {
        label: "Адрес и координаты · 2ГИС",
        url: "https://2gis.ru/irkutsk/firm/1548640652905815",
      },
    ],
  },
];

export const news: NewsItem[] = [
  {
    id: "irkutsk-2026",
    title: "Иркутская область: что сообщают СМИ",
    description:
      "«Медиазона» пишет о смерти сотрудницы института и карантинных мерах. Версию о чуме издание приводит со ссылками на другие СМИ; цитируемое сообщение РИА говорит об инфекции, природа которой устанавливается. Это пересказ публикации, а не подтверждённый диагноз.",
    publishedAt: "2026-10-02",
    source: "Медиазона",
    url: "https://zona.media/news/2026/10/02/plague",
    category: "Сообщение СМИ",
  },
  {
    id: "who-2025",
    title: "Чума в XXI веке: обзор ВОЗ",
    description:
      "ВОЗ рассматривает историю болезни и новые данные об её лечении. В обзоре подчёркивается значение раннего выявления и своевременной медицинской помощи.",
    publishedAt: "2025-07-23",
    source: "Всемирная организация здравоохранения",
    url: "https://www.who.int/publications/m/item/epi-win-digest-54-plague-in-the-21st-century-new-evidence-to-control-a-re-emerging-zoonotic-disease",
    category: "Исследования",
  },
  {
    id: "who-facts",
    title: "Что известно о возбудителе и передаче",
    description:
      "Справка ВОЗ объясняет природные очаги, формы болезни и пути передачи. Для подтверждения диагноза необходимо лабораторное исследование.",
    publishedAt: "2017-10-31",
    source: "Всемирная организация здравоохранения",
    url: "https://www.who.int/ru/news-room/fact-sheets/detail/plague",
    category: "Справка",
  },
];

export const facts = [
  {
    number: "01",
    title: "Бактерия, а не вирус",
    description:
      "Чуму вызывает Yersinia pestis. Возбудитель может сохраняться в природных очагах среди мелких млекопитающих и их блох.",
  },
  {
    number: "02",
    title: "Откуда она берётся",
    description:
      "Заражение возможно через инфицированных блох, контакт с заражёнными тканями или жидкостями. При лёгочной форме возможна передача с дыхательными частицами.",
  },
  {
    number: "03",
    title: "Средневековье прошло",
    description:
      "Своевременная диагностика и лечение важны. Чума поддаётся лечению антибиотиками, которые назначает врач. Карта и интернет не заменяют медицинскую помощь.",
  },
];

export const history = [
  {
    period: "VI век",
    title: "Юстинианова чума",
    description:
      "Первая из трёх крупных исторических пандемий, выделяемых в обзоре ВОЗ.",
  },
  {
    period: "XIV век",
    title: "Чёрная смерть",
    description: "Вторая пандемия, сильно затронувшая Европу.",
  },
  {
    period: "Конец XIX века",
    title: "Третья пандемия",
    description: "Начало следующей крупной волны распространения болезни.",
  },
];

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T12:00:00Z`));
}

export function placeWord(count: number): string {
  const category = new Intl.PluralRules("ru-RU").select(count);
  return category === "one" ? "место" : category === "few" ? "места" : "мест";
}
