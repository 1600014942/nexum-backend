const API = "";
const app = document.getElementById("app");
const navEl = document.getElementById("nav");

function getLocale() {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get("locale");
  if (["en", "zh", "ko"].includes(fromQuery)) {
    localStorage.setItem("nexum_locale", fromQuery);
    return fromQuery;
  }
  return localStorage.getItem("nexum_locale") || "en";
}

function withLocale(path) {
  const locale = getLocale();
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}locale=${encodeURIComponent(locale)}`;
}

async function getJSON(path) {
  const res = await fetch(API + path);
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return await res.json();
}

function segments() {
  return window.location.pathname.replace(/^\//, "").replace(/\/$/, "").split("/").filter(Boolean);
}

function pathSlug() {
  const parts = segments();
  if (!parts.length) return "home";
  if (["access", "request-access"].includes(parts[0])) return "access";
  if (["quote", "request-quote", "rfq"].includes(parts[0])) return "quote";
  if (["supplier", "provider"].includes(parts[0])) return "supplier";
  return parts[0];
}

function money(value, unit) {
  if (value === null || value === undefined) return "Indicative";
  return `$${Number(value).toLocaleString(undefined, { maximumFractionDigits: 6 })}${unit ? ` · ${unit}` : ""}`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function markdownLite(value) {
  const safe = escapeHtml(value || "");
  return safe
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/^[-*] (.*)$/gm, "<li>$1</li>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>")
    .replace(/<p><h/g, "<h")
    .replace(/<\/h([123])><\/p>/g, "</h$1>")
    .replace(/<p><li>/g, "<ul><li>")
    .replace(/<\/li><\/p>/g, "</li></ul>");
}

function card(item) {
  return `<div class="card">
    ${item.number ? `<div class="number">${escapeHtml(item.number)}</div>` : ""}
    ${item.type ? `<div class="type">${escapeHtml(item.type)}</div>` : ""}
    <h3>${escapeHtml(item.title || item.name || "Untitled")}</h3>
    <p>${escapeHtml(item.description || item.detail || item.summary || "")}</p>
  </div>`;
}

async function renderNav() {
  const cfg = await getJSON(withLocale("/api/site/config"));
  const current = pathSlug();
  navEl.innerHTML = cfg.navigation
    .filter(x => x.slug !== "home")
    .map(x => `<a class="${x.slug === current ? "active" : ""}" href="${x.href}">${escapeHtml(x.label)}</a>`)
    .join("");
  const localeEl = document.getElementById("locale-switcher");
  if (localeEl) {
    const currentLocale = getLocale();
    localeEl.innerHTML = cfg.locales.map(l => `<a class="${l === currentLocale ? "active" : ""}" href="${window.location.pathname}?locale=${l}">${l === "en" ? "EN" : l === "zh" ? "中文" : "한국어"}</a>`).join(" ");
  }
}

function hero(page, actions = true) {
  return `<section class="hero">
    <div>
      ${page.hero_kicker ? `<div class="kicker">${escapeHtml(page.hero_kicker)}</div>` : ""}
      <h1>${escapeHtml(page.title)}</h1>
      <p class="subtitle">${escapeHtml(page.subtitle || "")}</p>
      ${actions ? `<div class="ctas"><a class="button" href="/quote">Request Quote</a><a class="button secondary" href="/indices">View Indices</a></div>` : ""}
    </div>
    <div class="panel" id="hero-panel"></div>
  </section>`;
}

async function renderHome() {
  const [page, product, indices] = await Promise.all([
    getJSON(withLocale("/api/pages/home")),
    getJSON("/api/products/featured"),
    getJSON("/api/indices"),
  ]);
  const b = page.body_json || {};
  app.innerHTML = hero(page);
  document.getElementById("hero-panel").innerHTML = `<div class="kicker">Featured Package</div><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.summary || "")}</p><p class="muted">${product.included_input_tokens?.toLocaleString() || ""} input tokens · ${product.included_output_tokens?.toLocaleString() || ""} output tokens · ${product.settlement_currency}</p><a class="button small" href="/product/${product.slug}">View Product</a>`;
  app.insertAdjacentHTML("beforeend", `
    <section class="section grid three">${(b.signal_cards || []).map(card).join("")}</section>
    <section class="section"><h2>${escapeHtml(b.market_gap?.title || "Market Gap")}</h2><p>${escapeHtml(b.market_gap?.description || "")}</p><div class="grid three">${(b.market_gap?.columns || []).map(card).join("")}</div></section>
    <section class="section"><h2>Built in layers</h2><p>Markets do not begin with trading. They begin with standardized objects, reference prices, and quoteable units.</p><div class="grid three">${(b.product_stack || []).map(card).join("")}</div></section>
    <section class="section"><h2>A family of reference layers</h2><div class="grid three">${indices.slice(0,6).map(i => card({ title: i.name, description: `${money(i.latest?.value_usd, i.unit)} · samples ${i.latest?.sample_count || 0}` })).join("")}</div></section>
    <section class="section"><h2>Built for market participants</h2><div class="grid two">${(b.built_for || []).map(card).join("")}</div></section>
    <section class="section panel"><h2>${escapeHtml(b.access?.title || "Request Access")}</h2><p>${escapeHtml(b.access?.description || "")}</p><div class="ctas"><a class="button" href="/access">Request Access</a><a class="button secondary" href="/contact">Talk to Us</a></div></section>
  `);
}

async function renderProduct() {
  const parts = segments();
  const params = new URLSearchParams(window.location.search);
  const slug = parts[1] || params.get("product");
  const [page, product] = await Promise.all([
    getJSON(withLocale("/api/pages/product")),
    slug ? getJSON(`/api/products/${slug}`) : getJSON("/api/products/featured"),
  ]);
  app.innerHTML = hero({ ...page, title: product.name || page.title, subtitle: product.summary || page.subtitle });
  document.getElementById("hero-panel").innerHTML = `<h3>Package Summary</h3><p>Model: ${escapeHtml(product.model_name)}</p><p>Window: ${escapeHtml(product.context_window)}</p><p>Class: ${escapeHtml(product.service_class)}</p><p>Delivery: ${escapeHtml(product.delivery_window)}</p><p class="price">${money(product.indicative_reference_price_usd)}</p><a class="button small" href="/quote?product=${product.slug}">Request Quote</a>`;
  const specs = Object.entries(product.specs_json || {}).map(([k,v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`).join("");
  app.insertAdjacentHTML("beforeend", `
    <section class="section"><h2>Overview</h2><p>${escapeHtml(page.body_json?.overview || product.summary || "")}</p></section>
    <section class="section"><h2>Product Specifications</h2><table>${specs}</table><p>Exclusions: ${(product.exclusions_json || []).map(escapeHtml).join(" · ")}</p></section>
    <section class="section"><h2>Pricing & Settlement</h2><div class="grid two">${(page.body_json?.pricing || []).map(card).join("")}</div></section>
    <section class="section"><h2>Use Cases</h2><div class="grid three">${(product.use_cases_json || []).map(card).join("")}</div></section>
    <section class="section"><h2>How Ordering Works</h2><div class="grid four">${(product.ordering_steps_json || []).map(card).join("")}</div></section>
    <section class="section"><h2>FAQ</h2><div class="grid two">${(product.faq_json || []).map(x => card({ title: x.question, description: x.answer })).join("")}</div></section>
  `);
}

async function renderIndices() {
  const [page, indices] = await Promise.all([getJSON(withLocale("/api/pages/indices")), getJSON("/api/indices")]);
  app.innerHTML = hero(page, false);
  document.getElementById("hero-panel").innerHTML = `<h3>Live reference layer</h3><p>Values below are generated from seeded price observations. Replace demo observations with your internal quote data when deploying.</p>`;
  const rows = indices.map(i => `<tr><td><a href="/indices/${i.symbol}">${escapeHtml(i.symbol)}</a></td><td>${escapeHtml(i.name)}</td><td>${escapeHtml(i.family || "")}</td><td>${money(i.latest?.value_usd, i.unit)}</td><td>${i.latest?.sample_count || 0}</td><td>${i.latest?.confidence_score || ""}</td></tr>`).join("");
  app.insertAdjacentHTML("beforeend", `<section class="section"><h2>A family of reference layers</h2><table><thead><tr><th>Symbol</th><th>Name</th><th>Family</th><th>Latest</th><th>Samples</th><th>Confidence</th></tr></thead><tbody>${rows}</tbody></table></section><section class="section"><h2>Why indices matter</h2><div class="grid three">${(page.body_json?.why_indices_matter || []).map(card).join("")}</div></section>`);
}

async function renderMarkets() {
  const market = await getJSON(withLocale("/api/markets"));
  const page = market.page;
  app.innerHTML = hero(page, false);
  document.getElementById("hero-panel").innerHTML = `<h3>Market progression</h3><p>Reference objects → quoted packages → structured markets.</p>`;
  app.insertAdjacentHTML("beforeend", `<section class="section"><h2>Market Stack</h2><div class="grid three">${(page.body_json?.market_stack || []).map(card).join("")}</div></section><section class="section"><h2>Market Objects</h2><div class="grid two">${(market.objects || []).map(card).join("")}</div></section><section class="section"><h2>Market Participants</h2><div class="grid two">${(market.participants || []).map(card).join("")}</div></section>`);
}

async function renderMethodology() {
  const [page, methodology] = await Promise.all([getJSON(withLocale("/api/pages/methodology")), getJSON("/api/methodology/latest")]);
  app.innerHTML = hero(page, false);
  document.getElementById("hero-panel").innerHTML = `<h3>${escapeHtml(methodology.title)}</h3><p>Version: ${escapeHtml(methodology.version)}</p><p>Effective: ${escapeHtml(methodology.effective_date)}</p>`;
  app.insertAdjacentHTML("beforeend", `<section class="section"><h2>Core Principles</h2><div class="grid two">${(page.body_json?.core_principles || []).map(card).join("")}</div></section><section class="section"><h2>Object Definition Layer</h2><div class="grid three">${(page.body_json?.object_dimensions || []).map(x => card({ title: x, description: "A required dimension for quoteable usage objects." })).join("")}</div></section><section class="section"><h2>Current Methodology</h2><div class="panel markdown">${markdownLite(methodology.content_markdown)}</div></section>`);
}

async function renderDocs() {
  const parts = segments();
  if (parts[1]) return renderDocArticle(parts[1]);
  const [page, docs] = await Promise.all([getJSON(withLocale("/api/pages/docs")), getJSON("/api/docs")]);
  app.innerHTML = hero(page, false);
  document.getElementById("hero-panel").innerHTML = `<h3>Documentation layer</h3><p>${escapeHtml(page.body_json?.cta || "")}</p>`;
  app.insertAdjacentHTML("beforeend", `<section class="section"><h2>Articles</h2><div class="grid two">${docs.map(d => `<a class="card" href="/docs/${d.slug}"><div class="type">${escapeHtml(d.category)}</div><h3>${escapeHtml(d.title)}</h3><p>${escapeHtml(d.summary || "")}</p></a>`).join("")}</div></section>`);
}

async function renderDocArticle(slug) {
  const doc = await getJSON(`/api/docs/${slug}`);
  app.innerHTML = `<section class="hero"><div><div class="kicker">${escapeHtml(doc.category)}</div><h1>${escapeHtml(doc.title)}</h1><p class="subtitle">${escapeHtml(doc.summary || "")}</p><div class="ctas"><a class="button secondary" href="/docs">Back to Docs</a></div></div><div class="panel"><h3>Documentation</h3><p>Slug: ${escapeHtml(doc.slug)}</p></div></section><section class="section"><div class="panel markdown">${markdownLite(doc.content_markdown)}</div></section>`;
}

async function renderContact() {
  const page = await getJSON(withLocale("/api/pages/contact"));
  app.innerHTML = hero(page, false);
  document.getElementById("hero-panel").innerHTML = `<h3>What happens next</h3>${(page.body_json?.next_steps || []).map(x => `<p><strong>${escapeHtml(x.number)}. ${escapeHtml(x.title)}</strong><br>${escapeHtml(x.description)}</p>`).join("")}`;
  app.insertAdjacentHTML("beforeend", `<section class="section"><h2>Send a Message</h2><form class="form" id="contact-form"><input name="email" type="email" placeholder="Email" required><select name="topic"><option value="">Select a topic</option>${(page.body_json?.topics || []).map(t => `<option>${escapeHtml(t)}</option>`).join("")}</select><textarea name="message" placeholder="Message" required></textarea><button class="button" type="submit">Send Message</button><div id="form-result"></div></form></section>`);
  wireForm("contact-form", "/api/contact");
}

async function renderAccess() {
  const page = await getJSON(withLocale("/api/pages/access"));
  app.innerHTML = hero(page, false);
  document.getElementById("hero-panel").innerHTML = `<h3>Access request</h3><p>Use this when you want product access rather than a specific package quote.</p>`;
  app.insertAdjacentHTML("beforeend", `<section class="section"><form class="form" id="access-form"><input name="name" placeholder="Name" required><input name="company_name" placeholder="Company"><input name="email" type="email" placeholder="Email" required><input name="role" placeholder="Role"><select name="interest"><option>Product Access</option><option>Pricing</option><option>Indices</option><option>Markets</option><option>API Integration</option></select><textarea name="message" placeholder="Message"></textarea><button class="button" type="submit">Request Access</button><div id="form-result"></div></form></section>`);
  wireForm("access-form", "/api/access-requests");
}

async function renderQuote() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("product");
  const product = slug ? await getJSON(`/api/products/${slug}`) : await getJSON("/api/products/featured");
  const page = await getJSON(withLocale("/api/pages/quote"));
  app.innerHTML = hero(page, false);
  document.getElementById("hero-panel").innerHTML = `<h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.summary || "")}</p>`;
  app.insertAdjacentHTML("beforeend", `<section class="section"><form class="form" id="rfq-form"><input type="hidden" name="request_type" value="token_package"><input type="hidden" name="product_slug" value="${escapeHtml(product.slug)}"><input name="contact_name" placeholder="Name" required><input name="company_name" placeholder="Company"><input name="contact_email" type="email" placeholder="Email" required><input name="contact_channel" placeholder="Telegram / WhatsApp / WeChat"><input name="model_name" value="${escapeHtml(product.model_name || "")}" placeholder="Model"><input name="package_quantity" type="number" min="1" value="1" placeholder="Package quantity"><input name="input_tokens_per_month" type="number" placeholder="Input tokens per month"><input name="output_tokens_per_month" type="number" placeholder="Output tokens per month"><input name="region" placeholder="Region"><input name="budget_usd" type="number" step="0.01" placeholder="Budget USD"><textarea name="use_case" placeholder="Use case"></textarea><textarea name="notes" placeholder="Additional notes"></textarea><button class="button" type="submit">Submit RFQ</button><div id="form-result"></div></form></section>`);
  wireForm("rfq-form", "/api/rfq", ["package_quantity", "input_tokens_per_month", "output_tokens_per_month", "budget_usd"]);
}

async function renderSupplier() {
  app.innerHTML = `<section class="hero"><div><div class="kicker">Supply</div><h1>Supplier Application</h1><p class="subtitle">Submit GPU, token, API, or cloud supply information. This creates a supplier record and optional quote record.</p></div><div class="panel"><h3>Provider Intake</h3><p>Use this for supply-side onboarding and indicative market observations.</p></div></section><section class="section"><form class="form" id="supplier-form"><input name="supplier_name" placeholder="Supplier / Organization" required><input name="contact_name" placeholder="Contact name" required><input name="contact_email" type="email" placeholder="Email" required><input name="contact_channel" placeholder="Telegram / WhatsApp / WeChat"><input name="country" placeholder="Country"><input name="website" placeholder="Website"><select name="resource_type"><option value="gpu">GPU</option><option value="token">Token</option><option value="api">API</option><option value="cloud">Cloud</option><option value="other">Other</option></select><input name="model_name" placeholder="Model"><input name="gpu_type" placeholder="GPU type"><input name="region" placeholder="Region"><input name="unit" value="USD/hour" placeholder="Unit"><input name="price" type="number" step="0.000001" placeholder="Price"><input name="currency" value="USD" placeholder="Currency"><input name="available_capacity" type="number" step="0.01" placeholder="Available capacity"><input name="minimum_commitment" placeholder="Minimum commitment"><textarea name="notes" placeholder="Notes"></textarea><button class="button" type="submit">Submit Supplier Info</button><div id="form-result"></div></form></section>`;
  wireForm("supplier-form", "/api/supplier/apply", ["price", "available_capacity"]);
}

function wireForm(id, path, numeric = []) {
  const form = document.getElementById(id);
  const result = document.getElementById("form-result");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    Object.keys(data).forEach(k => { if (data[k] === "") data[k] = null; });
    numeric.forEach(k => { if (data[k] !== null && data[k] !== undefined) data[k] = Number(data[k]); });
    try {
      const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.detail || "Submission failed");
      result.className = "notice";
      result.textContent = `Submitted. ID: ${json.id || json.message}`;
      form.reset();
    } catch (err) {
      result.className = "error";
      result.textContent = err.message;
    }
  });
}

async function router() {
  await renderNav();
  const slug = pathSlug();
  try {
    if (slug === "home") return renderHome();
    if (slug === "product") return renderProduct();
    if (slug === "indices") return renderIndices();
    if (slug === "markets") return renderMarkets();
    if (slug === "methodology") return renderMethodology();
    if (slug === "docs") return renderDocs();
    if (slug === "contact") return renderContact();
    if (slug === "access") return renderAccess();
    if (slug === "quote") return renderQuote();
    if (slug === "supplier") return renderSupplier();
    return renderHome();
  } catch (err) {
    app.innerHTML = `<section class="section"><h1>Backend data not ready</h1><p class="error">${escapeHtml(err.message)}</p><p>Run <code>python scripts/seed.py</code>, then refresh.</p></section>`;
  }
}

router();
