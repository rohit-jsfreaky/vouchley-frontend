/**
 * Generate all favicon assets from a single SVG source.
 *
 * Usage:  node scripts/generate-favicons.mjs
 *
 * Outputs:
 *   app/icon.svg          — SVG favicon (modern browsers)
 *   app/favicon.ico       — classic 48×48 ICO
 *   app/apple-icon.png    — 180×180 Apple touch icon
 *   public/favicon-16x16.png
 *   public/favicon-32x32.png
 *   public/favicon-192x192.png
 *   public/favicon-512x512.png
 *   public/site.webmanifest
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const APP_DIR = join(ROOT, "app");
const PUBLIC_DIR = join(ROOT, "public");

// Brand color from the Vouchley design system
const BRAND_BG = "#8B5E3C";   // warm brown (brand)
const LETTER_COLOR = "#FFFFFF";

// The SVG source: "V" in a rounded square, matching the sidebar logo style
const SVG_SOURCE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="${BRAND_BG}"/>
  <text
    x="256" y="380"
    text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="380"
    font-weight="600"
    fill="${LETTER_COLOR}"
  >V</text>
</svg>`;

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function generatePng(size, outputPath) {
  await sharp(Buffer.from(SVG_SOURCE))
    .resize(size, size)
    .png()
    .toFile(outputPath);
  console.log(`  ✓ ${outputPath} (${size}×${size})`);
}

/**
 * Build a minimal ICO file containing a single 48×48 PNG image.
 * ICO format: 6-byte header + 16-byte directory entry + PNG data.
 */
function buildIco(pngBuffer) {
  const numImages = 1;
  const headerSize = 6;
  const dirEntrySize = 16;
  const dataOffset = headerSize + dirEntrySize * numImages;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0);          // reserved
  header.writeUInt16LE(1, 2);          // type: 1 = ICO
  header.writeUInt16LE(numImages, 4);  // count

  const entry = Buffer.alloc(dirEntrySize);
  entry.writeUInt8(48, 0);                       // width (48; 0 means 256)
  entry.writeUInt8(48, 1);                       // height
  entry.writeUInt8(0, 2);                        // color palette
  entry.writeUInt8(0, 3);                        // reserved
  entry.writeUInt16LE(1, 4);                     // color planes
  entry.writeUInt16LE(32, 6);                    // bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8);      // image size
  entry.writeUInt32LE(dataOffset, 12);           // data offset

  return Buffer.concat([header, entry, pngBuffer]);
}

async function main() {
  console.log("Generating Vouchley favicons...\n");

  await ensureDir(APP_DIR);
  await ensureDir(PUBLIC_DIR);

  // 1. SVG favicon (app/icon.svg — Next.js auto-serves this)
  const svgPath = join(APP_DIR, "icon.svg");
  await writeFile(svgPath, SVG_SOURCE, "utf-8");
  console.log(`  ✓ ${svgPath} (SVG)`);

  // 2. PNG favicons in public/
  await generatePng(16, join(PUBLIC_DIR, "favicon-16x16.png"));
  await generatePng(32, join(PUBLIC_DIR, "favicon-32x32.png"));
  await generatePng(192, join(PUBLIC_DIR, "favicon-192x192.png"));
  await generatePng(512, join(PUBLIC_DIR, "favicon-512x512.png"));

  // 3. Apple touch icon (app/apple-icon.png — Next.js auto-serves)
  await generatePng(180, join(APP_DIR, "apple-icon.png"));

  // 4. ICO (app/favicon.ico — Next.js auto-serves)
  const ico48Png = await sharp(Buffer.from(SVG_SOURCE))
    .resize(48, 48)
    .png()
    .toBuffer();
  const icoBuffer = buildIco(ico48Png);
  const icoPath = join(APP_DIR, "favicon.ico");
  await writeFile(icoPath, icoBuffer);
  console.log(`  ✓ ${icoPath} (48×48 ICO)`);

  // 5. Web manifest
  const manifest = {
    name: "Vouchley",
    short_name: "Vouchley",
    icons: [
      { src: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/favicon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    theme_color: BRAND_BG,
    background_color: "#FAF8F4",
    display: "standalone",
  };
  const manifestPath = join(PUBLIC_DIR, "site.webmanifest");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf-8");
  console.log(`  ✓ ${manifestPath}`);

  console.log("\nDone! Favicons generated successfully.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
