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
  updatedAt: "2026-10-04",
  issuesUrl: "https://github.com/Madridka/gdeChuma/issues/new",
  songUrl: "https://www.youtube.com/watch?v=X0CTWa6GfbE",
  map: {
    externalUrl:
      "https://yandex.ru/maps/?ll=104.321407%2C52.275346&z=16&pt=104.321407%2C52.275346",
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
      "В статье IRK.ru от 2 октября 2026 года разбираются события в Шелехове и версии заражения. Связь пациентки с институтом в материале описана как предположение. Отметка показывает адрес учреждения, а не установленный источник инфекции.",
    checkedAt: "2026-10-04",
    sources: [
      {
        label: "Хроника событий · IRK.ru",
        url: "https://www.irk.ru/news/articles/20261002/pest/",
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
    title: "Иркутская область: хроника и версии",
    description:
      "IRK.ru разбирает карантинные меры в Шелеховской больнице и разные версии произошедшего. В материале отделены сообщения властей об особо опасной инфекции от предположений о её природе и обстоятельствах заражения.",
    publishedAt: "2026-10-02",
    source: "IRK.ru · Твой Иркутск",
    url: "https://www.irk.ru/news/articles/20261002/pest/",
    category: "Сообщение СМИ",
  },
  {
    id: "irkutsk-measures",
    title: "О мерах и наблюдении за контактными",
    description:
      "IRK.ru передаёт сообщение губернатора о противоэпидемических мероприятиях. На момент публикации у наблюдаемых контактных лиц, по приведённым данным, не было признаков болезни, а результаты исследований были отрицательными.",
    publishedAt: "2026-10-02",
    source: "IRK.ru · Твой Иркутск",
    url: "https://www.irk.ru/news/20261002/governor/",
    category: "Сообщение СМИ",
  },
  {
    id: "irkutsk-contacts",
    title: "Контактные лица — не число заболевших",
    description:
      "В публикации IRK.ru со ссылкой на источник «Известий» говорится о 197 возможных контактах. Это предварительные сведения о наблюдении; они не означают, что у этих людей подтверждена инфекция.",
    publishedAt: "2026-10-02",
    source: "IRK.ru · Твой Иркутск",
    url: "https://www.irk.ru/news/20261002/contacts/",
    category: "Сообщение СМИ",
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
