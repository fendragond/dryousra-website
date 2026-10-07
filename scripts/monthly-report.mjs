#!/usr/bin/env node
/**
 * Monthly SEO report generator — Google Search Console → client PDF + internal MD.
 * Standalone dev tool. Does not modify site source.
 *
 * Usage: node scripts/monthly-report.mjs [--month=YYYY-MM]
 * Default month = previous calendar month.
 */

import { google } from 'googleapis';
import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const REPORTS_DIR = join(ROOT, '_reports');
const TEMPLATE_PATH = join(__dirname, 'report-template.html');
const CREDENTIALS_PATH = join(__dirname, 'gsc-credentials.json');

const SITE_URL = 'https://dryousra.ma/';
const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly';

const BRAND_TOKENS = ['dr yousra', 'yousra', 'el khadri', 'elkhadri', 'dryousra'];

const PRIORITY_BUCKETS = [
  {
    key: 'biostim',
    label: 'Biostimulateurs',
    path: '/soins/stimulation-collagene/',
  },
  {
    key: 'laser',
    label: 'Laser et épilation',
    path: '/soins/laser/',
  },
  {
    key: 'injections',
    label: 'Injections et harmonisation',
    path: '/soins/injections/',
  },
];

const COMMUNICABLE_RE =
  /page|contenu|content|densif|article|blog|maillage|soins|injection|botox|filler|laser|biostim|sculptura|radiesse|harmonyca/i;

const MONTHS_FR = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
];

// ── CLI ──────────────────────────────────────────────────────────────────────

function parseMonthArg() {
  const arg = process.argv.find((a) => a.startsWith('--month='));
  if (arg) {
    const val = arg.slice('--month='.length);
    if (!/^\d{4}-\d{2}$/.test(val)) {
      console.error(`Invalid --month=${val}. Expected YYYY-MM.`);
      process.exit(1);
    }
    return val;
  }
  const now = new Date();
  const prev = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  return `${prev.getUTCFullYear()}-${String(prev.getUTCMonth() + 1).padStart(2, '0')}`;
}

function monthBounds(yyyyMm) {
  const [y, m] = yyyyMm.split('-').map(Number);
  const start = `${yyyyMm}-01`;
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const end = `${yyyyMm}-${String(lastDay).padStart(2, '0')}`;
  return { start, end };
}

function priorMonth(yyyyMm) {
  const [y, m] = yyyyMm.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function periodLabelFr(yyyyMm) {
  const [y, m] = yyyyMm.split('-').map(Number);
  const name = MONTHS_FR[m - 1];
  return `${name.charAt(0).toUpperCase()}${name.slice(1)} ${y}`;
}

/** French month name capitalised, diacritics stripped — for filenames only. */
function monthNameFrFilename(yyyyMm) {
  const m = Number(yyyyMm.split('-')[1]);
  const name = MONTHS_FR[m - 1];
  const capitalised = `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
  return capitalised.normalize('NFD').replace(/\p{M}/gu, '');
}

function clientPdfPresentableName(yyyyMm) {
  const [y] = yyyyMm.split('-');
  return `Rapport-SEO-Dr-Yousra-${monthNameFrFilename(yyyyMm)}-${y}.pdf`;
}

// ── Auth & GSC ───────────────────────────────────────────────────────────────

function loadCredentials() {
  if (process.env.GSC_CREDENTIALS_JSON) {
    return JSON.parse(process.env.GSC_CREDENTIALS_JSON);
  }
  if (!existsSync(CREDENTIALS_PATH)) {
    console.error(
      `Missing credentials. Place service-account JSON at ${CREDENTIALS_PATH}\n` +
        `or set env GSC_CREDENTIALS_JSON.`,
    );
    process.exit(1);
  }
  return JSON.parse(readFileSync(CREDENTIALS_PATH, 'utf8'));
}

async function createSearchConsole() {
  const credentials = loadCredentials();
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: [SCOPE],
  });
  const client = await auth.getClient();
  return google.webmasters({ version: 'v3', auth: client });
}

async function fetchSearchAnalytics(sc, startDate, endDate, dimensions = []) {
  const body = {
    startDate,
    endDate,
    searchType: 'web',
    dimensions,
  };
  if (dimensions.length > 0) {
    body.rowLimit = 25000;
  }
  const res = await sc.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: body,
  });
  return res.data.rows ?? [];
}

// ── Metrics helpers ──────────────────────────────────────────────────────────

function isBrandQuery(query) {
  const q = (query || '').toLowerCase();
  return BRAND_TOKENS.some((t) => q.includes(t));
}

function aggregateGlobal(rows) {
  // No-dimension response: single row with clicks, impressions, ctr, position
  if (rows.length === 0) {
    return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
  }
  const r = rows[0];
  return {
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  };
}

function splitBrand(queryRows) {
  let brandClicks = 0;
  let brandImpressions = 0;
  let nonBrandClicks = 0;
  let nonBrandImpressions = 0;
  let nonBrandPosSum = 0; // impression-weighted
  let brandPosSum = 0;

  for (const row of queryRows) {
    const q = row.keys?.[0] ?? '';
    const clicks = row.clicks ?? 0;
    const impressions = row.impressions ?? 0;
    const position = row.position ?? 0;
    if (isBrandQuery(q)) {
      brandClicks += clicks;
      brandImpressions += impressions;
      brandPosSum += position * impressions;
    } else {
      nonBrandClicks += clicks;
      nonBrandImpressions += impressions;
      nonBrandPosSum += position * impressions;
    }
  }

  return {
    brand: {
      clicks: brandClicks,
      impressions: brandImpressions,
      position: brandImpressions > 0 ? brandPosSum / brandImpressions : 0,
    },
    nonBrand: {
      clicks: nonBrandClicks,
      impressions: nonBrandImpressions,
      position: nonBrandImpressions > 0 ? nonBrandPosSum / nonBrandImpressions : 0,
    },
  };
}

function bucketPages(pageRows) {
  const buckets = {};
  for (const b of PRIORITY_BUCKETS) {
    buckets[b.key] = { clicks: 0, impressions: 0, posSum: 0 };
  }
  for (const row of pageRows) {
    const page = row.keys?.[0] ?? '';
    let path;
    try {
      path = new URL(page).pathname;
    } catch {
      path = page;
    }
    for (const b of PRIORITY_BUCKETS) {
      if (path.includes(b.path) || page.includes(b.path)) {
        const clicks = row.clicks ?? 0;
        const impressions = row.impressions ?? 0;
        const position = row.position ?? 0;
        buckets[b.key].clicks += clicks;
        buckets[b.key].impressions += impressions;
        buckets[b.key].posSum += position * impressions;
      }
    }
  }
  const result = {};
  for (const b of PRIORITY_BUCKETS) {
    const d = buckets[b.key];
    result[b.key] = {
      clicks: d.clicks,
      impressions: d.impressions,
      position: d.impressions > 0 ? d.posSum / d.impressions : 0,
    };
  }
  return result;
}

function trendLabel(curr, prev) {
  const posImproved = prev.position > 0 && curr.position > 0
    && prev.position - curr.position >= 1;
  const posWorsened = prev.position > 0 && curr.position > 0
    && curr.position - prev.position >= 1;
  const clicksUp = curr.clicks > prev.clicks;
  const clicksDown = curr.clicks < prev.clicks;

  if (posImproved || clicksUp) return 'en progression';
  if (posWorsened || clicksDown) return 'en recul';
  return 'stable';
}

function buildMovers(currQueries, prevQueries) {
  const prevMap = new Map();
  for (const row of prevQueries) {
    const q = row.keys?.[0] ?? '';
    if (isBrandQuery(q)) continue;
    prevMap.set(q, row);
  }

  const currMap = new Map();
  for (const row of currQueries) {
    const q = row.keys?.[0] ?? '';
    if (isBrandQuery(q)) continue;
    currMap.set(q, row);
  }

  const entrants = [];
  for (const [q, row] of currMap) {
    const pos = row.position ?? 99;
    if (pos > 10) continue;
    const prev = prevMap.get(q);
    if (!prev || (prev.position ?? 99) > 10) {
      entrants.push({
        query: q,
        impressions: row.impressions ?? 0,
        clicks: row.clicks ?? 0,
        position: pos,
        prevPosition: prev?.position ?? null,
      });
    }
  }
  entrants.sort((a, b) => b.impressions - a.impressions);

  const sortants = [];
  for (const [q, row] of prevMap) {
    const pos = row.position ?? 99;
    if (pos > 10) continue;
    const curr = currMap.get(q);
    if (!curr || (curr.position ?? 99) > 10) {
      sortants.push({
        query: q,
        impressions: row.impressions ?? 0,
        clicks: row.clicks ?? 0,
        position: pos,
        currPosition: curr?.position ?? null,
      });
    }
  }
  sortants.sort((a, b) => b.impressions - a.impressions);

  return {
    entrants: entrants.slice(0, 10),
    sortants: sortants.slice(0, 10),
  };
}

// ── Delta formatting ─────────────────────────────────────────────────────────

function deltaAbsPct(curr, prev) {
  if (prev === 0) {
    return { abs: curr, pct: null, nouveau: true };
  }
  const abs = curr - prev;
  const pct = (abs / prev) * 100;
  return { abs, pct, nouveau: false };
}

function fmtInt(n) {
  return Math.round(n).toLocaleString('fr-FR');
}

function fmtPos(n) {
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function fmtPct(n) {
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} %`;
}

/** KPI delta line for clicks/impressions — absolute only (no %). */
function kpiDeltaHtml(curr, prev) {
  const d = deltaAbsPct(curr, prev);
  if (d.nouveau) {
    return `<div class="delta nouveau">↑ ${fmtInt(curr)} · nouveau</div>`;
  }
  if (d.abs === 0) {
    return `<div class="delta flat">→ stable</div>`;
  }
  const arrow = d.abs > 0 ? '↑' : '↓';
  const cls = d.abs > 0 ? 'up' : 'down';
  const absStr = `${d.abs > 0 ? '+' : ''}${fmtInt(d.abs)}`;
  return `<div class="delta ${cls}">${arrow} ${absStr}</div>`;
}

/** Position delta: lower is better. */
function positionDeltaHtml(curr, prev) {
  if (prev === 0 && curr === 0) {
    return `<div class="delta flat">→ —</div>`;
  }
  if (prev === 0) {
    return `<div class="delta nouveau">${fmtPos(curr)} · nouveau</div>`;
  }
  const gain = prev - curr; // positive = improved
  if (Math.abs(gain) < 0.05) {
    return `<div class="delta flat">→ stable</div>`;
  }
  if (gain > 0) {
    return `<div class="delta up">↑ gain de ${fmtPos(gain)} places</div>`;
  }
  return `<div class="delta down">↓ recul de ${fmtPos(Math.abs(gain))} places</div>`;
}

function trendHtml(label) {
  const map = {
    'en progression': { cls: 'progression', arrow: '↑' },
    'en recul': { cls: 'recul', arrow: '↓' },
    stable: { cls: 'stable', arrow: '→' },
  };
  const t = map[label] ?? map.stable;
  return `<span class="trend ${t.cls}">${t.arrow} ${label}</span>`;
}

// ── Synthesis (client, sober French) ─────────────────────────────────────────

function buildSynthesis(brand, nb, global) {
  const line1 = `Sur cette période, votre site a reçu ${fmtInt(brand.clicks)} visites via des recherches de votre nom et ${fmtInt(nb.clicks)} visites via d'autres recherches.`;
  const line2 = `Il est apparu ${fmtInt(global.impressions)} fois dans les résultats Google.`;
  return `<p>${line1}</p><p>${line2}</p>`;
}

function buildHero(brand, brandPrev, nb, nbPrev) {
  const total = brand.clicks + nb.clicks;
  const totalPrev = brandPrev.clicks + nbPrev.clicks;
  return [
    `<div class="hero-label">Visites totales depuis Google</div>`,
    `<div class="hero-value">${fmtInt(total)}</div>`,
    `<div class="hero-breakdown">dont ${fmtInt(brand.clicks)} via votre nom · ${fmtInt(nb.clicks)} via d'autres recherches</div>`,
    kpiDeltaHtml(total, totalPrev).replace('class="delta ', 'class="hero-delta delta '),
  ].join('\n');
}

// ── Changelog ────────────────────────────────────────────────────────────────

function loadTravaux(yyyyMm) {
  const path = join(REPORTS_DIR, `changelog-${yyyyMm}.md`);
  if (!existsSync(path)) {
    return '<p class="placeholder">Section à compléter.</p>';
  }
  const raw = readFileSync(path, 'utf8').trim();
  if (!raw) {
    return '<p class="placeholder">Section à compléter.</p>';
  }
  const paragraphs = raw.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  const items = [];
  for (const p of paragraphs) {
    const lines = p.split('\n').map((l) => l.trim()).filter(Boolean);
    for (const line of lines) {
      const cleaned = line.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
      if (cleaned) items.push(cleaned);
    }
  }
  if (items.length === 0) {
    return '<p class="placeholder">Section à compléter.</p>';
  }
  return `<ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('\n')}</ul>`;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Commits triage ───────────────────────────────────────────────────────────

function writeCommitsList(yyyyMm, start, end) {
  // --until is exclusive in git; bump end by 1 day
  const [y, m, d] = end.split('-').map(Number);
  const untilDate = new Date(Date.UTC(y, m - 1, d + 1));
  const until = untilDate.toISOString().slice(0, 10);

  let log = '';
  try {
    log = execSync(
      `git log --since=${start} --until=${until} --pretty=format:"%h|%ad|%s" --date=short`,
      { cwd: ROOT, encoding: 'utf8' },
    );
  } catch (err) {
    console.warn('git log failed:', err.message);
  }

  const communicable = [];
  const technique = [];

  for (const line of log.split('\n').filter(Boolean)) {
    const [hash, date, ...rest] = line.split('|');
    const subject = rest.join('|');
    const entry = `- ${hash} (${date}) ${subject}`;
    if (COMMUNICABLE_RE.test(subject)) {
      communicable.push(entry);
    } else {
      technique.push(entry);
    }
  }

  const md = [
    `# Commits — ${yyyyMm}`,
    '',
    '## À communiquer',
    '',
    ...(communicable.length ? communicable : ['- (aucun)']),
    '',
    '## Technique (ne pas transmettre tel quel)',
    '',
    ...(technique.length ? technique : ['- (aucun)']),
    '',
  ].join('\n');

  const outPath = join(REPORTS_DIR, `commits-${yyyyMm}.md`);
  writeFileSync(outPath, md, 'utf8');
  return outPath;
}

// ── Internal Markdown ────────────────────────────────────────────────────────

function fmtDeltaMd(curr, prev) {
  const d = deltaAbsPct(curr, prev);
  if (d.nouveau) return `${fmtInt(curr)} (nouveau)`;
  return `${d.abs >= 0 ? '+' : ''}${fmtInt(d.abs)} (${fmtPct(d.pct)})`;
}

function fmtPosDeltaMd(curr, prev) {
  if (prev === 0) return `${fmtPos(curr)} (nouveau)`;
  const gain = prev - curr;
  if (Math.abs(gain) < 0.05) return 'stable';
  if (gain > 0) return `gain de ${fmtPos(gain)} places`;
  return `recul de ${fmtPos(Math.abs(gain))} places`;
}

function writeInternalMd(yyyyMm, data) {
  const {
    globalCurr, globalPrev,
    brandCurr, brandPrev,
    nbCurr, nbPrev,
    bucketsCurr, bucketsPrev,
    movers,
    period,
    periodPrev,
  } = data;

  const lines = [
    `# Rapport SEO interne — ${period}`,
    '',
    `Période cible : **${yyyyMm}** · Comparaison : **${periodPrev}**`,
    '',
    '> **Note :** Semrush (own-domain) est peu fiable pour ce site. Google Search Console est la source de vérité.',
    '',
    '## Global (Search Console)',
    '',
    '| Métrique | M-1 | M-2 | Δ |',
    '|----------|-----|-----|---|',
    `| Clics (tous) | ${fmtInt(globalCurr.clicks)} | ${fmtInt(globalPrev.clicks)} | ${fmtDeltaMd(globalCurr.clicks, globalPrev.clicks)} |`,
    `| Impressions (tous) | ${fmtInt(globalCurr.impressions)} | ${fmtInt(globalPrev.impressions)} | ${fmtDeltaMd(globalCurr.impressions, globalPrev.impressions)} |`,
    `| CTR (tous) | ${(globalCurr.ctr * 100).toFixed(1)} % | ${(globalPrev.ctr * 100).toFixed(1)} % | — |`,
    `| Position (tous) | ${fmtPos(globalCurr.position)} | ${fmtPos(globalPrev.position)} | ${fmtPosDeltaMd(globalCurr.position, globalPrev.position)} |`,
    '',
    '### Brand vs non-brand (requêtes)',
    '',
    '| Segment | Clics M-1 | Clics M-2 | Δ clics | Impr. M-1 | Impr. M-2 | Δ impr. | Pos. M-1 | Pos. M-2 |',
    '|---------|-----------|-----------|---------|-----------|-----------|---------|----------|----------|',
    `| Brand | ${fmtInt(brandCurr.clicks)} | ${fmtInt(brandPrev.clicks)} | ${fmtDeltaMd(brandCurr.clicks, brandPrev.clicks)} | ${fmtInt(brandCurr.impressions)} | ${fmtInt(brandPrev.impressions)} | ${fmtDeltaMd(brandCurr.impressions, brandPrev.impressions)} | ${fmtPos(brandCurr.position)} | ${fmtPos(brandPrev.position)} |`,
    `| **Non-brand** | **${fmtInt(nbCurr.clicks)}** | **${fmtInt(nbPrev.clicks)}** | **${fmtDeltaMd(nbCurr.clicks, nbPrev.clicks)}** | **${fmtInt(nbCurr.impressions)}** | **${fmtInt(nbPrev.impressions)}** | **${fmtDeltaMd(nbCurr.impressions, nbPrev.impressions)}** | **${fmtPos(nbCurr.position)}** | **${fmtPos(nbPrev.position)}** |`,
    '',
    '## Axes prioritaires',
    '',
    '| Axe | Clics M-1 | Clics M-2 | Pos. pond. M-1 | Pos. pond. M-2 | Tendance |',
    '|-----|-----------|-----------|----------------|----------------|----------|',
  ];

  for (const b of PRIORITY_BUCKETS) {
    const c = bucketsCurr[b.key];
    const p = bucketsPrev[b.key];
    const trend = trendLabel(c, p);
    lines.push(
      `| ${b.label} | ${fmtInt(c.clicks)} | ${fmtInt(p.clicks)} | ${fmtPos(c.position)} | ${fmtPos(p.position)} | ${trend} |`,
    );
  }

  lines.push('', '## Movers non-brand (top 10)', '');
  lines.push('### Entrants (pos ≤ 10 en M-1, > 10 ou absents en M-2)', '');
  if (movers.entrants.length === 0) {
    lines.push('- (aucun)');
  } else {
    for (const e of movers.entrants) {
      const prev = e.prevPosition == null ? 'absent' : fmtPos(e.prevPosition);
      lines.push(
        `- **${e.query}** — pos ${fmtPos(e.position)} (était ${prev}) · ${fmtInt(e.impressions)} impr. · ${fmtInt(e.clicks)} clics`,
      );
    }
  }

  lines.push('', '### Sortants (pos ≤ 10 en M-2, > 10 ou absents en M-1)', '');
  if (movers.sortants.length === 0) {
    lines.push('- (aucun)');
  } else {
    for (const s of movers.sortants) {
      const curr = s.currPosition == null ? 'absent' : fmtPos(s.currPosition);
      lines.push(
        `- **${s.query}** — était pos ${fmtPos(s.position)} (désormais ${curr}) · ${fmtInt(s.impressions)} impr. · ${fmtInt(s.clicks)} clics`,
      );
    }
  }

  lines.push('');
  const outPath = join(REPORTS_DIR, `interne-${yyyyMm}.md`);
  writeFileSync(outPath, lines.join('\n'), 'utf8');
  return outPath;
}

// ── Client PDF ───────────────────────────────────────────────────────────────

function buildKpiCards(brand, brandPrev, nb, nbPrev, global, globalPrev) {
  return [
    `<div class="kpi-card">
      <div class="label">Visites via votre nom (recherches de marque)</div>
      <div class="value">${fmtInt(brand.clicks)}</div>
      ${kpiDeltaHtml(brand.clicks, brandPrev.clicks)}
    </div>`,
    `<div class="kpi-card">
      <div class="label">Visites via d'autres recherches (SEO)</div>
      <div class="value">${fmtInt(nb.clicks)}</div>
      ${kpiDeltaHtml(nb.clicks, nbPrev.clicks)}
    </div>`,
    `<div class="kpi-card">
      <div class="label">Apparitions Google (impressions)</div>
      <div class="value">${fmtInt(global.impressions)}</div>
      ${kpiDeltaHtml(global.impressions, globalPrev.impressions)}
    </div>`,
    `<div class="kpi-card">
      <div class="label">Position moyenne</div>
      <div class="value">${fmtPos(global.position)}</div>
      ${positionDeltaHtml(global.position, globalPrev.position)}
    </div>`,
  ].join('\n');
}

function buildPriorityRows(bucketsCurr, bucketsPrev) {
  return PRIORITY_BUCKETS.map((b) => {
    const trend = trendLabel(bucketsCurr[b.key], bucketsPrev[b.key]);
    return `<div class="priority-row">
      <span class="name">${escapeHtml(b.label)}</span>
      ${trendHtml(trend)}
    </div>`;
  }).join('\n');
}

async function renderPdf(yyyyMm, html) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const presentablePath = join(REPORTS_DIR, clientPdfPresentableName(yyyyMm));
    const technicalPath = join(REPORTS_DIR, `rapport-client-${yyyyMm}.pdf`);

    await page.pdf({
      path: presentablePath,
      format: 'A4',
      printBackground: true,
    });
    // Same bytes under a sortable technical name for archive / CI
    writeFileSync(technicalPath, readFileSync(presentablePath));

    return { presentablePath, technicalPath };
  } finally {
    await browser.close();
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const month = parseMonthArg();
  const prev = priorMonth(month);
  const currBounds = monthBounds(month);
  const prevBounds = monthBounds(prev);
  const period = periodLabelFr(month);
  const periodPrevLabel = periodLabelFr(prev);

  console.log(`Generating SEO report for ${month} (vs ${prev})…`);
  console.log(`GSC property: ${SITE_URL}`);

  mkdirSync(REPORTS_DIR, { recursive: true });

  const sc = await createSearchConsole();

  console.log('Fetching Search Console data…');
  const [
    globalCurrRows,
    globalPrevRows,
    queryCurr,
    queryPrev,
    pageCurr,
    pagePrev,
  ] = await Promise.all([
    fetchSearchAnalytics(sc, currBounds.start, currBounds.end, []),
    fetchSearchAnalytics(sc, prevBounds.start, prevBounds.end, []),
    fetchSearchAnalytics(sc, currBounds.start, currBounds.end, ['query']),
    fetchSearchAnalytics(sc, prevBounds.start, prevBounds.end, ['query']),
    fetchSearchAnalytics(sc, currBounds.start, currBounds.end, ['page']),
    fetchSearchAnalytics(sc, prevBounds.start, prevBounds.end, ['page']),
  ]);

  const globalCurr = aggregateGlobal(globalCurrRows);
  const globalPrev = aggregateGlobal(globalPrevRows);

  const splitCurr = splitBrand(queryCurr);
  const splitPrev = splitBrand(queryPrev);
  const nbCurr = splitCurr.nonBrand;
  const nbPrev = splitPrev.nonBrand;
  const brandCurr = splitCurr.brand;
  const brandPrev = splitPrev.brand;

  const bucketsCurr = bucketPages(pageCurr);
  const bucketsPrev = bucketPages(pagePrev);
  const movers = buildMovers(queryCurr, queryPrev);

  // Commits
  const commitsPath = writeCommitsList(month, currBounds.start, currBounds.end);

  // Internal MD
  const internalPath = writeInternalMd(month, {
    globalCurr,
    globalPrev,
    brandCurr,
    brandPrev,
    nbCurr,
    nbPrev,
    bucketsCurr,
    bucketsPrev,
    movers,
    period,
    periodPrev: periodPrevLabel,
  });

  // Client PDF
  const template = readFileSync(TEMPLATE_PATH, 'utf8');
  const html = template
    .replace('{{PERIOD}}', escapeHtml(period))
    .replace('{{HERO}}', buildHero(brandCurr, brandPrev, nbCurr, nbPrev))
    .replace('{{SYNTHESIS}}', buildSynthesis(brandCurr, nbCurr, globalCurr))
    .replace('{{KPI_CARDS}}', buildKpiCards(brandCurr, brandPrev, nbCurr, nbPrev, globalCurr, globalPrev))
    .replace('{{PRIORITY_ROWS}}', buildPriorityRows(bucketsCurr, bucketsPrev))
    .replace('{{TRAVAUX}}', loadTravaux(month));

  console.log('Rendering client PDF…');
  const { presentablePath, technicalPath } = await renderPdf(month, html);

  console.log('');
  console.log('Outputs:');
  console.log(`  Client PDF (à envoyer) : ${presentablePath}`);
  console.log(`  Client PDF (archive)   : ${technicalPath}`);
  console.log(`  Internal               : ${internalPath}`);
  console.log(`  Commits                : ${commitsPath}`);
}

main().catch((err) => {
  console.error('Report failed:', err.message || err);
  if (err.response?.data) {
    console.error(JSON.stringify(err.response.data, null, 2));
  }
  process.exit(1);
});
