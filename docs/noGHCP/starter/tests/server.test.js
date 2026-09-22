import test from 'node:test';
import assert from 'node:assert/strict';
import { request as httpRequest, Server } from 'node:http';
import { connect } from 'node:net';
import { once } from 'node:events';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createServer } from '../server.mjs';

const HOST = '127.0.0.1:4173';
const CSP = "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
const routes = [
  ['/', '../index.html', 'text/html; charset=utf-8'],
  ['/index.html', '../index.html', 'text/html; charset=utf-8'],
  ['/styles.css', '../styles.css', 'text/css; charset=utf-8'],
  ['/src/app.js', '../src/app.js', 'text/javascript; charset=utf-8'],
  ['/src/domain.js', '../src/domain.js', 'text/javascript; charset=utf-8'],
  ['/src/storage.js', '../src/storage.js', 'text/javascript; charset=utf-8'],
];

function securityHeaders(headers) {
  assert.equal(headers['content-security-policy'], CSP);
  assert.equal(headers['x-content-type-options'], 'nosniff');
  assert.equal(headers['referrer-policy'], 'no-referrer');
  assert.equal(headers['cache-control'], 'no-store');
  assert.equal(headers['access-control-allow-origin'], undefined);
}

async function listening(t) {
  const server = createServer();
  t.after(async () => {
    if (server.listening) {
      const closed = new Promise((resolve, reject) => {
        server.close((error) => error ? reject(error) : resolve());
      });
      server.closeAllConnections();
      await closed;
    }
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  assert.equal(server.address().address, '127.0.0.1');
  return server.address().port;
}

function request(port, path = '/', method = 'GET', headers = ['Host', HOST]) {
  return new Promise((resolve, reject) => {
    const req = httpRequest({
      hostname: '127.0.0.1', port, path, method, headers,
      setHost: false, agent: false,
    }, (response) => {
      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('error', reject);
      response.on('end', () => resolve({
        status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks),
      }));
    });
    req.setTimeout(3000, () => req.destroy(new Error('HTTP test timed out')));
    req.on('error', reject);
    req.end();
  });
}

function rawRequest(port, message) {
  return new Promise((resolve, reject) => {
    const socket = connect({ host: '127.0.0.1', port });
    let output = '';
    socket.setEncoding('utf8');
    socket.setTimeout(3000, () => socket.destroy(new Error('Raw HTTP test timed out')));
    socket.on('connect', () => socket.end(message));
    socket.on('data', (chunk) => { output += chunk; });
    socket.on('error', reject);
    socket.on('end', () => { socket.destroy(); resolve(output); });
  });
}

test('H01 FR-009 import never listens and factory returns distinct unstarted HTTP servers', () => {
  const moduleUrl = new URL('../server.mjs', import.meta.url).href;
  const child = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import { Server } from 'node:http';
    Server.prototype.listen = () => { throw new Error('Import attempted to listen'); };
    const { createServer } = await import(${JSON.stringify(moduleUrl)});
    if (createServer().listening) throw new Error('Factory started its server');
  `], {
    cwd: fileURLToPath(new URL('../src/', import.meta.url)),
    encoding: 'utf8', timeout: 5000,
  });
  assert.ifError(child.error);
  assert.equal(child.status, 0, child.stderr);
  assert.equal(child.stdout, '');
  const first = createServer();
  const second = createServer();
  assert.ok(first instanceof Server);
  assert.notEqual(first, second);
  assert.equal(first.listening, false);
  assert.equal(first.address(), null);
  assert.equal(second.listening, false);
});

test('H01/H02 FR-009 every fixed route serves exact bytes, MIME, headers and bodyless HEAD', async (t) => {
  const port = await listening(t);
  for (const [path, filename, type] of routes) {
    const bytes = await readFile(new URL(filename, import.meta.url));
    const get = await request(port, path);
    assert.equal(get.status, 200, path);
    assert.equal(get.headers['content-type'], type);
    assert.equal(Number(get.headers['content-length']), bytes.length);
    assert.deepEqual(get.body, bytes);
    securityHeaders(get.headers);
    const head = await request(port, path, 'HEAD');
    assert.equal(head.status, get.status);
    assert.equal(head.headers['content-type'], type);
    assert.equal(head.headers['content-length'], get.headers['content-length']);
    assert.equal(head.body.length, 0);
    securityHeaders(head.headers);
  }
  assert.equal((await request(port, '/', 'GET', ['hOsT', HOST])).status, 200);
});

test('H02 FR-009 exactly one literal Host is required, including on HEAD', async (t) => {
  const port = await listening(t);
  for (const headers of [
    ['Host', 'localhost:4173'], ['Host', '127.0.0.1'], ['Host', '127.0.0.1:80'],
    ['Host', `127.0.0.1:${port}`], ['Host', '[::1]:4173'], ['Host', 'example.invalid'],
    ['Host', `${HOST}, ${HOST}`], ['Host', HOST, 'hOsT', HOST],
    ['Host', HOST, 'Host', 'example.invalid'], ['Host', ''],
  ]) {
    for (const method of ['GET', 'HEAD']) {
      const response = await request(port, '/', method, headers);
      assert.equal(response.status, 400);
      securityHeaders(response.headers);
      if (method === 'HEAD') assert.equal(response.body.length, 0);
      else assert.equal(response.body.toString(), 'Bad request.\n');
    }
  }
  const missing = await rawRequest(port, 'GET / HTTP/1.0\r\nConnection: close\r\n\r\n');
  assert.match(missing, /^HTTP\/1\.1 400 /);
  assert.match(missing, /Content-Security-Policy: /i);
  const missingHead = await rawRequest(port, 'HEAD / HTTP/1.0\r\nConnection: close\r\n\r\n');
  assert.match(missingHead, /^HTTP\/1\.1 400 /);
  assert.equal(missingHead.split('\r\n\r\n')[1], '');
});

test('H02 FR-009 unsupported methods return 405 and exact Allow, never write/API handlers', async (t) => {
  const port = await listening(t);
  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'TRACE']) {
    const response = await request(port, '/', method);
    assert.equal(response.status, 405, method);
    assert.equal(response.headers.allow, 'GET, HEAD');
    assert.equal(response.body.toString(), 'Method not allowed.\n');
    securityHeaders(response.headers);
  }
  const hostFirst = await request(port, '/unknown', 'POST', ['Host', 'wrong.invalid']);
  assert.equal(hostFirst.status, 400);
  securityHeaders(hostFirst.headers);
});

test('H02 FR-009 CONNECT is denied with the same Host policy and no tunnel', async (t) => {
  const port = await listening(t);
  for (const [host, status] of [[HOST, 405], ['example.invalid', 400]]) {
    const output = await rawRequest(port, `CONNECT example.invalid:443 HTTP/1.1\r\nHost: ${host}\r\n\r\n`);
    assert.match(output, new RegExp(`^HTTP/1\\.1 ${status} `));
    assert.match(output, /Content-Security-Policy: default-src 'none';/);
    assert.match(output, /X-Content-Type-Options: nosniff/);
    assert.match(output, /Referrer-Policy: no-referrer/);
    if (status === 405) assert.match(output, /Allow: GET, HEAD/);
    assert.equal(output.split('\r\n\r\n')[1], status === 405 ? 'Method not allowed.\n' : 'Bad request.\n');
  }
});

test('H02 FR-009 raw paths deny queries, encodings, traversal, absolute targets and non-allowlisted files', async (t) => {
  const port = await listening(t);
  const paths = [
    '/?x=1', '/index.html?', '/styles.css?v=1', '/src/app.js#fragment',
    '/src/', '/unknown', '/favicon.ico', '/api/books', '/package.json', '/server.mjs',
    '/tests/server.test.js', '/.env', '/.git/config', '/.gitignore',
    '/../index.html', '/src/../index.html', '/./index.html', '//index.html',
    '/%69ndex.html', '/src/%64omain.js', '/%2e%2e/index.html',
    '/src%2fapp.js', '/%2findex.html', '/%252e%252e/index.html', '/%00', '/%',
    '/src\\app.js', '/src/..\\index.html', '/INDEX.HTML',
    'http://127.0.0.1:4173/index.html', '*',
  ];
  for (const path of paths) {
    const get = await request(port, path);
    assert.equal(get.status, 404, path);
    assert.equal(get.body.toString(), 'Not found.\n', path);
    securityHeaders(get.headers);
    const head = await request(port, path, 'HEAD');
    assert.equal(head.status, 404, path);
    assert.equal(head.body.length, 0);
    assert.equal(head.headers['content-length'], get.headers['content-length']);
    assert.equal(head.headers['content-type'], get.headers['content-type']);
    securityHeaders(head.headers);
  }
});

test('H02 FR-009 malformed HTTP is rejected without file disclosure; parser headers may differ', async (t) => {
  const port = await listening(t);
  const output = await rawRequest(port, 'GET / HTTP/1.1\r\nHost: 127.0.0.1:4173\r\nBad Header: value\r\n\r\n');
  assert.match(output, /^HTTP\/1\.1 400 /);
  assert.doesNotMatch(output, /<!doctype|node:fs|server\.mjs|Error:|[A-Z]:\\/i);
});
