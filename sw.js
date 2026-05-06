// VideoPress — Service Worker
// Injects Cross-Origin-Embedder-Policy and Cross-Origin-Opener-Policy headers
// so that SharedArrayBuffer (required by FFmpeg WASM) is available on GitHub Pages.

const CACHE = 'videopress-v1';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  // Skip non-GET and opaque requests that would break
  if (e.request.method !== 'GET') return;
  if (e.request.cache === 'only-if-cached' && e.request.mode !== 'same-origin') return;

  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Clone and add required headers
        const headers = new Headers(response.headers);
        headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers
        });
      })
      .catch(() => fetch(e.request))
  );
});
