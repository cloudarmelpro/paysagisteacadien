/**
 * Génère les images de partage `public/og-{fr,en}.png` (1200×630).
 *
 *   node scripts/og/generate.mjs
 *
 * À relancer si l'accroche du hero change dans les dictionnaires.
 *
 * Visuel de marque et non photo : les photos du site sont des placeholders
 * Unsplash, elles ne représentent pas les chantiers de l'entreprise.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync, mkdtempSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const TMP = mkdtempSync(join(tmpdir(), "og-"));

/** Chrome, par ordre de probabilité selon la plateforme. */
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

const CHROME = CHROME_CANDIDATES.find((p) => {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
});

if (!CHROME) {
  console.error(
    "Chrome introuvable. Définir CHROME_PATH :\n" +
      '  CHROME_PATH="/chemin/vers/chrome" node scripts/og/generate.mjs',
  );
  process.exit(1);
}

// Accroches lues dans les dictionnaires du site : ne pas les recopier ici, l'image
// et la page divergeraient.
const dict = (loc) =>
  JSON.parse(readFileSync(join(ROOT, "src/dictionaries", `${loc}.json`), "utf8"));

const LOCALES = ["fr", "en"].map((code) => {
  const hero = dict(code).hero;
  return { code, lead: hero.titleLead, accent: hero.titleAccent };
});

/**
 * Version inversée du logo (carré blanc, « P » vert) : le logo normal est un carré
 * vert, invisible sur ce fond vert.
 * Les tracés doivent rester identiques à ceux de src/app/icon.svg.
 */
const LOGO = `
<svg viewBox="0 0 100 100" width="92" height="92">
  <path fill="#FFFFFF" d="M20,0 H80 Q100,0 100,20 V80 Q100,100 80,100 H20 Q0,100 0,80 V20 Q0,0 20,0 Z"/>
  <path fill="#396342" fill-rule="evenodd" d="M28,20 H54.4 A17.4,17.4 0 0 1 54.4,54.8 H40 V80 H28 Z M40,32 H54.4 A5.4,5.4 0 0 1 54.4,42.8 H40 Z"/>
</svg>`;

/**
 * DM Sans embarquée en base64 et non chargée depuis Google Fonts : Chrome capture
 * sans attendre les webfonts réseau, la police de repli sortirait sur l'image.
 * Un seul fichier suffit, DM Sans est variable et couvre les graisses 500 et 700.
 */
const FONT_B64 = readFileSync(join(HERE, "dmsans-variable.woff2")).toString("base64");

const html = ({ lead, accent }) => `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  @font-face{font-family:'DM Sans';src:url(data:font/woff2;base64,${FONT_B64}) format('woff2');
             font-weight:100 1000;font-style:normal;font-display:block}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1200px;height:630px;background:#396342;font-family:'DM Sans',sans-serif;
       display:flex;flex-direction:column;justify-content:space-between;
       padding:72px 80px;overflow:hidden;position:relative}
  /* Halo discret : de la profondeur sans trahir la sobriété du site. */
  .glow{position:absolute;right:-160px;top:-160px;width:620px;height:620px;border-radius:50%;
        background:radial-gradient(circle,rgba(255,255,255,.09) 0%,rgba(255,255,255,0) 70%)}
  .top{display:flex;align-items:center;gap:22px;position:relative}
  .word{font-size:27px;font-weight:700;letter-spacing:.19em;color:#fff;text-transform:uppercase}
  .mid{position:relative}
  h1{font-size:64px;font-weight:500;line-height:1.1;letter-spacing:-.02em;color:#fff;max-width:940px}
  h1 .accent{color:#A8D5B5}
  .bottom{display:flex;align-items:center;justify-content:space-between;position:relative}
  .rule{height:2px;width:88px;background:rgba(255,255,255,.45)}
  .url{font-size:23px;font-weight:500;color:rgba(255,255,255,.72);letter-spacing:.02em}
</style></head>
<body>
  <div class="glow"></div>
  <div class="top">${LOGO}<span class="word">Paysagiste Acadien</span></div>
  <div class="mid"><h1>${lead}<br><span class="accent">${accent}</span></h1></div>
  <div class="bottom"><div class="rule"></div><span class="url">paysagisteacadien.com</span></div>
</body></html>`;

for (const loc of LOCALES) {
  const page = join(TMP, `og-${loc.code}.html`);
  const out = join(ROOT, "public", `og-${loc.code}.png`);
  writeFileSync(page, html(loc), "utf8");
  execFileSync(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--force-device-scale-factor=1",
      "--window-size=1200,630",
      `--screenshot=${out}`,
      `file:///${page.replace(/\\/g, "/")}`,
    ],
    { stdio: "ignore" },
  );
  console.log(`généré : public/og-${loc.code}.png (${(statSync(out).size / 1024) | 0} Ko)`);
}
