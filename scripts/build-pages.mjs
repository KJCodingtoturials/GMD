/**
 * Static page builder — no dependencies, plain Node.
 *
 *   node scripts/build-pages.mjs            → writes the HTML pages to the project root
 *   node scripts/build-pages.mjs --dist     → also assembles a deployable ./dist folder
 *
 * Source of truth lives in /site:
 *   site/config.json            brand, contact details, social links
 *   site/data/cities.json       cities shown on the Cities page, the map and the forms
 *   site/partials/*.html        layout, header, footer, icon sprite (shared by every page)
 *   site/pages/*.html           one file per page: a <!--meta {json} --> block + page content
 *
 * Template syntax
 *   {{key}}            value from config.json or the page's meta block
 *   {{> partial}}      include site/partials/partial.html
 *   {{macro:name}}     generated markup (see MACROS below)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = path.join(ROOT, "site");
const read = (...p) => fs.readFileSync(path.join(...p), "utf8");
const json = (...p) => JSON.parse(read(...p));

const config = json(SITE, "config.json");
config.waUrl = `https://wa.me/${config.waNumber}`;
const cities = json(SITE, "data", "cities.json");

const DEFAULTS = {
  bodyClass: "",
  ogType: "website",
  ogImage: "img/og-cover.jpg",
  ogImageAlt: "Abu Khubaib Yaseen, founder of Growth Matrix Digital",
  head: "",
  breadcrumb: "",
};

/* ------------------------------------------------------------------ helpers */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (p) => (/^https?:/.test(p) ? p : `${config.domain}/${p.replace(/^\//, "")}`);
const canonicalFor = (file) => (file === "index.html" ? `${config.domain}/` : `${config.domain}/${file}`);

/* ------------------------------------------------------------------ macros */
const ICON_ARROW = `<svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg>`;

const MACROS = {
  cityCards: () =>
    cities
      .map(
        (c) => `
      <article class="city-card reveal" id="city-${c.slug}" data-city="${esc(c.name)}" data-search="${esc((c.name + " " + c.region).toLowerCase())}">
        <div class="city-card__top">
          <span class="city-card__region">${esc(c.region)}</span>
          <span class="status"><i aria-hidden="true"></i>Open to applicants</span>
        </div>
        <h3 class="city-card__name">${esc(c.name)}</h3>
        <p class="city-card__text">All six skill programs, delivered online with WhatsApp onboarding.</p>
        <a class="link-arrow" href="youth.html?city=${encodeURIComponent(c.name)}#apply">Apply from ${esc(c.name)} ${ICON_ARROW}</a>
      </article>`
      )
      .join("\n"),

  cityChips: () =>
    cities
      .map((c) => `<a class="chip chip--link" href="youth.html?city=${encodeURIComponent(c.name)}#apply">${esc(c.name)}</a>`)
      .join("\n"),

  cityDatalist: () => cities.map((c) => `<option value="${esc(c.name)}"></option>`).join(""),

  cityCount: () => String(cities.length),

  /** Map-inspired locator: a dotted lat/long field with one node per city. */
  cityMap: () => {
    const W = 360, H = 340;
    const lon0 = 60.5, lon1 = 78.5, lat0 = 23.0, lat1 = 37.5;
    const project = (lat, lon) => ({
      x: 28 + ((lon - lon0) / (lon1 - lon0)) * (W - 56),
      y: 24 + ((lat1 - lat) / (lat1 - lat0)) * (H - 48),
    });
    const nodes = cities
      .map((c) => {
        const { x, y } = project(c.lat, c.lon);
        const left = c.labelSide === "left";
        return `
        <a class="map-node" href="#city-${c.slug}" data-city="${esc(c.name)}" aria-label="${esc(c.name)}, ${esc(c.region)}">
          <circle class="map-node__pulse" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/>
          <circle class="map-node__dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4"/>
          <text class="map-node__label" x="${(x + (left ? -14 : 14)).toFixed(1)}" y="${(y + 4).toFixed(1)}" text-anchor="${left ? "end" : "start"}">${esc(c.name)}</text>
        </a>`;
      })
      .join("");
    return `
      <svg class="city-map" viewBox="0 0 ${W} ${H}" role="group" aria-label="Map-style view of program cities across Pakistan">
        <defs>
          <pattern id="map-dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1.1" fill="currentColor"/></pattern>
          <radialGradient id="map-fade" cx="50%" cy="48%" r="62%"><stop offset="0.35" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient>
          <mask id="map-mask"><rect width="${W}" height="${H}" fill="url(#map-fade)"/></mask>
        </defs>
        <rect class="city-map__field" width="${W}" height="${H}" fill="url(#map-dots)" mask="url(#map-mask)"/>
        ${nodes}
      </svg>`;
  },
};

/* ------------------------------------------------------------------ template engine */
function partial(name) {
  return read(SITE, "partials", `${name}.html`);
}

function render(template, vars, depth = 0) {
  if (depth > 6) throw new Error("Partial include depth exceeded");
  let out = template.replace(/\{\{>\s*([\w-]+)\s*\}\}/g, (_, name) => render(partial(name), vars, depth + 1));
  out = out.replace(/\{\{macro:([\w-]+)\}\}/g, (_, name) => {
    if (!MACROS[name]) throw new Error(`Unknown macro "${name}"`);
    return MACROS[name]();
  });
  out = out.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key) => {
    if (!(key in vars)) throw new Error(`Unknown template variable "${key}"`);
    return vars[key];
  });
  return out;
}

function breadcrumbLd(crumbs) {
  if (!crumbs || crumbs.length < 2) return "";
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map(([name, file], i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      item: canonicalFor(file),
    })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/* ------------------------------------------------------------------ build */
const pagesDir = path.join(SITE, "pages");
const pageFiles = fs.readdirSync(pagesDir).filter((f) => f.endsWith(".html")).sort();
const built = [];

for (const file of pageFiles) {
  const source = read(pagesDir, file);
  const metaMatch = source.match(/^<!--meta\s*([\s\S]*?)-->/);
  if (!metaMatch) throw new Error(`${file}: missing <!--meta {...}--> block`);
  const meta = JSON.parse(metaMatch[1]);
  let body = source.slice(metaMatch[0].length);

  let head = "";
  body = body.replace(/<!--head-->([\s\S]*?)<!--\/head-->/, (_, h) => {
    head = h;
    return "";
  });

  for (const required of ["title", "description", "nav"]) {
    if (!meta[required]) throw new Error(`${file}: meta.${required} is required`);
  }
  if (meta.description.length > 165) console.warn(`! ${file}: description is ${meta.description.length} chars (aim for ≤160)`);

  const vars = {
    ...DEFAULTS,
    ...config,
    ...meta,
    head,
    path: file,
    canonical: canonicalFor(file),
    ogImageAbs: abs(meta.ogImage || DEFAULTS.ogImage),
    breadcrumb: breadcrumbLd(meta.crumbs),
    main: "",
  };
  vars.main = render(body.trim(), vars);
  // `head` can reference variables too.
  vars.head = render(head.trim(), vars);

  let html = render(partial("layout"), vars);
  // Mark the current page in the navigation and strip the helper attribute elsewhere.
  html = html.replace(/ data-nav="([\w-]+)"/g, (_, key) => (key === meta.nav ? ' aria-current="page"' : ""));
  fs.writeFileSync(path.join(ROOT, file), html.replace(/\n{3,}/g, "\n\n"));
  built.push(file);
}

console.log(`✔ Built ${built.length} pages: ${built.join(", ")}`);

/* ------------------------------------------------------------------ sitemap (kept in sync with the pages) */
const today = new Date().toISOString().slice(0, 10);
const priority = { "index.html": "1.0", "agency.html": "0.9", "youth.html": "0.9", "web.html": "0.9", "consultation.html": "0.9", "founder.html": "0.8", "cities.html": "0.7", "smm.html": "0.7" };
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${built
  .map(
    (f) => `  <url>
    <loc>${canonicalFor(f)}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priority[f] || "0.6"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
fs.mkdirSync(path.join(ROOT, "public"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "public", "sitemap.xml"), sitemap);

/* ------------------------------------------------------------------ optional ./dist */
if (process.argv.includes("--dist")) {
  const dist = path.join(ROOT, "dist");
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  for (const f of built) fs.copyFileSync(path.join(ROOT, f), path.join(dist, f));
  for (const dir of ["css", "js", "img"]) fs.cpSync(path.join(ROOT, dir), path.join(dist, dir), { recursive: true });
  fs.cpSync(path.join(ROOT, "public"), dist, { recursive: true }); // robots.txt, sitemap.xml, favicon.svg → site root
  console.log("✔ dist/ is ready to upload to any static host");
}
