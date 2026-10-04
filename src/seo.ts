import config from "./data/seo.json";

export const seoPages = config.pages;

export function getPageSeo(path: string) {
  const normalized = path === "/" ? "/" : `${path.replace(/\/+$/, "")}/`;
  return seoPages.find((page) => page.path === normalized) ?? seoPages[0]!;
}

export function getSeoTags(path: string) {
  const page = getPageSeo(path);
  return [
    { attribute: "name", key: "description", content: page.description },
    { attribute: "name", key: "keywords", content: page.keywords.join(", ") },
    { attribute: "name", key: "robots", content: "index, follow, max-image-preview:large" },
    { attribute: "property", key: "og:title", content: page.title },
    { attribute: "property", key: "og:description", content: page.description },
    { attribute: "property", key: "og:url", content: `${config.origin}${page.path}` },
    { attribute: "property", key: "og:type", content: "website" },
    { attribute: "property", key: "og:site_name", content: config.name },
    { attribute: "property", key: "og:locale", content: "ru_RU" },
    { attribute: "name", key: "twitter:card", content: "summary" },
    { attribute: "name", key: "twitter:title", content: page.title },
    { attribute: "name", key: "twitter:description", content: page.description },
  ];
}

export function getStructuredData(path: string) {
  const page = getPageSeo(path);
  const url = `${config.origin}${page.path}`;
  const websiteId = `${config.origin}/#website`;
  const graph: Record<string, unknown>[] = [
    {
      "@type": "WebSite",
      "@id": websiteId,
      name: config.name,
      alternateName: config.alternateName,
      url: `${config.origin}/`,
      inLanguage: "ru-RU",
    },
    {
      "@type": page.type,
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: "ru-RU",
      keywords: page.keywords.join(", "),
      isPartOf: { "@id": websiteId },
    },
  ];
  if (page.path !== "/") {
    graph.push({
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: config.name, item: `${config.origin}/` },
        { "@type": "ListItem", position: 2, name: page.title, item: url },
      ],
    });
    graph[1]!.breadcrumb = { "@id": `${url}#breadcrumb` };
  }
  return { "@context": "https://schema.org", "@graph": graph };
}

export function serializeStructuredData(path: string) {
  return JSON.stringify(getStructuredData(path)).replace(/</g, "\\u003c");
}

export function applyPageSeo(path: string) {
  const page = getPageSeo(path);
  document.title = page.title;
  for (const tag of getSeoTags(path)) {
    let element = document.querySelector<HTMLMetaElement>(`meta[${tag.attribute}="${tag.key}"]`);
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(tag.attribute, tag.key);
      document.head.append(element);
    }
    element.content = tag.content;
  }
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.append(canonical);
  }
  canonical.href = `${config.origin}${page.path}`;
  let schema = document.getElementById("site-schema");
  if (!schema) {
    schema = document.createElement("script");
    schema.setAttribute("type", "application/ld+json");
    schema.id = "site-schema";
    document.head.append(schema);
  }
  schema.textContent = serializeStructuredData(path);
}
