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

function normalizeUrl(u, ensureLibraryPrefix = false) {
  if (!u) return u;
  if (!u.startsWith('/')) u = '/' + u;
  u = u.replace(/\/+/g, '/');
  
  // Ensure /library prefix if requested and not already present
  if (ensureLibraryPrefix && !u.startsWith('/library')) {
    u = '/library' + u;
  }
  
  return u;
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
      url = normalizeUrl(String(fm.permalink), true);
    } else if (fm.url) {
      url = normalizeUrl(String(fm.url), true);
    } else {
      const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
      let urlPath = '/' + rel.replace(/\.md$/i, '');
      if (urlPath.endsWith('/index')) urlPath = urlPath.replace(/\/index$/, '/');
      url = normalizeUrl('/library' + urlPath);
    }

    let content = removeMd(body || '');
    content = content.replace(/\s+/g, ' ').trim();
    if (content.length > MAX_CONTENT_CHARS) content = content.slice(0, MAX_CONTENT_CHARS);

    entries.push({ title, url, content });
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

// Validate all URLs have /library prefix
console.log('Validating URLs...');
let validationErrors = 0;
for (const e of uniq) {
  if (!e.url.startsWith('/library')) {
    console.error(`ERROR: URL missing /library prefix: "${e.url}" for title: "${e.title}"`);
    validationErrors++;
  }
}

if (validationErrors > 0) {
  console.error(`\nValidation failed with ${validationErrors} error(s). URLs must start with /library`);
  process.exit(1);
}
console.log('✓ All URLs validated successfully');

// Ensure library dir exists
const libDir = path.join(ROOT, 'library');
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

try {
  fs.writeFileSync(outFile, JSON.stringify(uniq, null, 2), 'utf8');
  console.log('✓ Wrote', outFile);
  console.log(`✓ Total entries: ${uniq.length}`);
  console.log('✓ All entries have valid /library prefix');
} catch (e) {
  console.error('Failed to write:', e);
  process.exit(1);
}
