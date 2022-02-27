var BETA = true;

var CACHE_NAME = '';

if (BETA) {CACHE_NAME = 'plutonny-college-beta'} else {CACHE_NAME = 'plutonny-college'}

self.addEventListener('activate', event => {
   const cacheWhitelist = [CACHE_NAME];
   event.waitUntil(
       caches.keys()
           .then(keyList =>
               Promise.all(keyList.map(key => {
                   if (!cacheWhitelist.includes(key)) {
                       console.log('Deleting cache: ' + key)
                       return caches.delete(key);
                   }
               }))
           )
   );
});

self.addEventListener('install', function(event) {
   if (!BETA) {
       event.waitUntil(
           caches.open(CACHE_NAME)
               .then(function(cache) {
                   fetch('manifest.json')
                       .then(response => {
                           response.json()
                       })
                       .then(assets => {
                           const urlsToCache = [
                               'icon-pwa.png',
                           ]
                           cache.addAll(urlsToCache)
                           console.log('cached');
                       })
               })
       );
   }
});

self.addEventListener('fetch', function(event) {
   if (!BETA) {
       event.respondWith(
           caches.match(event.request).then(function(response) {
               return response || fetch(event.request);
           })
       );
   }
});