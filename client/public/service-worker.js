importScripts('workbox-sw.prod.v2.0.0.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'google-fonts',
  cacheExpiration: {
    maxEntries: 3,
    maxAgeSeconds: 60 * 60 * 24 * 30
  }
}));

workboxSW.router.registerRoute('https://code.getmdl.io/1.1.3/material.orange-indigo.min.css', workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'material-css'
}));

workboxSW.router.registerRoute(/.*(?:firebasestorage\.googleapis)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'post-images'
}));

workboxSW.router.registerRoute(function (routeData) {
  return (routeData.event.request.headers.get('accept').includes('text/html'));
}, function (args) {
  return caches.match(args.event.request)
    .then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(args.event.request)
          .then(function (res) {
            return caches.open('dynamic')
              .then(function (cache) {
                cache.put(args.event.request.url, res.clone());
                return res;
              })
          })
          .catch(function (err) {
            return caches.match('/offline.html')
              .then(function (res) {
                return res;
              });
          });
      }
    })
});

workboxSW.precache([
  {
    "url": "component/styles/input.css",
    "revision": "7da5c18e044571e55a7c09e68aabd4f0"
  },
  {
    "url": "component/styles/reply.css",
    "revision": "5dbb5f3691dbfdb63e9852dc8cba5fd6"
  },
  {
    "url": "component/styles/says.css",
    "revision": "4911328a8f5015bf10b4ae63cfd3611c"
  },
  {
    "url": "component/styles/setup.css",
    "revision": "13df23765a7721d0704aead8a83915e6"
  },
  {
    "url": "component/styles/typing.css",
    "revision": "b9507914c9b8e84497b7dafccbd8b412"
  },
  {
    "url": "index.html",
    "revision": "596a53ef9dac03698ba0e20f88bdf36b"
  },
  {
    "url": "manifest.json",
    "revision": "2bbb8525ba4089cb1fdd48a20f917cff"
  },
  {
    "url": "offline.html",
    "revision": "3b29a1a5bfef02933e2460b7870d695c"
  },
  {
    "url": "src/css/app.css",
    "revision": "b53b5e60964134baa003c102993a807f"
  },
  {
    "url": "src/images/profile_placeholder.png",
    "revision": "35dc32aff294a91ed31f220e29d095a1"
  },
  {
    "url": "src/js/app.min.js",
    "revision": "67319852b657676df16e4e345ebb44e2"
  }
]);