const cacheName = "pwa-demo";
const filesToCache = ["/", "/index.html", "/js", "/img/"];

/* Start the service worker and cache all of the app's content */
self.addEventListener("install", function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log(`Opened cache:${cacheName}`);
      return cache.addAll(filesToCache);
    })
  );
});

/* Serve cached content when offline */
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        //console.log(`Cache hit! ${event.request}`);
        return response;
      }
      console.log(`no cache hit`);
      return fetch(event.request).then(function(response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "GET") {
          return response;
        }
        //console.log(event.request);
        const responseToCache = response.clone();

        caches.open(cacheName).then(function(cache) {
          cache.put(event.request, responseToCache);
        });
        return response;
      });
    })
  );
});

/* Delete non-whitelisted cache on update SW */
self.addEventListener("activate", function(event) {
  console.log(`Deleting cache!`);
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (filesToCache.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
