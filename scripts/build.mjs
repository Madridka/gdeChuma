import { build, createServer } from "vite";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { createMemoryHistory, createRouter } from "vue-router";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";

await build();

// GitHub Pages cannot set arbitrary response headers. Protect production with
// a CSP meta policy. Advertising requires the permissions documented by Yandex:
// https://yandex.ru/support/partner/ru/web/adplatform/csp-configuration
// Metrika's regional endpoints: https://yandex.ru/support/metrica/ru/code/install-counter-csp
const metrikaHosts = [
  "mc.yandex.ru", "mc.yandex.az", "mc.yandex.by", "mc.yandex.co.il",
  "mc.yandex.com", "mc.yandex.com.am", "mc.yandex.com.ge", "mc.yandex.com.tr",
  "mc.yandex.ee", "mc.yandex.fr", "mc.yandex.kg", "mc.yandex.kz", "mc.yandex.lt",
  "mc.yandex.lv", "mc.yandex.md", "mc.yandex.tj", "mc.yandex.tm", "mc.yandex.uz",
  "mc.webvisor.com", "mc.webvisor.org",
];
const metrikaSources = metrikaHosts.map((host) => `https://${host}`).join(" ");
const metrikaSockets = metrikaHosts.map((host) => `wss://${host}`).join(" ");
function contentSecurityPolicy(advertisingEnabled, schema) {
  const adScripts = "https://yastatic.net https://*.yandex.ru https://*.adfox.ru https://yandex.ru https://yandex.com";
  const adResources = "https://yastatic.net https://*.yandex.net https://*.adfox.ru https://*.yandex.ru https://yandex.ru https://yandex.com";
  const adFrames = "https://yandexadexchange.net https://*.yandexadexchange.net https://yastatic.net https://*.yandex.ru https://*.adfox.ru";
  // Keep the advertising SDK's additional permissions out of builds without ads.
  // Hash only our JSON-LD; executable inline scripts remain blocked in that case.
  const schemaHash = `'sha256-${createHash("sha256").update(schema).digest("base64")}'`;
  return [
    "default-src 'self'",
    `script-src 'self' ${advertisingEnabled ? `'unsafe-inline' 'unsafe-eval' ${adScripts}` : schemaHash} ${metrikaSources} https://yastatic.net`,
    `style-src 'self'${advertisingEnabled ? " 'unsafe-inline' https://yastatic.net https://*.adfox.ru" : ""}`,
    `img-src 'self' data: ${metrikaSources}${advertisingEnabled ? ` ${adResources}` : ""}`,
    `font-src 'self'${advertisingEnabled ? " https://yastatic.net data:" : ""}`,
    `connect-src 'self' blob: ${metrikaSources} ${metrikaSockets}${advertisingEnabled ? ` ${adResources}` : ""}`,
    `frame-src https://yandex.ru blob: ${metrikaSources}${advertisingEnabled ? ` ${adFrames}` : ""}`,
    `child-src blob: ${metrikaSources}${advertisingEnabled ? ` ${adFrames}` : ""}`,
    `media-src 'self'${advertisingEnabled ? ` blob: data: ${adResources}` : ""}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");
}
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);
const outputRoot = new URL("../dist/", import.meta.url);
const config = JSON.parse(await readFile(new URL("../src/data/seo.json", import.meta.url), "utf8"));
const template = (await readFile(new URL("index.html", outputRoot), "utf8"))
  .replace(/<title>[\s\S]*?<\/title>/g, "")
  .replace(/<meta\b[^>]*\b(?:name|property)="(?:description|keywords|robots|og:[^"]+|twitter:[^"]+)"[^>]*>/g, "")
  .replace(/<link\b[^>]*\brel="canonical"[^>]*>/g, "");

// Render the actual Vue views so every entry contains the same readable
// content and links as the interactive app, even without JavaScript.
const server = await createServer({
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
  logLevel: "warn",
});
try {
  const { default: App } = await server.ssrLoadModule("/src/App.vue");
  const { seoPages, getSeoTags, serializeStructuredData } = await server.ssrLoadModule("/src/seo.ts");
  const { site } = await server.ssrLoadModule("/src/data/content.ts");
  const { privacy } = await server.ssrLoadModule("/src/data/privacy.ts");
  const { advertisingEnabled } = await server.ssrLoadModule("/src/config.ts");
  const routes = [];
  for (const page of seoPages) {
    const { default: component } = await server.ssrLoadModule(`/src/views/${page.component}.vue`);
    routes.push({ path: page.path, component, meta: page });
  }
  for (const page of seoPages) {
    const router = createRouter({ history: createMemoryHistory(), routes });
    await router.push(page.path);
    await router.isReady();
    const body = await renderToString(createSSRApp(App).use(router));
    const schema = serializeStructuredData(page.path);
    const tags = getSeoTags(page.path).map((tag) =>
      `<meta ${tag.attribute}="${tag.key}" content="${escapeHtml(tag.content)}" />`,
    );
    const head = [
      `<meta http-equiv="Content-Security-Policy" content="${escapeHtml(contentSecurityPolicy(advertisingEnabled, schema))}" />`,
      `<title>${escapeHtml(page.title)}</title>`,
      ...tags,
      `<link rel="canonical" href="${config.origin}${page.path}" />`,
      `<script id="site-schema" type="application/ld+json">${schema}</script>`,
    ].join("\n    ");
    const document = template
      .replace(/(<meta charset="UTF-8"\s*\/?>)/, (charset) => `${charset}\n    ${head}`)
      .replace('<div id="app"></div>', () => `<div id="app">${body}</div>`);
    const directory = new URL(`.${page.path}`, outputRoot);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL("index.html", directory), document);
  }
  const sitemapEntries = seoPages.map((page) => {
    const lastmod = ["/privacy/", "/consent/"].includes(page.path) ? privacy.updatedAt : site.updatedAt;
    return `  <url><loc>${config.origin}${page.path}</loc><lastmod>${lastmod}</lastmod></url>`;
  });
  await writeFile(new URL("sitemap.xml", outputRoot),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries.join("\n")}\n</urlset>\n`,
  );
  console.log(`Prerendered ${seoPages.length} pages and generated sitemap.xml.`);
} finally {
  await server.close();
}
