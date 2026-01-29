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
const MAX_CONTENT_CHARS = 4000; // Limit content size for search performance and index size
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
      console.warn('Front-matter parsing failed for:', filePath, e.message);
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

    let content = body || '';
    // Remove Jekyll/Liquid template syntax first
    content = content.replace(/\{%.*?%\}/gs, '');
    content = content.replace(/\{\{.*?\}\}/gs, '');
    // Then remove markdown
    content = removeMd(content);
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
