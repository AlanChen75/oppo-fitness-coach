'use strict';

// 版本化快取：改版時務必升版號，activate 會清掉舊版
const CACHE_NAME = 'fitness-coach-v0.8.1';

// 核心預快取：頁面、模型、manifest。
// Vite 產出的 hashed JS/CSS 與 wasm 走 runtime cache-first（首次線上載入後即可離線）。
const PRECACHE = [
  './',
  './index.html',
  './exercises.html',
  './more.html',
  './device-check.html',
  './train.html',
  './demo.html',
  './review.html',
  './manifest.webmanifest',
  './models/pose_landmarker_lite.task',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 導航：network-first（部署新版能更新），離線退快取
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // 其餘同源資產（hashed js/css、wasm、model）：cache-first + 背景補快取
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      });
    })
  );
});
