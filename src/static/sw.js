const CACHE_NAME = 'iban-manager-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/styles.css',
  '/script.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Service Worker kurulumu
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache açıldı');
        return cache.addAll(urlsToCache);
      })
  );
});

// Cache'den veri çekme
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache'de varsa cache'den döndür
        if (response) {
          return response;
        }
        
        // Yoksa network'ten çek
        return fetch(event.request).then(
          function(response) {
            // Geçerli bir response mu kontrol et
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Response'u klonla (response stream olduğu için)
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Eski cache'leri temizle
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski cache siliniyor:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
