import { build } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";

await build();
// GitHub Pages cannot set arbitrary response headers. A real CSP meta policy
// protects production without development/HMR exceptions.
// Metrika can use regional endpoints and Webvisor workers/frames:
// https://yandex.ru/support/metrica/ru/code/install-counter-csp
const metrikaHosts = [
  "mc.yandex.ru",
  "mc.yandex.az",
  "mc.yandex.by",
  "mc.yandex.co.il",
  "mc.yandex.com",
  "mc.yandex.com.am",
  "mc.yandex.com.ge",
  "mc.yandex.com.tr",
  "mc.yandex.ee",
  "mc.yandex.fr",
  "mc.yandex.kg",
  "mc.yandex.kz",
  "mc.yandex.lt",
  "mc.yandex.lv",
  "mc.yandex.md",
  "mc.yandex.tj",
  "mc.yandex.tm",
  "mc.yandex.uz",
  "mc.webvisor.com",
  "mc.webvisor.org",
];
const metrikaSources = metrikaHosts.map((host) => `https://${host}`).join(" ");
const metrikaSockets = metrikaHosts.map((host) => `wss://${host}`).join(" ");
const policy = [
  "default-src 'self'",
  `script-src 'self' ${metrikaSources} https://yastatic.net`,
  "style-src 'self'",
  `img-src 'self' ${metrikaSources}`,
  "font-src 'self'",
  `connect-src ${metrikaSources} ${metrikaSockets}`,
  `frame-src https://yandex.ru blob: ${metrikaSources}`,
  `child-src blob: ${metrikaSources}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");
const output = new URL("../dist/index.html", import.meta.url);
const html = await readFile(output, "utf8");
const protectedHtml = html.replace(
  "<head>",
  `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
);
await writeFile(output, protectedHtml);
const privacy = JSON.parse(await readFile(new URL("../src/data/privacy.json", import.meta.url), "utf8"));
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
function renderPrivacyDocument(page) {
  const sections = page.path === "privacy"
    ? `<ol class="document-rules">${privacy.sections.map((section) =>
        `<li><h2>${escapeHtml(section.title)}</h2>${section.paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}</li>`,
      ).join("")}</ol>`
    : `<div class="consent-text">${privacy.consent.map((text) => `<p>${escapeHtml(text)}</p>`).join("")}</div>`;
  return `<main class="page-container"><article class="document-page">
    <a class="document-back" href="/">← На главную</a>
    <h1>${escapeHtml(page.title.replace(" — ГдеЧУМА", ""))}</h1>
    <p class="document-date">Редакция от <time datetime="${privacy.updatedAt}">${privacy.updatedAt}</time></p>
    <section class="document-contact"><h2>Оператор и контакт для обращений</h2>
    <p>${escapeHtml(privacy.operator)}. <a class="document-inline-link" href="mailto:${escapeHtml(privacy.email)}">${escapeHtml(privacy.email)}</a>.</p></section>
    ${sections}
    <p class="document-external"><a href="/privacy/">Политика конфиденциальности</a> · <a href="/consent/">Согласие на обработку данных</a> ·
    <a href="https://yandex.ru/legal/metrica_termsofuse/">Условия Метрики</a> ·
    <a href="https://yandex.ru/legal/confidential/">Конфиденциальность Яндекса</a> ·
    <a href="https://yandex.ru/support/metrica/ru/general/cookie-usage">Cookie Метрики</a> ·
    <a href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">Конфиденциальность GitHub</a></p>
  </article></main>`;
}
// Real entry files allow direct visits/reloads on GitHub Pages without rewrites.
for (const page of [
  {
    path: "rules",
    title: "Правила и условия — ГдеЧУМА",
    description:
      "Условия использования сайта ГдеЧУМА: открытые источники, юмор, значение меток и ограничения ответственности.",
  },
  {
    path: "project",
    title: "О проекте — ГдеЧУМА",
    description:
      "ГдеЧУМА — новости из открытых источников, карта упоминаний, справка о чуме и немного юмора.",
  },
  {
    path: "privacy",
    title: "Политика конфиденциальности — ГдеЧУМА",
    description:
      "Обработка персональных данных на сайте ГдеЧУМА: Яндекс Метрика, cookies, Вебвизор, согласие и его отзыв.",
  },
  {
    path: "consent",
    title: "Согласие на обработку данных — ГдеЧУМА",
    description:
      "Условия добровольного согласия на обработку данных для аналитики сайта ГдеЧУМА и порядок его отзыва.",
  },
]) {
  const directory = new URL(`../dist/${page.path}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  let document = protectedHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(
      /(<link\s+rel="canonical"\s+href=")[^"]+/,
      `$1https://gdechuma.ru/${page.path}/`,
    )
    .replace(/(name="description"\s+content=")[^"]+/, `$1${page.description}`);
  if (["privacy", "consent"].includes(page.path)) {
    // The documents remain readable when JavaScript is disabled or blocked.
    document = document.replace('<div id="app"></div>', `<div id="app">${renderPrivacyDocument(page)}</div>`);
  }
  await writeFile(new URL("index.html", directory), document);
}
