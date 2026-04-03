/**
 * generate-icon.js
 *
 * Creates assets/icon.png from assets/artwork.png by:
 *  1. Resizing/cropping the artwork to 1024×1024
 *  2. Overlaying "Musica Qualunque" text with a semi-transparent bar
 *
 * Run once:  node scripts/generate-icon.js
 *
 * Requires sharp:  npm install --save-dev sharp
 */

const sharp = require('sharp');
const path  = require('path');

const INPUT  = path.join(__dirname, '../assets/artwork.png');
const OUTPUT = path.join(__dirname, '../assets/icon.png');
const SIZE   = 1024;

// ── Tweak these values to your taste ─────────────────────────────────────────
const TEXT        = 'Musica Qualunque';
const FONT_SIZE   = 88;          // px
const BAR_OPACITY = 0.55;        // 0 = fully transparent, 1 = fully opaque
const BAR_HEIGHT  = 160;         // px — height of the dark band behind the text
const TEXT_Y      = SIZE - 60;   // baseline of the text from top (puts it near bottom)
// ─────────────────────────────────────────────────────────────────────────────

const barY = SIZE - BAR_HEIGHT;
const barOpacityHex = Math.round(BAR_OPACITY * 255).toString(16).padStart(2, '0');

const svgOverlay = `
<svg width="${SIZE}" height="${SIZE}" xmlns="http://www.w3.org/2000/svg">
  <!-- semi-transparent dark bar -->
  <rect x="0" y="${barY}" width="${SIZE}" height="${BAR_HEIGHT}" fill="#000000${barOpacityHex}"/>
  <!-- text -->
  <text
    x="${SIZE / 2}"
    y="${TEXT_Y}"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="${FONT_SIZE}"
    font-weight="bold"
    fill="#FFFFFF"
    text-anchor="middle"
    letter-spacing="3"
  >${TEXT}</text>
</svg>`;

const STORE_ICON_OUTPUT = path.join(__dirname, '../assets/android-store-icon.png');

async function run() {
  // Generate 1024×1024 app icon
  await sharp(INPUT)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'centre' })
    .composite([{ input: Buffer.from(svgOverlay), blend: 'over' }])
    .png()
    .toFile(OUTPUT);
  console.log(`✓  Icon written to ${OUTPUT}`);

  // Generate 512×512 version for the Google Play Store listing (resize from output)
  await sharp(OUTPUT).resize(512, 512).png().toFile(STORE_ICON_OUTPUT);
  console.log(`✓  Play Store icon written to ${STORE_ICON_OUTPUT} (512×512)`);
}

run().catch(err => {
  if (err.message && err.message.includes("Cannot find module 'sharp'")) {
    console.error('sharp is not installed. Run:  npm install --save-dev sharp');
  } else {
    console.error(err);
  }
  process.exit(1);
});
