/**
 * Generate every favicon + app-icon from the Vouchley brand mark.
 *
 * Source: public/revlio_logo.png  (2048×2048, transparent blue mark)
 * Usage:  node scripts/generate-favicons.mjs
 *
 * Outputs:
 *   app/icon.png          — modern browsers (transparent)
 *   app/favicon.ico       — classic 48×48 ICO
 *   app/apple-icon.png    — 180×180, mark centered on white (iOS has no alpha)
 *   public/favicon-16x16.png / -32x32 / -192x192 / -512x512   (transparent)
 *   public/logo-mark.png  — 256×256 optimized copy for the UI (nav/sidebar/footer)
 *   public/site.webmanifest
 *
 * Also removes the old app/icon.svg (the previous brown "V") so it stops
 * overriding the new PNG icon.
 */

import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APP_DIR = join(ROOT, "app");
const PUBLIC_DIR = join(ROOT, "public");
const SOURCE = join(PUBLIC_DIR, "revlio_logo.png");

// Brand — RoyalBlue Mercury theme.
const THEME_COLOR = "#3D5AFE";
const BACKGROUND_COLOR = "#FFFFFF";
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function png(size, outputPath, opts = {}) {
  let img = sharp(SOURCE).resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } });
  if (opts.flattenWhite) img = img.flatten({ background: WHITE });
  await img.png({ compressionLevel: 9 }).toFile(outputPath);
  console.log(`  ✓ ${outputPath} (${size}×${size})`);
}

/** Minimal single-image ICO wrapping a 48×48 PNG. */
function buildIco(pngBuffer) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(1, 4); // image count

  const entry = Buffer.alloc(16);
  entry.writeUInt8(48, 0); // width
  entry.writeUInt8(48, 1); // height
  entry.writeUInt8(0, 2); // palette
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(22, 12); // offset (6 + 16)

  return Buffer.concat([header, entry, pngBuffer]);
}

async function main() {
  console.log("Generating Vouchley favicons from the brand mark...\n");
  await ensureDir(APP_DIR);
  await ensureDir(PUBLIC_DIR);

  // Retire the old brown-"V" SVG icon so it no longer overrides the PNG.
  await rm(join(APP_DIR, "icon.svg"), { force: true });

  // App icon (transparent mark) — Next.js auto-serves app/icon.png.
  await png(512, join(APP_DIR, "icon.png"));

  // Public PNG favicons (transparent).
  await png(16, join(PUBLIC_DIR, "favicon-16x16.png"));
  await png(32, join(PUBLIC_DIR, "favicon-32x32.png"));
  await png(192, join(PUBLIC_DIR, "favicon-192x192.png"));
  await png(512, join(PUBLIC_DIR, "favicon-512x512.png"));

  // Optimized copy for the UI (nav / sidebar / footer).
  await png(256, join(PUBLIC_DIR, "logo-mark.png"));

  // Apple touch icon — iOS strips alpha, so composite the mark (with padding)
  // onto a white square.
  const mark = await sharp(SOURCE).resize(150, 150).png().toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: WHITE } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(join(APP_DIR, "apple-icon.png"));
  console.log(`  ✓ ${join(APP_DIR, "apple-icon.png")} (180×180 on white)`);

  // ICO (app/favicon.ico) — transparent 48×48 mark.
  const ico48 = await sharp(SOURCE).resize(48, 48).png().toBuffer();
  await writeFile(join(APP_DIR, "favicon.ico"), buildIco(ico48));
  console.log(`  ✓ ${join(APP_DIR, "favicon.ico")} (48×48 ICO)`);

  // Web manifest.
  const manifest = {
    name: "Vouchley",
    short_name: "Vouchley",
    icons: [
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: THEME_COLOR,
    background_color: BACKGROUND_COLOR,
    display: "standalone",
  };
  await writeFile(join(PUBLIC_DIR, "site.webmanifest"), JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`  ✓ ${join(PUBLIC_DIR, "site.webmanifest")}`);

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
