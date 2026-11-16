/**
 * High-Throughput Real-Time Telemetry Server
 * Native Node.js (Zero external dependencies)
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { collectMetrics } from './metrics.js';
import { TelemetryHub } from './stream.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || '0.0.0.0';

export function createTelemetryServer() {
  const hub = new TelemetryHub();

  // Metric Sampling Loop (every 1 second)
  setInterval(() => {
    const data = collectMetrics();
    hub.broadcast(data);
  }, 1000);

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    if (req.method === 'GET' && url.pathname === '/api/v1/stream') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
      });
      res.write(': connected\n\n');
      hub.addClient(res);
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/v1/metrics/history') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ history: hub.getHistory(), activeConnections: hub.getConnectedCount() }));
      return;
    }

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      const htmlPath = path.join(__dirname, 'public', 'index.html');
      const html = fs.readFileSync(htmlPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  });

  return { server, hub };
}

if (process.argv[1]?.endsWith('server.js')) {
  const { server } = createTelemetryServer();
  server.listen(PORT, HOST, () => {
    console.log(`[Telemetry Hub] Live Dashboard active at http://${HOST}:${PORT}`);
  });
}
