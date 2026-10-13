/**
 * SAJKSPLA Library – Lightweight Express Persistence Server
 *
 * Endpoints:
 *   GET  /api/db        → returns the full JSON database from data/db.json
 *   POST /api/db        → persists the full JSON backup to data/db.json
 *   GET  /api/health    → health-check / uptime ping
 *
 * Static files are served from the `dist/` folder produced by `npm run build`.
 * All other routes fall back to dist/index.html (SPA mode).
 *
 * Usage:
 *   node server.js                    (PORT defaults to 4000)
 *   PORT=8080 node server.js          (custom port)
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Paths ────────────────────────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE  = path.join(DATA_DIR, 'db.json');
const DIST_DIR = path.join(__dirname, 'dist');

// Ensure data/ directory exists
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '50mb' }));   // large payloads (base64 images)
app.use(express.static(DIST_DIR));

// ── API Routes ────────────────────────────────────────────────────────────────

/** Health check */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

/** Pull full database */
app.get('/api/db', (_req, res) => {
  if (!fs.existsSync(DB_FILE)) {
    return res.json({});          // empty – clients will keep their localStorage
  }
  try {
    const raw  = fs.readFileSync(DB_FILE, 'utf8');
    const data = JSON.parse(raw);
    res.json(data);
  } catch (err) {
    console.error('[GET /api/db] Parse error:', err);
    res.status(500).json({ error: 'Failed to read database.' });
  }
});

/** Push / overwrite full database */
app.post('/api/db', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Invalid payload.' });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf8');
    console.log(`[POST /api/db] Database saved (${JSON.stringify(payload).length} bytes) at ${new Date().toISOString()}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[POST /api/db] Write error:', err);
    res.status(500).json({ error: 'Failed to save database.' });
  }
});

/** SPA fallback – all other routes serve index.html */
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
  console.log(`✅  SAJKSPLA Library server running on http://0.0.0.0:${PORT}`);
  console.log(`   Static: ${DIST_DIR}`);
  console.log(`   DB:     ${DB_FILE}`);
});
