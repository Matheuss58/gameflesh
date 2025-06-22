const CACHE_NAME = 'gameflesh-cache-v3';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './sounds/complete.mp3',
  './sounds/level-up.mp3',
  './sounds/reward.mp3',
  './sounds/slot.mp3'
];

// Instala e faz cache inicial
self.addEventListener('install', event => {
  self.skipWaiting(); // Ativa imediatamente após instalar
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .catch(err => console.error('Erro no cache inicial', err))
  );
});

// Ativa e limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // Assume o controle imediatamente
});

// Intercepta requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => 
        response || fetch(event.request)
      )
      .catch(() => {
        // Se quiser, pode retornar uma página offline aqui
      })
  );
});
