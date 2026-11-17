import { formatDate } from './format.js';
import { seriousInPastYear } from './inspections.js';
import { SEVERITY_LABELS, severityLevel } from './severity.js';

// Share cards are drawn on a <canvas> in the browser: no API calls and no image library.
// Colours and fonts come from the design tokens in variables.css.
const WIDTH = 1080;
const HEIGHT = 1350;
const PAD = 88;

const token = (name) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'alphabetic';
  return { canvas, ctx, font: token('font-display') };
}

const toBlob = (canvas) =>
  new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Could not draw the card'))),
      'image/png',
    );
  });

// Draws text wrapped to maxWidth, at most maxLines (the last line gets an ellipsis). Returns
// the y after the last line.
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) line = candidate;
    else {
      lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) {
    let last = shown[maxLines - 1];
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth)
      last = last.slice(0, -1);
    shown[maxLines - 1] = `${last.trimEnd()}…`;
  }
  shown.forEach((text, i) => ctx.fillText(text, x, y + i * lineHeight));
  return y + shown.length * lineHeight;
}

function roundRect(ctx, x, y, w, h, r, fill) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fillStyle = fill;
  ctx.fill();
}

function eyebrow(ctx, font, text, color) {
  ctx.font = `600 30px ${font}`;
  ctx.fillStyle = color;
  ctx.letterSpacing = '4px';
  ctx.fillText(text.toUpperCase(), PAD, PAD + 30);
  ctx.letterSpacing = '0px';
}

function rows(ctx, font, items, top, colors) {
  items.forEach(([label, value], i) => {
    const y = top + i * 92;
    ctx.fillStyle = colors.rule;
    ctx.fillRect(PAD, y, WIDTH - PAD * 2, 2);
    ctx.font = `400 34px ${font}`;
    ctx.fillStyle = colors.label;
    ctx.textAlign = 'left';
    ctx.fillText(label, PAD, y + 58);
    ctx.font = `700 36px ${font}`;
    ctx.fillStyle = colors.value;
    ctx.textAlign = 'right';
    ctx.fillText(value, WIDTH - PAD, y + 58);
    ctx.textAlign = 'left';
  });
}

function footer(ctx, font, right, color) {
  ctx.font = `500 28px ${font}`;
  ctx.fillStyle = color;
  ctx.fillText(window.location.host, PAD, HEIGHT - PAD);
  ctx.textAlign = 'right';
  ctx.fillText(right, WIDTH - PAD, HEIGHT - PAD);
  ctx.textAlign = 'left';
}

const levelColor = (score) => token(`color-severity-${severityLevel(score)}`);
const levelTint = (score) => token(`color-severity-${severityLevel(score)}-tint`);

// Kitchen report card for one restaurant, from data the report page already loaded.
export async function drawKitchenCard({ restaurant, inspections }) {
  const { canvas, ctx, font } = createCanvas();
  const summary = restaurant.summary ?? {};
  const score = summary.severityScore ?? 0;
  const latest = inspections[0];
  const seriousThisYear = seriousInPastYear(inspections);

  const ink = token('color-text-inverse');
  const soft = token('color-text-tertiary');
  roundRect(ctx, 0, 0, WIDTH, HEIGHT, 0, token('color-surface-dark'));
  eyebrow(ctx, font, 'Kitchen report', soft);

  ctx.font = `700 84px ${font}`;
  ctx.fillStyle = ink;
  ctx.letterSpacing = '-2px';
  let y = wrapText(ctx, restaurant.name, PAD, PAD + 150, WIDTH - PAD * 2, 92, 3);
  ctx.letterSpacing = '0px';
  ctx.font = `400 34px ${font}`;
  ctx.fillStyle = soft;
  wrapText(
    ctx,
    [restaurant.address, restaurant.neighborhood].filter(Boolean).join(' · '),
    PAD,
    y + 8,
    WIDTH - PAD * 2,
    44,
    1,
  );

  // Score tile
  y += 70;
  roundRect(ctx, PAD, y, WIDTH - PAD * 2, 230, 36, levelTint(score));
  ctx.fillStyle = levelColor(score);
  ctx.font = `800 150px ${font}`;
  ctx.fillText(String(score), PAD + 48, y + 175);
  const scoreWidth = ctx.measureText(String(score)).width;
  ctx.font = `700 44px ${font}`;
  ctx.fillText(
    score === 0 ? 'Clean' : SEVERITY_LABELS[severityLevel(score)],
    PAD + 80 + scoreWidth,
    y + 120,
  );
  ctx.font = `500 30px ${font}`;
  ctx.fillText('Severity score, 0 is clean', PAD + 80 + scoreWidth, y + 168);

  rows(
    ctx,
    font,
    [
      ['Last inspected', latest ? formatDate(latest.date) : '—'],
      ['Result', summary.lastResult || '—'],
      ['Serious violations, past year', String(seriousThisYear)],
      ['Trend', summary.trajectory ?? 'Not enough history'],
    ],
    y + 290,
    { rule: token('color-text-secondary'), label: soft, value: ink },
  );

  footer(ctx, font, 'Boston inspections, decoded', soft);
  return toBlob(canvas);
}

// "Your year in kitchens" card from GET /api/visits/recap.
export async function drawRecapCard(recap) {
  const { canvas, ctx, font } = createCanvas();
  const ink = token('color-text-inverse');
  roundRect(ctx, 0, 0, WIDTH, HEIGHT, 0, token('color-accent'));
  eyebrow(ctx, font, `Your ${recap.year} in kitchens`, ink);

  ctx.fillStyle = ink;
  ctx.font = `800 300px ${font}`;
  ctx.letterSpacing = '-12px';
  ctx.fillText(String(recap.meals), PAD - 10, PAD + 360);
  ctx.letterSpacing = '0px';
  ctx.font = `600 52px ${font}`;
  const places = `${recap.neighborhoods} neighborhood${recap.neighborhoods === 1 ? '' : 's'}`;
  wrapText(
    ctx,
    `meal${recap.meals === 1 ? '' : 's'} logged across ${places}`,
    PAD,
    PAD + 450,
    WIDTH - PAD * 2,
    64,
    2,
  );

  const pick = (visit, fallback) => (visit ? visit.name : fallback);
  rows(
    ctx,
    font,
    [
      ['Most visited', recap.topNeighborhood ?? '—'],
      ['Safe favorite', pick(recap.safeFavorite, 'Log a 4★ visit')],
      ['Guilty pleasure', pick(recap.guiltyPleasure, 'None. Nice.')],
      ['Clean kitchens', `${recap.cleanShare}% of meals`],
    ].map(([label, value]) => [label, value.length > 26 ? `${value.slice(0, 25)}…` : value]),
    PAD + 620,
    { rule: ink, label: ink, value: ink },
  );

  footer(ctx, font, 'Make yours: Back of House', ink);
  return toBlob(canvas);
}
