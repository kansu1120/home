#!/usr/bin/env node
// build_index.js
// Recursively scan `all/` and `library/` for Markdown files and generate `library/search_index.json`.

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const removeMd = require('remove-markdown');

const ROOT = process.cwd();
const roots = [path.join(ROOT, 'all'), path.join(ROOT, 'library')];
const outFile = path.join(ROOT, 'library', 'search_index.json');

// Config
const MAX_CONTENT_CHARS = 4000;
const EXCLUDE_FILENAMES_STARTING_WITH = ['_'];
const EXCLUDE_DIR_NAMES = ['.git', 'node_modules'];

function isExcludedPath(p) {
  const parts = p.split(path.sep);
  if (parts.some(part => EXCLUDE_DIR_NAMES.includes(part))) return true;
  const base = path.basename(p);
  if (EXCLUDE_FILENAMES_STARTING_WITH.some(pref => base.startsWith(pref))) return true;
  return false;
}

function walkDir(dir, cb) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (isExcludedPath(p)) continue;
    if (e.isDirectory()) {
      walkDir(p, cb);
    } else if (e.isFile()) {
      cb(p);
    }
  }
}

function firstH1(md) {
  const m = md.match(/^\s*#\s+(.+)$/m);
  return m ? m[1].trim() : null;
}

function normalizeUrl(u) {
  if (!u) return u;
  if (!u.startsWith('/')) u = '/' + u;
  return u.replace(/\/+/g, '/');
}

function normalizeText(text) {
  if (!text) return '';
  
  // Convert to lowercase first
  text = text.toLowerCase();
  
  // Normalize full-width alphanumeric and symbols to half-width
  text = text.replace(/[Ａ-Ｚａ-ｚ０-９]/g, s => {
    return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
  });
  
  // Normalize hiragana to katakana for kana-insensitive search
  text = text.replace(/[\u3041-\u3096]/g, s => {
    return String.fromCharCode(s.charCodeAt(0) + 0x60);
  });
  
  // Normalize half-width katakana to full-width katakana
  const halfToFull = {
    'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
    'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
    'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
    'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
    'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
    'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
    'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
    'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
    'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
    'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
    'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
    'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
    'ｰ': 'ー', '｡': '。', '｢': '「', '｣': '」', '､': '、', '･': '・'
  };
  
  // Handle voiced marks (dakuten/handakuten)
  text = text.replace(/ｶﾞ/g, 'ガ').replace(/ｷﾞ/g, 'ギ').replace(/ｸﾞ/g, 'グ').replace(/ｹﾞ/g, 'ゲ').replace(/ｺﾞ/g, 'ゴ');
  text = text.replace(/ｻﾞ/g, 'ザ').replace(/ｼﾞ/g, 'ジ').replace(/ｽﾞ/g, 'ズ').replace(/ｾﾞ/g, 'ゼ').replace(/ｿﾞ/g, 'ゾ');
  text = text.replace(/ﾀﾞ/g, 'ダ').replace(/ﾁﾞ/g, 'ヂ').replace(/ﾂﾞ/g, 'ヅ').replace(/ﾃﾞ/g, 'デ').replace(/ﾄﾞ/g, 'ド');
  text = text.replace(/ﾊﾞ/g, 'バ').replace(/ﾋﾞ/g, 'ビ').replace(/ﾌﾞ/g, 'ブ').replace(/ﾍﾞ/g, 'ベ').replace(/ﾎﾞ/g, 'ボ');
  text = text.replace(/ﾊﾟ/g, 'パ').replace(/ﾋﾟ/g, 'ピ').replace(/ﾌﾟ/g, 'プ').replace(/ﾍﾟ/g, 'ペ').replace(/ﾎﾟ/g, 'ポ');
  text = text.replace(/ｳﾞ/g, 'ヴ');
  
  // Replace remaining half-width katakana
  text = text.replace(/[ｱ-ﾝｧ-ｮｰ｡｢｣､･]/g, s => halfToFull[s] || s);
  
  return text;
}

const entries = [];

for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  walkDir(root, filePath => {
    if (!filePath.toLowerCase().endsWith('.md')) return;
    if (path.basename(filePath) === 'search_index.json') return;

    let raw;
    try {
      raw = fs.readFileSync(filePath, 'utf8');
    } catch (e) {
      console.warn('Could not read:', filePath, e);
      return;
    }

    let fm = {};
    let body = raw;
    try {
      const parsed = matter(raw);
      fm = parsed.data || {};
      body = parsed.content || '';
    } catch (e) {
      // fallback to raw
    }

    if (fm.draft === true) return;

    const title = (fm.title && String(fm.title).trim()) || firstH1(body) || path.basename(filePath, '.md');

    let url;
    if (fm.permalink) {
      url = normalizeUrl(String(fm.permalink));
    } else if (fm.url) {
      url = normalizeUrl(String(fm.url));
    } else {
      const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
      let urlPath = '/' + rel.replace(/\.md$/i, '');
      if (urlPath.endsWith('/index')) urlPath = urlPath.replace(/\/index$/, '/');
      url = normalizeUrl('/library' + urlPath);
    }

    let content = removeMd(body || '');
    content = content.replace(/\s+/g, ' ').trim();
    if (content.length > MAX_CONTENT_CHARS) content = content.slice(0, MAX_CONTENT_CHARS);

    // Add normalized versions for search
    const title_normalized = normalizeText(title);
    const content_normalized = normalizeText(content);

    entries.push({ title, url, content, title_normalized, content_normalized });
  });
}

// Deduplicate by URL, keep first occurrence
const seen = new Set();
const uniq = [];
for (const e of entries) {
  if (seen.has(e.url)) continue;
  seen.add(e.url);
  uniq.push(e);
}

// Ensure library dir exists
const libDir = path.join(ROOT, 'library');
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

try {
  fs.writeFileSync(outFile, JSON.stringify(uniq, null, 2), 'utf8');
  console.log('Wrote', outFile, 'entries:', uniq.length);
} catch (e) {
  console.error('Failed to write:', e);
  process.exit(1);
}
