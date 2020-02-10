const staticAssets = ["./", "./js/index.js"];

self.addEventListener("install", async event => {
  const cache = await caches.open("static-cache");
  cache.addAll(staticAssets);
});

self.addEventListener("fetch", event => {
  const request = event.req;
  const url = new URL(request.url);

  if (url.origin === location.url) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(req) {
  const cachedResponse = caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  const cache = await caches.open("dynamic-cache");

  try {
    const res = await fetch(req);
    cache.put(req, res.clone());
    return res;
  } catch (error) {
    return await cache.match(req);
  }
}
