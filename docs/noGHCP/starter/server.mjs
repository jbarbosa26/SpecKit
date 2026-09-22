import { createServer as createHttpServer, ServerResponse } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HOST = '127.0.0.1:4173';
const CSP = "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
// Only these fixed module-relative files can be served, never a user-built path.
const routes = new Map([
  ['/', [new URL('./index.html', import.meta.url), 'text/html; charset=utf-8']],
  ['/index.html', [new URL('./index.html', import.meta.url), 'text/html; charset=utf-8']],
  ['/styles.css', [new URL('./styles.css', import.meta.url), 'text/css; charset=utf-8']],
  ['/src/app.js', [new URL('./src/app.js', import.meta.url), 'text/javascript; charset=utf-8']],
  ['/src/domain.js', [new URL('./src/domain.js', import.meta.url), 'text/javascript; charset=utf-8']],
  ['/src/storage.js', [new URL('./src/storage.js', import.meta.url), 'text/javascript; charset=utf-8']],
]);

export function createServer() {
  async function handleRequest(request, response) {
    function send(status, body, type = 'text/plain; charset=utf-8', extra = {}) {
      response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(body),
        'Content-Security-Policy': CSP,
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Cache-Control': 'no-store',
        ...extra,
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    }

    const hosts = [];
    for (let i = 0; i < request.rawHeaders.length; i += 2) {
      if (request.rawHeaders[i].toLowerCase() === 'host') {
        hosts.push(request.rawHeaders[i + 1]);
      }
    }
    if (hosts.length !== 1 || hosts[0] !== HOST) {
      send(400, 'Bad request.\n');
      return;
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      send(405, 'Method not allowed.\n', undefined, { Allow: 'GET, HEAD' });
      return;
    }
    const route = routes.get(request.url);
    if (!route) {
      send(404, 'Not found.\n');
      return;
    }
    let body;
    try {
      body = await readFile(route[0]);
    } catch {
      send(500, 'Unable to read application file.\n');
      return;
    }
    send(200, body, route[1]);
  }
  const server = createHttpServer(handleRequest);
  // Node routes CONNECT outside the normal request handler; never open a tunnel.
  server.on('connect', (request, socket) => {
    const response = new ServerResponse(request);
    response.shouldKeepAlive = false;
    response.assignSocket(socket);
    response.on('finish', () => socket.end());
    socket.on('error', () => socket.destroy());
    handleRequest(request, response);
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = createServer();
  server.once('error', () => {
    console.error('Cannot start BookNook on 127.0.0.1:4173. Check whether the port is already in use.');
    process.exitCode = 1;
  });
  server.listen(4173, '127.0.0.1', () => {
    console.log('BookNook: http://127.0.0.1:4173 (fictional, non-secret data only)');
  });
}
