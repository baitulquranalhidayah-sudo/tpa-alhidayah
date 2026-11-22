#!/usr/bin/env node
/**
 * Dev server statis + live reload (tanpa dependency).
 *
 *   node tools/dev-server.mjs          # http://localhost:8080
 *   PORT=3000 node tools/dev-server.mjs
 *
 * Setiap kali file di folder proyek berubah, browser otomatis refresh.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '127.0.0.1';

const IGNORED = new Set(['node_modules', '.git', '.github', 'dist', 'tools']);
const WATCHED_EXT = new Set([
  '.html', '.css', '.js', '.mjs', '.json', '.svg', '.php',
  '.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.woff', '.woff2',
]);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

const RELOAD_SNIPPET = `
<script>
  (() => {
    const src = new EventSource('/__live');
    src.addEventListener('reload', () => location.reload());
    src.onerror = () => console.warn('[live-reload] koneksi terputus, mencoba lagi...');
  })();
</script>
`;

/** @type {Set<import('node:http').ServerResponse>} */
const clients = new Set();

function broadcast() {
  for (const res of clients) {
    try {
      res.write('event: reload\ndata: now\n\n');
    } catch {
      clients.delete(res);
    }
  }
  console.log(`[live-reload] perubahan terdeteksi — ${clients.size} tab di-refresh`);
}

// --- watcher: fs.watch rekursif, fallback ke polling mtime -------------------
let debounce = null;
function scheduleBroadcast() {
  clearTimeout(debounce);
  debounce = setTimeout(broadcast, 120);
}

function startWatch() {
  try {
    fs.watch(ROOT, { recursive: true }, (_event, filename) => {
      if (!filename) return;
      const parts = filename.split(path.sep);
      if (parts.some((p) => IGNORED.has(p))) return;
      if (!WATCHED_EXT.has(path.extname(filename).toLowerCase())) return;
      scheduleBroadcast();
    });
    console.log('[live-reload] memantau perubahan file (fs.watch)');
    return;
  } catch (err) {
    console.warn('[live-reload] fs.watch gagal, pakai polling:', err.message);
  }

  const mtimes = new Map();
  const snapshot = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (IGNORED.has(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) snapshot(full);
      else if (WATCHED_EXT.has(path.extname(entry.name).toLowerCase())) {
        try {
          mtimes.set(full, fs.statSync(full).mtimeMs);
        } catch {}
      }
    }
  };
  snapshot(ROOT);
  setInterval(() => {
    const before = new Map(mtimes);
    snapshot(ROOT);
    for (const [file, mtime] of mtimes) {
      if (before.get(file) !== mtime) return scheduleBroadcast();
    }
  }, 500).unref();
}

// --- server -----------------------------------------------------------------
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/__live') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write('retry: 1000\n\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  const decoded = decodeURIComponent(url.pathname);
  const rel = decoded.replace(/^\/+/, '');
  let filePath = path.resolve(ROOT, rel);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403).end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isDirectory()) filePath = path.join(filePath, 'index.html');
    else if (!err && !stat.isFile()) filePath = '';

    fs.readFile(filePath || '', (readErr, data) => {
      if (readErr || !filePath) {
        // fallback ke 404.html kalau ada
        const notFound = path.join(ROOT, '404.html');
        fs.readFile(notFound, (e2, page) => {
          if (e2) return res.writeHead(404, { 'Content-Type': 'text/plain' }).end('404 Not Found');
          res.writeHead(404, { 'Content-Type': MIME['.html'] }).end(page);
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const type = MIME[ext] || 'application/octet-stream';

      if (ext === '.html') {
        let html = data.toString('utf8');
        html = html.includes('</body>')
          ? html.replace('</body>', `${RELOAD_SNIPPET}</body>`)
          : html + RELOAD_SNIPPET;
        res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
        res.end(html);
        return;
      }

      res.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      res.end(data);
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\n  🚀 Live view: http://localhost:${PORT}\n`);
  startWatch();
});

process.on('SIGINT', () => {
  console.log('\n[dev] berhenti.');
  process.exit(0);
});
