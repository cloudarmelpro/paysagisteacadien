/**
 * Génère toutes les variantes du logo à partir du fichier officiel du client.
 *
 *   node scripts/logo/generate.mjs
 *
 * Source : public/Logo-Officiel.png (logo empilé, « P » vert + mot noir, fond
 * transparent). À relancer si le client fournit un nouveau logo officiel.
 *
 * Produit :
 *   public/logo-lockup.png        logo complet (vert+noir), pied de page clair
 *   public/logo-lockup-white.png  version blanche, pied de page sombre
 *   public/logo-mark.png          « P » seul (vert), en-tête clair + base OG
 *   public/logo-mark-white.png    « P » seul (blanc), en-tête sombre + image OG
 *   public/logo-512.png           « P » vert centré 512×512, logo JSON-LD
 *   src/app/icon.png              favicon (« P » vert, 512×512)
 *
 * Ensuite, régénérer les images de partage : node scripts/og/generate.mjs
 */
import sharp from "sharp";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SRC = join(ROOT, "public", "Logo-Officiel.png");

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const alphaAt = (x, y) => data[(y * W + x) * C + 3];

// Boîte de contenu complète (mark + mot), fond transparent.
let minX = W, minY = H, maxX = 0, maxY = 0;
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++)
    if (alphaAt(x, y) > 20) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
const full = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };

// Bas de la marque = première ligne vide après le début du contenu (la bande
// vide entre le « P » et le mot).
const rowHas = [];
for (let y = 0; y < H; y++) {
  let any = false;
  for (let x = 0; x < W; x++) if (alphaAt(x, y) > 20) { any = true; break; }
  rowHas.push(any);
}
let started = false, markBottom = maxY;
for (let y = minY; y <= maxY; y++) {
  if (rowHas[y]) started = true;
  else if (started) { markBottom = y - 1; break; }
}

// Boîte de la marque seule (au-dessus de la bande vide).
let mx = W, mX = 0, my = H, mY = 0;
for (let y = minY; y <= markBottom; y++)
  for (let x = 0; x < W; x++)
    if (alphaAt(x, y) > 20) {
      if (x < mx) mx = x;
      if (x > mX) mX = x;
      if (y < my) my = y;
      if (y > mY) mY = y;
    }
const mark = { left: mx, top: my, width: mX - mx + 1, height: mY - my + 1 };

/** Silhouette blanche d'une région : l'alpha d'origine sur du blanc plein. */
async function whiteFrom(region, out) {
  const alpha = await sharp(SRC).extract(region).extractChannel("alpha").toBuffer();
  const white = await sharp({
    create: { width: region.width, height: region.height, channels: 3, background: "#ffffff" },
  }).png().toBuffer();
  await sharp(white).joinChannel(alpha).png().toFile(join(ROOT, out));
}

await sharp(SRC).extract(full).toFile(join(ROOT, "public/logo-lockup.png"));
await whiteFrom(full, "public/logo-lockup-white.png");
await sharp(SRC).extract(mark).toFile(join(ROOT, "public/logo-mark.png"));
await whiteFrom(mark, "public/logo-mark-white.png");

// « P » vert centré dans un carré transparent, pour le favicon et le JSON-LD.
const square = (size, pad, out) =>
  sharp(SRC)
    .extract(mark)
    .resize(size - pad * 2, size - pad * 2, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(ROOT, out));

await square(512, 76, "public/logo-512.png");
await square(512, 56, "src/app/icon.png");

console.log("Variantes générées. Pense à régénérer l'OG : node scripts/og/generate.mjs");
console.log("  full:", JSON.stringify(full), "| mark:", JSON.stringify(mark));
