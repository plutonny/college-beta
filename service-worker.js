var CACHE_NAME = 'csc11-byPlutonny' 

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys()
        .then(keyList =>
            Promise.all(keyList.map(key => {
                if (!cacheWhitelist.includes(key)) {
                    console.log('Service worker: deleting cache: ' + key)
                    return caches.delete(key);
                }
            }))
        )
    );
});

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            fetch('manifest.json')
            .then(response => {
                response.json()
            })
            .then(assets => {
                const urlsToCache = [
                    'index.html',
                    'csc11-pwa-app-icon.png',
                ]
                cache.addAll(urlsToCache)
                console.log('Service worker: chaced');
            })
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});