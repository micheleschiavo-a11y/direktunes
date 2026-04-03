const sharp = require('sharp');
const path = require('path');

async function makeLogoWhiteTransparent() {
  const inputPath = path.join(__dirname, '../store/logo.png');
  const outputPath = path.join(__dirname, '../store/logo-white.png');

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  for (let i = 0; i < data.length; i += channels) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const luminance = (r + g + b) / 3;

    // Map luminance to alpha: dark pixels (logo) → opaque, light pixels (bg) → transparent
    // Remap: luminance 200-255 → alpha 0, luminance 0-100 → alpha 255
    const alpha = Math.max(0, Math.min(255, Math.round((200 - luminance) * (255 / 200))));
    data[i] = 255;
    data[i + 1] = 255;
    data[i + 2] = 255;
    data[i + 3] = alpha;
  }

  await sharp(Buffer.from(data), { raw: { width, height, channels } })
    .png()
    .toFile(outputPath);

  console.log('Done: store/logo-white.png');
}

makeLogoWhiteTransparent().catch(console.error);
