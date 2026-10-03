import { build } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";

await build();
// GitHub Pages cannot set arbitrary response headers. A real CSP meta policy
// protects production without development/HMR exceptions.
const policy = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'none'",
  "frame-src https://yandex.ru",
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
]) {
  const directory = new URL(`../dist/${page.path}/`, import.meta.url);
  await mkdir(directory, { recursive: true });
  const document = protectedHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`)
    .replace(
      /(<link\s+rel="canonical"\s+href=")[^"]+/,
      `$1https://gdechuma.ru/${page.path}/`,
    )
    .replace(/(name="description"\s+content=")[^"]+/, `$1${page.description}`);
  await writeFile(new URL("index.html", directory), document);
}
