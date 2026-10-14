/**
 * SAJKSPLA Library – Express + SQLite Persistence Server
 *
 * Endpoints:
 *   GET  /api/db          → full database JSON (from SQLite)
 *   POST /api/db          → save/upsert full JSON into SQLite tables
 *   GET  /api/health      → uptime / health check
 *
 *   SQL Query endpoints:
 *   GET  /api/sql/users          → all users
 *   GET  /api/sql/books          → all books
 *   GET  /api/sql/borrow-records → all borrow records
 *   GET  /api/sql/reservations   → all reservations
 *   GET  /api/sql/fines          → all fines
 *   GET  /api/sql/notices        → all notices
 *   GET  /api/sql/events         → all events
 *
 * Static files served from dist/ (SPA fallback to index.html)
 *
 * Usage:
 *   npm install better-sqlite3          (first time only)
 *   node server.js                      (PORT defaults to 4000)
 *   PORT=8080 node server.js
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Paths ────────────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE  = path.join(DATA_DIR, 'library.db');
const DIST_DIR = path.join(__dirname, 'dist');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── SQLite Setup ─────────────────────────────────────────────────────────────
let db = null;
let usingSQLite = false;

try {
  const Database = require('better-sqlite3');
  db = new Database(DB_FILE);
  db.pragma('journal_mode = WAL');   // faster concurrent reads
  db.pragma('foreign_keys = ON');
  setupTables();
  usingSQLite = true;
  console.log('✅  SQLite database connected:', DB_FILE);
} catch (err) {
  console.warn('⚠️   better-sqlite3 not available — falling back to JSON file storage.');
  console.warn('    Run: npm install better-sqlite3   to enable SQLite');
}

/** Create all tables if they do not exist */
function setupTables() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS books (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS digital_books (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS borrow_records (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS fines (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS notices (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS gallery (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS donors (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS milestones (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS media_library (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS site_info (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )`,
  ];
  tables.forEach(sql => db.prepare(sql).run());
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Save an array of items to a SQLite table (upsert by id) */
function saveTableItems(tableName, items) {
  if (!Array.isArray(items)) return;
  const upsert = db.prepare(
    `INSERT INTO ${tableName} (id, data) VALUES (?, ?)
     ON CONFLICT(id) DO UPDATE SET data = excluded.data`
  );
  const transaction = db.transaction((rows) => {
    for (const item of rows) {
      const id = item.id || item._id || String(Date.now());
      upsert.run(id, JSON.stringify(item));
    }
  });
  transaction(items);
}

/** Read all items from a SQLite table */
function readTable(tableName) {
  try {
    const rows = db.prepare(`SELECT data FROM ${tableName}`).all();
    return rows.map(r => JSON.parse(r.data));
  } catch {
    return [];
  }
}

/** Build the full DB snapshot from SQLite */
function buildFullSnapshot() {
  return {
    app: 'sajkspla_library',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    storage: 'sqlite',
    users:         readTable('users'),
    books:         readTable('books'),
    digitalBooks:  readTable('digital_books'),
    notices:       readTable('notices'),
    events:        readTable('events'),
    gallery:       readTable('gallery'),
    donors:        readTable('donors'),
    borrowRecords: readTable('borrow_records'),
    reservations:  readTable('reservations'),
    fines:         readTable('fines'),
    milestones:    readTable('milestones'),
    mediaLibrary:  readTable('media_library'),
    siteInfo:      (() => {
      try {
        const row = db.prepare(`SELECT value FROM site_info WHERE key = 'main'`).get();
        return row ? JSON.parse(row.value) : {};
      } catch { return {}; }
    })()
  };
}

// ── Fallback JSON helpers (when SQLite not available) ─────────────────────────
const JSON_DB = path.join(DATA_DIR, 'db.json');

function jsonRead() {
  if (!fs.existsSync(JSON_DB)) return {};
  try { return JSON.parse(fs.readFileSync(JSON_DB, 'utf8')); } catch { return {}; }
}

function jsonWrite(data) {
  fs.writeFileSync(JSON_DB, JSON.stringify(data, null, 2), 'utf8');
}

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));
app.use(express.static(DIST_DIR));

// ── API Routes ────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    storage: usingSQLite ? 'sqlite' : 'json',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

/** GET full database */
app.get('/api/db', (_req, res) => {
  try {
    if (usingSQLite) {
      res.json(buildFullSnapshot());
    } else {
      res.json(jsonRead());
    }
  } catch (err) {
    console.error('[GET /api/db]', err);
    res.status(500).json({ error: 'Failed to read database.' });
  }
});

/** POST (save) full database */
app.post('/api/db', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload.' });
    }

    if (usingSQLite) {
      // Persist each collection into its own SQLite table
      if (Array.isArray(payload.users))         saveTableItems('users', payload.users);
      if (Array.isArray(payload.books))         saveTableItems('books', payload.books);
      if (Array.isArray(payload.digitalBooks))  saveTableItems('digital_books', payload.digitalBooks);
      if (Array.isArray(payload.notices))       saveTableItems('notices', payload.notices);
      if (Array.isArray(payload.events))        saveTableItems('events', payload.events);
      if (Array.isArray(payload.gallery))       saveTableItems('gallery', payload.gallery);
      if (Array.isArray(payload.donors))        saveTableItems('donors', payload.donors);
      if (Array.isArray(payload.borrowRecords)) saveTableItems('borrow_records', payload.borrowRecords);
      if (Array.isArray(payload.reservations))  saveTableItems('reservations', payload.reservations);
      if (Array.isArray(payload.fines))         saveTableItems('fines', payload.fines);
      if (Array.isArray(payload.milestones))    saveTableItems('milestones', payload.milestones);
      if (Array.isArray(payload.mediaLibrary))  saveTableItems('media_library', payload.mediaLibrary);
      if (payload.siteInfo && typeof payload.siteInfo === 'object') {
        db.prepare(
          `INSERT INTO site_info (key, value) VALUES ('main', ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value`
        ).run(JSON.stringify(payload.siteInfo));
      }
      console.log(`[POST /api/db] SQLite updated at ${new Date().toISOString()}`);
    } else {
      jsonWrite(payload);
      console.log(`[POST /api/db] JSON file updated (${JSON.stringify(payload).length} bytes)`);
    }

    res.json({ success: true, storage: usingSQLite ? 'sqlite' : 'json' });
  } catch (err) {
    console.error('[POST /api/db]', err);
    res.status(500).json({ error: 'Failed to save database.' });
  }
});

// ── Direct SQL Query Endpoints ─────────────────────────────────────────────

app.get('/api/sql/users', (_req, res) => {
  if (!usingSQLite) return res.status(503).json({ error: 'SQLite not available.' });
  res.json(readTable('users'));
});

app.get('/api/sql/books', (_req, res) => {
  if (!usingSQLite) return res.status(503).json({ error: 'SQLite not available.' });
  res.json(readTable('books'));
});

app.get('/api/sql/borrow-records', (_req, res) => {
  if (!usingSQLite) return res.status(503).json({ error: 'SQLite not available.' });
  res.json(readTable('borrow_records'));
});

app.get('/api/sql/reservations', (_req, res) => {
  if (!usingSQLite) return res.status(503).json({ error: 'SQLite not available.' });
  res.json(readTable('reservations'));
});

app.get('/api/sql/fines', (_req, res) => {
  if (!usingSQLite) return res.status(503).json({ error: 'SQLite not available.' });
  res.json(readTable('fines'));
});

app.get('/api/sql/notices', (_req, res) => {
  if (!usingSQLite) return res.status(503).json({ error: 'SQLite not available.' });
  res.json(readTable('notices'));
});

app.get('/api/sql/events', (_req, res) => {
  if (!usingSQLite) return res.status(503).json({ error: 'SQLite not available.' });
  res.json(readTable('events'));
});

// ── SPA Fallback ──────────────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  const indexFile = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).send('App not built yet. Run: npm run build');
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅  SAJKSPLA Library server  →  http://0.0.0.0:${PORT}`);
  console.log(`   Storage : ${usingSQLite ? `SQLite (${DB_FILE})` : `JSON (${JSON_DB})`}`);
  console.log(`   Static  : ${DIST_DIR}`);
  console.log(`\n   SQL API endpoints:`);
  console.log(`     GET /api/sql/users`);
  console.log(`     GET /api/sql/books`);
  console.log(`     GET /api/sql/borrow-records`);
  console.log(`     GET /api/sql/reservations`);
  console.log(`     GET /api/sql/fines`);
  console.log(`     GET /api/sql/notices`);
  console.log(`     GET /api/sql/events\n`);
});
