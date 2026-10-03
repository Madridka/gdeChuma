import { build } from "vite";
import { readFile, writeFile } from "node:fs/promises";

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
await writeFile(
  output,
  html.replace(
    "<head>",
    `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`,
  ),
);
