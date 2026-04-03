/**
 * Generates 5 App Store screenshots (1284×2778 — iPhone 6.7")
 * Run: node scripts/generate-screenshots.js
 * Output: screenshots/ folder
 */

const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const W = 1284;
const H = 2778;
const BG = '#0A0A0A';
const ACCENT = '#C8A951';
const WHITE = '#FFFFFF';
const GREY = '#888888';
const DARK_GREY = '#1A1A1A';
const MID_GREY = '#333333';
const LIGHT_GREY = '#CCCCCC';

const OUT_DIR = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

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

function caption(ctx, text, y) {
  ctx.font = 'bold 56px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, y);
}

function subCaption(ctx, text, y) {
  ctx.font = '40px sans-serif';
  ctx.fillStyle = GREY;
  ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, y);
}

function miniPlayer(ctx) {
  // mini player bar at bottom
  roundRect(ctx, 32, H - 200, W - 64, 84, 16, DARK_GREY, MID_GREY, 1);
  ctx.font = '600 32px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.textAlign = 'left';
  ctx.fillText('♪  E la tristezza', 80, H - 148);
  ctx.font = '600 32px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'right';
  ctx.fillText('⏸', W - 80, H - 148);
}

function navBar(ctx, active) {
  const tabs = ['♪  Album', '◉  Testo', '✎  Note', '✦  Credits'];
  const tabW = W / tabs.length;
  ctx.fillStyle = '#111111';
  ctx.fillRect(0, H - 100, W, 100);
  tabs.forEach((label, i) => {
    const cx = tabW * i + tabW / 2;
    ctx.font = i === active ? 'bold 28px sans-serif' : '28px sans-serif';
    ctx.fillStyle = i === active ? ACCENT : '#555555';
    ctx.textAlign = 'center';
    ctx.fillText(label, cx, H - 56);
  });
}

// ─── Screenshot 1: Album Cover + Controls ────────────────────────────────────
async function screenshot1(artwork) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  bg(ctx);

  // top caption
  ctx.font = 'bold 72px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Il tuo album,', W / 2, 160);
  ctx.fillStyle = ACCENT;
  ctx.fillText('sempre con te.', W / 2, 250);

  // artwork
  const artSize = 900;
  const artX = (W - artSize) / 2;
  const artY = 320;
  ctx.save();
  roundRect(ctx, artX, artY, artSize, artSize, 28, null, null);
  ctx.clip();
  ctx.drawImage(artwork, artX, artY, artSize, artSize);
  ctx.restore();
  // shadow suggestion — border
  roundRect(ctx, artX, artY, artSize, artSize, 28, null, '#2A2A2A', 2);

  // album info
  const infoY = artY + artSize + 60;
  ctx.font = 'bold 64px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Musica qualunque', W / 2, infoY);
  ctx.font = '600 48px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('Miskia', W / 2, infoY + 70);
  ctx.font = '36px sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText('2026', W / 2, infoY + 120);

  // Play + Shuffle buttons
  const btnY = infoY + 180;
  const btnH = 100;
  const btnW = 540;
  const gap = 24;
  const leftX = (W - (btnW * 2 + gap)) / 2;

  // Play
  roundRect(ctx, leftX, btnY, btnW, btnH, 16, ACCENT, null);
  ctx.font = 'bold 40px sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText('▶  Play', leftX + btnW / 2, btnY + 62);

  // Shuffle
  roundRect(ctx, leftX + btnW + gap, btnY, btnW, btnH, 16, DARK_GREY, '#2A2A2A', 2);
  ctx.font = 'bold 40px sans-serif';
  ctx.fillStyle = LIGHT_GREY;
  ctx.textAlign = 'center';
  ctx.fillText('⇌  Shuffle', leftX + btnW + gap + btnW / 2, btnY + 62);

  miniPlayer(ctx);
  navBar(ctx, 0);
  save(canvas, '01_album.png');
}

// ─── Screenshot 2: Track List ─────────────────────────────────────────────────
async function screenshot2(artwork) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  bg(ctx);

  // top caption
  ctx.font = 'bold 72px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('6 canzoni originali', W / 2, 150);
  ctx.font = '44px sans-serif';
  ctx.fillStyle = GREY;
  ctx.fillText('18 minuti di musica', W / 2, 220);

  // small artwork + album title header
  const thumbSize = 140;
  const thumbX = (W - thumbSize) / 2;
  ctx.save();
  roundRect(ctx, thumbX, 290, thumbSize, thumbSize, 12, null, null);
  ctx.clip();
  ctx.drawImage(artwork, thumbX, 290, thumbSize, thumbSize);
  ctx.restore();

  ctx.font = 'bold 44px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Musica qualunque', W / 2, 490);
  ctx.font = '36px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('Miskia · 2026', W / 2, 540);

  // divider
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(32, 580, W - 64, 2);

  // tracks
  const tracks = [
    { n: 1, title: 'E la tristezza', dur: '2:44', active: true },
    { n: 2, title: 'No fèmena', dur: '2:31', active: false },
    { n: 3, title: 'Parlami di te', dur: '2:07', active: false },
    { n: 4, title: 'Parchè ti va', dur: '3:53', active: false },
    { n: 5, title: 'Siamo come navi perse in un fosso', dur: '4:49', active: false },
    { n: 6, title: 'Ti ga visto la luna', dur: '2:19', active: false, instrumental: true },
  ];

  let trackY = 600;
  const rowH = 110;
  tracks.forEach((t) => {
    if (t.active) {
      roundRect(ctx, 24, trackY + 4, W - 48, rowH - 8, 12, '#161616', null);
    }
    // number
    ctx.font = t.active ? 'bold 36px sans-serif' : '36px sans-serif';
    ctx.fillStyle = t.active ? ACCENT : '#555555';
    ctx.textAlign = 'center';
    ctx.fillText(t.active ? '♪' : String(t.n), 80, trackY + 60);

    // title
    ctx.font = t.active ? 'bold 38px sans-serif' : '38px sans-serif';
    ctx.fillStyle = t.active ? ACCENT : LIGHT_GREY;
    ctx.textAlign = 'left';
    const maxTitleWidth = W - 200;
    let title = t.title;
    if (ctx.measureText(title).width > maxTitleWidth) {
      while (ctx.measureText(title + '…').width > maxTitleWidth) title = title.slice(0, -1);
      title += '…';
    }
    ctx.fillText(title, 120, trackY + 56);
    if (t.instrumental) {
      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#555555';
      ctx.fillText('Strumentale', 120, trackY + 90);
    }

    // duration
    ctx.font = '34px sans-serif';
    ctx.fillStyle = '#555555';
    ctx.textAlign = 'right';
    ctx.fillText(t.dur, W - 48, trackY + 60);

    // bottom border
    ctx.fillStyle = '#1A1A1A';
    ctx.fillRect(32, trackY + rowH, W - 64, 1);

    trackY += rowH;
  });

  // summary
  ctx.font = '32px sans-serif';
  ctx.fillStyle = '#444444';
  ctx.textAlign = 'center';
  ctx.fillText('6 canzoni · 18:23', W / 2, trackY + 50);

  miniPlayer(ctx);
  navBar(ctx, 0);
  save(canvas, '02_tracklist.png');
}

// ─── Screenshot 3: Lyrics Screen ─────────────────────────────────────────────
async function screenshot3() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  bg(ctx);

  // caption
  ctx.font = 'bold 72px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Testi sincronizzati', W / 2, 150);
  ctx.font = '44px sans-serif';
  ctx.fillStyle = GREY;
  ctx.fillText('in tempo reale', W / 2, 215);

  // vinyl record (concentric circles)
  const cx = W / 2;
  const cy = 550;
  const outerR = 260;

  // outer disc
  ctx.beginPath();
  ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
  ctx.fillStyle = '#1A1A1A';
  ctx.fill();

  // grooves
  for (let r = outerR - 10; r > 80; r -= 18) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = r % 36 === 0 ? '#2A2A2A' : '#222222';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // label (center disc)
  ctx.beginPath();
  ctx.arc(cx, cy, 90, 0, Math.PI * 2);
  ctx.fillStyle = ACCENT;
  ctx.fill();
  ctx.font = 'bold 28px sans-serif';
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.fillText('MISKIA', cx, cy - 12);
  ctx.font = '22px sans-serif';
  ctx.fillText('Direktunes', cx, cy + 18);

  // center hole
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = BG;
  ctx.fill();

  // track name
  ctx.font = '600 44px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.textAlign = 'center';
  ctx.fillText('E la tristezza', W / 2, 870);

  // lyrics lines
  const lyricsLines = [
    { text: 'Nel silenzio della notte', active: false, past: true },
    { text: 'cerco ancora la tua voce', active: false, past: true },
    { text: 'ma rimane solo il vento', active: true, past: false },
    { text: 'che mi porta via con sé', active: false, past: false },
    { text: '', active: false, past: false },
    { text: 'E la tristezza che rimane', active: false, past: false },
    { text: 'quando tutto se ne va', active: false, past: false },
    { text: 'è più forte del dolore', active: false, past: false },
    { text: 'di chi non ha più nessuno', active: false, past: false },
  ];

  let lyricY = 960;
  lyricsLines.forEach((line) => {
    if (!line.text) { lyricY += 28; return; }
    ctx.font = line.active ? 'bold 52px sans-serif' : '38px sans-serif';
    ctx.fillStyle = line.active ? WHITE : (line.past ? '#333333' : '#555555');
    ctx.textAlign = 'center';
    ctx.fillText(line.text, W / 2, lyricY);
    lyricY += line.active ? 80 : 62;
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

  // caption
  ctx.font = 'bold 72px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Le parole', W / 2, 150);
  ctx.fillStyle = ACCENT;
  ctx.fillText("dell'artista.", W / 2, 240);

  // heading
  ctx.font = 'bold 80px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'left';
  ctx.fillText('Note', 64, 380);
  // accent bar
  ctx.fillStyle = ACCENT;
  ctx.fillRect(64, 400, 100, 8);

  // album label
  ctx.font = 'bold 38px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('MUSICA QUALUNQUE', 64, 480);
  ctx.font = '34px sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText('Miskia · 2026', 64, 530);

  // body text (wrapped)
  const bodyText = [
    'Musica Qualunque è il primo Direktunes',
    'album dell\'artista Miskia.',
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

  ctx.font = '42px sans-serif';
  ctx.fillStyle = LIGHT_GREY;
  ctx.textAlign = 'left';
  let textY = 610;
  bodyText.forEach((line) => {
    if (!line) { textY += 32; return; }
    ctx.fillText(line, 64, textY);
    textY += 62;
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

  // caption
  ctx.font = 'bold 72px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'center';
  ctx.fillText('Tuo per sempre.', W / 2, 150);
  ctx.font = '44px sans-serif';
  ctx.fillStyle = GREY;
  ctx.fillText('Nessun abbonamento.', W / 2, 220);

  // heading
  ctx.font = 'bold 80px sans-serif';
  ctx.fillStyle = WHITE;
  ctx.textAlign = 'left';
  ctx.fillText('Credits', 64, 370);
  ctx.fillStyle = ACCENT;
  ctx.fillRect(64, 392, 100, 8);

  ctx.font = 'bold 38px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.fillText('MUSICA QUALUNQUE', 64, 472);
  ctx.font = '34px sans-serif';
  ctx.fillStyle = '#555555';
  ctx.fillText('Miskia · 2026', 64, 522);

  // body excerpt
  const bodyLines = [
    '"Todo lo que no es tradición es plagio"',
    'è un aforisma attribuito a Eugenio d\'Ors.',
    '',
    'Per ogni canzone, per ogni riff, per ogni',
    'singola nota musicale la lista dei credits',
    'dovrebbe essere lunghissima.',
    '',
    'Se talvolta la tradizione diventa plagio,',
    'me ne scuso con tutti i musicisti da cui',
    'ho rubato delle idee. Ma si sa:',
    'imitation is the highest form of flattery.',
  ];

  ctx.font = '40px sans-serif';
  ctx.fillStyle = LIGHT_GREY;
  ctx.textAlign = 'left';
  let textY = 610;
  bodyLines.forEach((line) => {
    if (!line) { textY += 28; return; }
    ctx.fillText(line, 64, textY);
    textY += 58;
  });

  // ownership badge
  const badgeX = 64;
  const badgeY = textY + 60;
  const badgeW = W - 128;
  const badgeH = 380;
  roundRect(ctx, badgeX, badgeY, badgeW, badgeH, 32, DARK_GREY, ACCENT, 3);

  ctx.font = '80px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🎵', W / 2, badgeY + 110);

  ctx.font = 'bold 52px sans-serif';
  ctx.fillStyle = ACCENT;
  ctx.textAlign = 'center';
  ctx.fillText('Album di tua proprietà', W / 2, badgeY + 185);

  ctx.font = '36px sans-serif';
  ctx.fillStyle = GREY;
  ctx.textAlign = 'center';
  ctx.fillText('Acquistato una volta per sempre.', W / 2, badgeY + 242);
  ctx.fillText('Nessuno streaming, nessun abbonamento.', W / 2, badgeY + 286);

  // seal
  roundRect(ctx, W / 2 - 260, badgeY + 316, 520, 52, 26, null, '#444444', 1);
  ctx.font = '26px sans-serif';
  ctx.fillStyle = '#555555';
  ctx.textAlign = 'center';
  ctx.fillText('DIREKTUNES · OWNED OUTRIGHT', W / 2, badgeY + 350);

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

    console.log('\nDone! Screenshots saved to screenshots/');
    console.log('Size: 1284×2778 px (iPhone 6.7")');
  } catch (err) {
    console.error(err);
  }
})();
