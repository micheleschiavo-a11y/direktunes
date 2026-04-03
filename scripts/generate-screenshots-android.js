/**
 * Generates 5 Google Play screenshots (1080×1920 — Android phone 9:16)
 * Run: node scripts/generate-screenshots-android.js
 * Output: screenshots/android/ folder
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1080;
const H = 1920;
const BG = '#0A0A0A';
const ACCENT = '#C8A951';
const WHITE = '#FFFFFF';
const GREY = '#888888';
const DARK_GREY = '#1A1A1A';
const MID_GREY = '#333333';
const LIGHT_GREY = '#CCCCCC';

const OUT_DIR = path.join(__dirname, '..', 'screenshots', 'android');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

function save(canvas, name) {
  const file = path.join(OUT_DIR, name);
  fs.writeFileSync(file, canvas.toBuffer('image/png'));
  console.log('✓', name);
}

// ─── helpers ────────────────────────────────────────────────────────────────

function bg(ctx) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
}

function roundRect(ctx, x, y, w, h, r, fill, stroke, strokeWidth = 2) {
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
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = strokeWidth; ctx.stroke(); }
}

function miniPlayer(ctx) {
  roundRect(ctx, 28, H - 174, W - 56, 72, 14, DARK_GREY, MID_GREY, 1);
  ctx.font = '600 28px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.textAlign = 'left';
  ctx.fillText('♪  E la tristezza', 68, H - 130);
  ctx.font = '600 28px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'right';
  ctx.fillText('⏸', W - 68, H - 130);
}

function navBar(ctx, active) {
  const tabs = ['♪  Album', '◉  Testo', '✎  Note', '✦  Credits'];
  const tabW = W / tabs.length;
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, H - 88, W, 88);
  tabs.forEach((label, i) => {
    const cx = tabW * i + tabW / 2;
    ctx.font = i === active ? 'bold 24px sans-serif' : '24px sans-serif';
    ctx.fillStyle = i === active ? ACCENT : '#555555';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, H - 48);
  });
}

// ─── Screenshot 1: Album Cover + Controls ────────────────────────────────────
async function screenshot1(artwork) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  bg(ctx);

  ctx.font = 'bold 62px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Il tuo album,', W / 2, 136);
  ctx.fillStyle = ACCENT;
  ctx.fillText('sempre con te.', W / 2, 212);

  const artSize = 756;
  const artX = (W - artSize) / 2;
  const artY = 278;
  ctx.save();
  roundRect(ctx, artX, artY, artSize, artSize, 24, null, null);
  ctx.clip();
  ctx.drawImage(artwork, artX, artY, artSize, artSize);
  ctx.restore();
  roundRect(ctx, artX, artY, artSize, artSize, 24, null, '#2A2A2A', 2);

  const infoY = artY + artSize + 48;
  ctx.font = 'bold 54px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Musica qualunque', W / 2, infoY);
  ctx.font = '600 40px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('Miskia', W / 2, infoY + 58);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText('2026', W / 2, infoY + 100);

  const btnY = infoY + 148;
  const btnH = 82;
  const btnW = 454;
  const gap = 20;
  const leftX = (W - (btnW * 2 + gap)) / 2;

  roundRect(ctx, leftX, btnY, btnW, btnH, 14, ACCENT, null);
  ctx.font = 'bold 34px sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText('▶  Play', leftX + btnW / 2, btnY + 52);

  roundRect(ctx, leftX + btnW + gap, btnY, btnW, btnH, 14, DARK_GREY, '#2A2A2A', 2);
  ctx.font = 'bold 34px sans-serif';
  ctx.fillStyle = LIGHT_GREY;
  ctx.textAlign = 'center';
  ctx.fillText('⇌  Shuffle', leftX + btnW + gap + btnW / 2, btnY + 52);

  miniPlayer(ctx);
  navBar(ctx, 0);
  save(canvas, '01_album.png');
}

// ─── Screenshot 2: Track List ─────────────────────────────────────────────────
async function screenshot2(artwork) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  bg(ctx);

  ctx.font = 'bold 60px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('6 canzoni originali', W / 2, 126);
  ctx.font = '38px sans-serif';
  ctx.fillStyle = GREY;
  ctx.fillText('18 minuti di musica', W / 2, 184);

  const thumbSize = 118;
  const thumbX = (W - thumbSize) / 2;
  ctx.save();
  roundRect(ctx, thumbX, 238, thumbSize, thumbSize, 10, null, null);
  ctx.clip();
  ctx.drawImage(artwork, thumbX, 238, thumbSize, thumbSize);
  ctx.restore();

  ctx.font = 'bold 38px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Musica qualunque', W / 2, 410);
  ctx.font = '30px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('Miskia · 2026', W / 2, 452);

  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(28, 486, W - 56, 2);

  const tracks = [
    { n: 1, title: 'E la tristezza', dur: '2:44', active: true },
    { n: 2, title: 'No fèmena', dur: '2:31' },
    { n: 3, title: 'Parlami di te', dur: '2:07' },
    { n: 4, title: 'Parchè ti va', dur: '3:53' },
    { n: 5, title: 'Siamo come navi perse in un fosso', dur: '4:49' },
    { n: 6, title: 'Ti ga visto la luna', dur: '2:19', instrumental: true },
  ];

  let trackY = 500;
  const rowH = 92;
  tracks.forEach((t) => {
    if (t.active) {
      roundRect(ctx, 20, trackY + 4, W - 40, rowH - 8, 10, '#161616', null);
    }
    ctx.font = t.active ? 'bold 30px sans-serif' : '30px sans-serif';
    ctx.fillStyle = t.active ? ACCENT : '#555555';
    ctx.textAlign = 'center';
    ctx.fillText(t.active ? '♪' : String(t.n), 66, trackY + 50);

    ctx.font = t.active ? 'bold 32px sans-serif' : '32px sans-serif';
    ctx.fillStyle = t.active ? ACCENT : LIGHT_GREY;
    ctx.textAlign = 'left';
    const maxTitleWidth = W - 170;
    let title = t.title;
    if (ctx.measureText(title).width > maxTitleWidth) {
      while (ctx.measureText(title + '…').width > maxTitleWidth) title = title.slice(0, -1);
      title += '…';
    }
    ctx.fillText(title, 100, trackY + 46);
    if (t.instrumental) {
      ctx.font = '24px sans-serif';
      ctx.fillStyle = '#555555';
      ctx.fillText('Strumentale', 100, trackY + 76);
    }

    ctx.font = '28px sans-serif';
    ctx.fillStyle = '#555555';
    ctx.textAlign = 'right';
    ctx.fillText(t.dur, W - 40, trackY + 50);

    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(28, trackY + rowH, W - 56, 1);

    trackY += rowH;
  });

  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#444444';
  ctx.textAlign = 'center';
  ctx.fillText('6 canzoni · 18:23', W / 2, trackY + 42);

  miniPlayer(ctx);
  navBar(ctx, 0);
  save(canvas, '02_tracklist.png');
}

// ─── Screenshot 3: Lyrics Screen ─────────────────────────────────────────────
async function screenshot3() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  bg(ctx);

  ctx.font = 'bold 60px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Testi sincronizzati', W / 2, 126);
  ctx.font = '38px sans-serif';
  ctx.fillStyle = GREY;
  ctx.fillText('in tempo reale', W / 2, 182);

  const cx = W / 2;
  const cy = 460;
  const outerR = 218;

  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fillStyle = '#1A1A1A';
  ctx.fill();

  for (let r = outerR - 8; r > 68; r -= 15) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 30 === 0 ? '#2A2A2A' : '#222222';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 76, 0, Math.PI * 2);
  ctx.fillStyle = ACCENT;
  ctx.fill();
  ctx.font = 'bold 24px sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText('MISKIA', cx, cy - 10);
  ctx.font = '18px sans-serif';
  ctx.fillText('Direktunes', cx, cy + 14);

  ctx.beginPath();
  ctx.arc(cx, cy, 12, 0, Math.PI * 2);
  ctx.fillStyle = BG;
  ctx.fill();

  ctx.font = '600 38px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.textAlign = 'center';
  ctx.fillText('E la tristezza', W / 2, 730);

  const lyricsLines = [
    { text: 'Nel silenzio della notte', past: true },
    { text: 'cerco ancora la tua voce', past: true },
    { text: 'ma rimane solo il vento', active: true },
    { text: 'che mi porta via con sé' },
    { text: '' },
    { text: 'E la tristezza che rimane' },
    { text: 'quando tutto se ne va' },
    { text: 'è più forte del dolore' },
    { text: 'di chi non ha più nessuno' },
  ];

  let lyricY = 800;
  lyricsLines.forEach((line) => {
    if (!line.text) { lyricY += 24; return; }
    ctx.font = line.active ? 'bold 44px sans-serif' : '32px sans-serif';
    ctx.fillStyle = line.active ? WHITE : (line.past ? '#333333' : '#555555');
    ctx.textAlign = 'center';
    ctx.fillText(line.text, W / 2, lyricY);
    lyricY += line.active ? 68 : 52;
  });

  miniPlayer(ctx);
  navBar(ctx, 1);
  save(canvas, '03_lyrics.png');
}

// ─── Screenshot 4: Notes Screen ──────────────────────────────────────────────
async function screenshot4() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  bg(ctx);

  ctx.font = 'bold 60px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Le parole', W / 2, 126);
  ctx.fillStyle = ACCENT;
  ctx.fillText("dell'artista.", W / 2, 202);

  ctx.font = 'bold 68px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'left';
  ctx.fillText('Note', 54, 320);
  ctx.fillStyle = ACCENT;
  ctx.fillRect(54, 338, 84, 7);

  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('MUSICA QUALUNQUE', 54, 404);
  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText('Miskia · 2026', 54, 444);

  const bodyText = [
    'Musica Qualunque è il primo Direktunes',
    "album dell'artista Miskia.",
    '',
    'Il titolo dell\'album vuole sottolineare',
    'come le barriere tra generi musicali',
    'diversi siano spesso un ostacolo sia',
    'per i musicisti che per gli ascoltatori.',
    '',
    'In realtà, quando la musica è bella di',
    'solito piace a tutti, ed il genere',
    'musicale di appartenenza diventa',
    'irrilevante.',
    '',
    'Queste canzoni sono il risultato di anni',
    'di ascolto di musica pop spagnola e più',
    'in generale della musica latina.',
  ];

  ctx.font = '35px sans-serif';
  ctx.fillStyle = LIGHT_GREY;
  ctx.textAlign = 'left';
  let textY = 510;
  bodyText.forEach((line) => {
    if (!line) { textY += 26; return; }
    ctx.fillText(line, 54, textY);
    textY += 52;
  });

  miniPlayer(ctx);
  navBar(ctx, 2);
  save(canvas, '04_notes.png');
}

// ─── Screenshot 5: Credits + Ownership Badge ─────────────────────────────────
async function screenshot5() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  bg(ctx);

  ctx.font = 'bold 60px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Tuo per sempre.', W / 2, 126);
  ctx.font = '38px sans-serif';
  ctx.fillStyle = GREY;
  ctx.fillText('Nessun abbonamento.', W / 2, 186);

  ctx.font = 'bold 68px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'left';
  ctx.fillText('Credits', 54, 308);
  ctx.fillStyle = ACCENT;
  ctx.fillRect(54, 328, 84, 7);

  ctx.font = 'bold 32px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('MUSICA QUALUNQUE', 54, 398);
  ctx.font = '28px sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText('Miskia · 2026', 54, 436);

  const bodyLines = [
    '"Todo lo que no es tradición es plagio"',
    "è un aforisma attribuito a Eugenio d'Ors.",
    '',
    'Per ogni canzone, per ogni riff, per ogni',
    'singola nota musicale la lista dei credits',
    'dovrebbe essere lunghissima.',
    '',
    'Se talvolta la tradizione diventa plagio,',
    'me ne scuso con tutti i musicisti da cui',
    "ho rubato delle idee. Ma si sa:",
    'imitation is the highest form of flattery.',
  ];

  ctx.font = '34px sans-serif';
  ctx.fillStyle = LIGHT_GREY;
  ctx.textAlign = 'left';
  let textY = 510;
  bodyLines.forEach((line) => {
    if (!line) { textY += 24; return; }
    ctx.fillText(line, 54, textY);
    textY += 50;
  });

  const badgeX = 54;
  const badgeY = textY + 48;
  const badgeW = W - 108;
  const badgeH = 320;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 28, DARK_GREY, ACCENT, 3);

  ctx.font = '68px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎵', W / 2, badgeY + 92);

  ctx.font = 'bold 44px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.textAlign = 'center';
  ctx.fillText('Album di tua proprietà', W / 2, badgeY + 158);

  ctx.font = '30px sans-serif';
  ctx.fillStyle = GREY;
  ctx.textAlign = 'center';
  ctx.fillText('Acquistato una volta per sempre.', W / 2, badgeY + 204);
  ctx.fillText('Nessuno streaming, nessun abbonamento.', W / 2, badgeY + 242);

  roundRect(ctx, W / 2 - 218, badgeY + 266, 436, 44, 22, null, '#444444', 1);
  ctx.font = '22px sans-serif';
  ctx.fillStyle = '#555555';
  ctx.textAlign = 'center';
  ctx.fillText('DIREKTUNES · OWNED OUTRIGHT', W / 2, badgeY + 295);

  navBar(ctx, 3);
  save(canvas, '05_credits.png');
}

// ─── Main ─────────────────────────────────────────────────────────────────────
(async () => {
  try {
    const artworkPath = path.join(__dirname, '..', 'assets', 'artwork.png');
    const artwork = await loadImage(artworkPath);

    await screenshot1(artwork);
    await screenshot2(artwork);
    await screenshot3();
    await screenshot4();
    await screenshot5();

    console.log('\nDone! Screenshots saved to screenshots/android/');
    console.log('Size: 1080×1920 px (Android phone 9:16)');
  } catch (err) {
    console.error(err);
  }
})();
