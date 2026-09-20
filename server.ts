import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Persistent stats storage path
const DATA_DIR = path.join(process.cwd(), 'data');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

// Initialize stats file if not exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StatsData {
  views: number;
  lastUpdated: string;
}

const INITIAL_BASE_VIEWS = 0;

function getStats(): StatsData {
  try {
    if (fs.existsSync(STATS_FILE)) {
      const raw = fs.readFileSync(STATS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (typeof parsed.views === 'number' && !isNaN(parsed.views)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading stats.json:', err);
  }
  return { views: INITIAL_BASE_VIEWS, lastUpdated: new Date().toISOString() };
}

function saveStats(data: StatsData): void {
  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving stats.json:', err);
  }
}

// In-memory stats initialized from file
let statsState: StatsData = getStats();

// Connected SSE clients for real-time live push
const sseClients: Set<express.Response> = new Set();

function broadcastStats() {
  const payload = JSON.stringify({
    views: statsState.views,
    activeViewers: Math.max(1, sseClients.size),
    timestamp: Date.now(),
  });

  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

// API Routes
app.get('/api/views', (req, res) => {
  res.json({
    views: statsState.views,
    activeViewers: Math.max(1, sseClients.size),
  });
});

app.post('/api/views', (req, res) => {
  statsState.views += 1;
  statsState.lastUpdated = new Date().toISOString();
  saveStats(statsState);

  // Real-time broadcast to all listening clients
  broadcastStats();

  res.json({
    views: statsState.views,
    activeViewers: Math.max(1, sseClients.size),
  });
});

// Server-Sent Events (SSE) endpoint for real-time updates
app.get('/api/views/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.add(res);

  // Send initial data immediately
  const initialPayload = JSON.stringify({
    views: statsState.views,
    activeViewers: Math.max(1, sseClients.size),
    timestamp: Date.now(),
  });
  res.write(`data: ${initialPayload}\n\n`);

  // Broadcast to other clients about updated active viewer count
  broadcastStats();

  // Heartbeat every 20 seconds to prevent connection timeout
  const heartbeat = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
    broadcastStats();
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', views: statsState.views });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
