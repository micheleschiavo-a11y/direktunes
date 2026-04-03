/**
 * Generates Google Play Store feature graphic (1024×500)
 * Run: node scripts/generate-feature-graphic.js
 * Output: screenshots/android/feature-graphic.png
 *
 * Requires canvas:  npm install --save-dev canvas
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1024;
const H = 500;
const BG = '#0A0A0A';
const ACCENT = '#C8A951';
const WHITE = '#FFFFFF';
const GREY = '#888888';

const OUT_DIR = path.join(__dirname, '..', 'screenshots', 'android');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
}

async function generate(artwork) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  // Subtle gold gradient on left side
  const grad = ctx.createLinearGradient(0, 0, W * 0.55, 0);
  grad.addColorStop(0, 'rgba(200,169,81,0.08)');
  grad.addColorStop(1, 'rgba(200,169,81,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Thin gold horizontal accent line
  ctx.fillStyle = ACCENT;
  ctx.fillRect(54, 100, 48, 4);

  // Artist name
  ctx.font = 'bold 88px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'left';
  ctx.fillText('Miskia', 54, 196);

  // Album title
  ctx.font = '600 42px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('Musica qualunque', 54, 258);

  // Year
  ctx.font = '28px sans-serif';
  ctx.fillStyle = GREY;
  ctx.fillText('2026 · 6 canzoni · 18:23', 54, 304);

  // "Owned outright" pill
  const pillW = 288;
  const pillH = 44;
  const pillX = 54;
  const pillY = 336;
  roundRect(ctx, pillX, pillY, pillW, pillH, 22, 'rgba(200,169,81,0.15)');
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.font = '22px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.textAlign = 'left';
  ctx.fillText('✦  Owned Outright', pillX + 18, pillY + 29);

  // Direktunes label (bottom left)
  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#333333';
  ctx.textAlign = 'left';
  ctx.fillText('DIREKTUNES', 54, H - 30);

  // Artwork (right side, square, vertically centered)
  const artSize = 440;
  const artX = W - artSize - 30;
  const artY = (H - artSize) / 2;
  ctx.save();
  roundRect(ctx, artX, artY, artSize, artSize, 20, null);
  ctx.clip();
  ctx.drawImage(artwork, artX, artY, artSize, artSize);
  ctx.restore();

  // Subtle vignette on the left edge of the artwork to blend with bg
  const vignette = ctx.createLinearGradient(artX - 60, 0, artX + 80, 0);
  vignette.addColorStop(0, BG);
  vignette.addColorStop(1, 'rgba(10,10,10,0)');
  ctx.fillStyle = vignette;
  ctx.fillRect(artX - 60, 0, 140, H);

  const outFile = path.join(OUT_DIR, 'feature-graphic.png');
  fs.writeFileSync(outFile, canvas.toBuffer('image/png'));
  console.log('✓ feature-graphic.png (1024×500)');
}

(async () => {
  try {
    const artworkPath = path.join(__dirname, '..', 'assets', 'artwork.png');
    const artwork = await loadImage(artworkPath);
    await generate(artwork);
    console.log('\nDone! Saved to screenshots/android/feature-graphic.png');
  } catch (err) {
    console.error(err);
  }
})();
