/* service-worker.js */
var GHPATH = '/taurusvault.github.io';
var APP_PREFIX = 'ffpwa_';
var VERSION = 'version_03';
/*
  We list every asset we want to pre-cache:
  - Root index and optional manifest
  - Main JavaScript (sketch.js or others)
  - CSS (styles.css or equivalent)
  - Audio files in ./audio
  - Normal fruit textures in ./normtextures
  - “Ow” fruit textures in ./owtextures
  - (Optional) The service worker itself
*/
var URLS = [
  // Basic pages/assets
  "./",               // Root so offline can load the site
  "./index.html",
  "./manifest.webmanifest",  // If you have a web app manifest
  "./styles.css",     // Adjust if your CSS is named differently
  "./sketch.js",      // Main p5 or your custom JS
  "./service-worker.js", // Optional: to cache the SW itself
  "./p5.sound.min.js",
  "./logo192.png",
  "./logo512.png",
  "./logo.png",
  "./screenshot-narrow.png",
  "./screenshot-wide.png",
  "./p5.js",
  "./README.md",

  // Audio
  "./audio/BGM_Tranquil.mp3",
  "./audio/bubble_pop.mp3",
  "./audio/pop.mp3",
  "./audio/correct.mp3",
  "./audio/error.mp3",

  // ----- Normal textures (22 fruits) -----
  "./normtextures/blueberry.png",
  "./normtextures/cranberry.png",
  "./normtextures/lychee.png",
  "./normtextures/strawberry.png",
  "./normtextures/kiwi.png",
  "./normtextures/lemon.png",
  "./normtextures/mangosteen.png",
  "./normtextures/passionfruit.png",
  "./normtextures/peach.png",
  "./normtextures/apple.png",
  "./normtextures/orange.png",
  "./normtextures/grapefruit.png",
  "./normtextures/guava.png",
  "./normtextures/avocado.png",
  "./normtextures/pomegranate.png",
  "./normtextures/pear.png",
  "./normtextures/mango.png",
  "./normtextures/dragonfruit.png",
  "./normtextures/honeydew.png",
  "./normtextures/papaya.png",
  "./normtextures/coconut.png",
  "./normtextures/watermelon.png",

  // ----- "ow" textures (22 fruits) -----
  "./owtextures/blueberry_ow.png",
  "./owtextures/cranberry_ow.png",
  "./owtextures/lychee_ow.png",
  "./owtextures/strawberry_ow.png",
  "./owtextures/kiwi_ow.png",
  "./owtextures/lemon_ow.png",
  "./owtextures/mangosteen_ow.png",
  "./owtextures/passionfruit_ow.png",
  "./owtextures/peach_ow.png",
  "./owtextures/apple_ow.png",
  "./owtextures/orange_ow.png",
  "./owtextures/grapefruit_ow.png",
  "./owtextures/guava_ow.png",
  "./owtextures/avocado_ow.png",
  "./owtextures/pomegranate_ow.png",
  "./owtextures/pear_ow.png",
  "./owtextures/mango_ow.png",
  "./owtextures/dragonfruit_ow.png",
  "./owtextures/honeydew_ow.png",
  "./owtextures/papaya_ow.png",
  "./owtextures/coconut_ow.png",
  "./owtextures/watermelon_ow.png"
];


/* 
  Service Worker install event:
  - Opens the specified cache
  - Pre-caches all the files in urlsToCache
*/
var URLS = [
  '/', // root of the site (to cache index.html)
  'index.html',
  'style.css',
  'sketch.js',
  'manifest.webmanifest',
  'normtextures/blueberry.png',
  'normtextures/cranberry.png',
  'normtextures/lychee.png',
  'normtextures/strawberry.png',
  'normtextures/kiwi.png',
  'normtextures/lemon.png',
  'normtextures/mangosteen.png',
  'normtextures/passionfruit.png',
  'normtextures/peach.png',
  'normtextures/apple.png',
  'normtextures/orange.png',
  'normtextures/grapefruit.png',
  'normtextures/guava.png',
  'normtextures/avocado.png',
  'normtextures/pomegranate.png',
  'normtextures/pear.png',
  'normtextures/mango.png',
  'normtextures/dragonfruit.png',
  'normtextures/honeydew.png',
  'normtextures/papaya.png',
  'normtextures/coconut.png',
  'normtextures/watermelon.png',
  'owtextures/blueberry_ow.png',
  'owtextures/cranberry_ow.png',
  // ... add the rest of your "ow" textures as needed
];

const CACHE_NAME = 'pwa-cache-v1';

function addResourcesToCache(resources) {
  return caches.open(CACHE_NAME).then(cache => {
    return Promise.all(
      resources.map(url => {
        return fetch(url)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Request for ${url} returned a ${response.status}`);
            }
            return cache.put(url, response);
          })
          .catch(error => {
            console.error('Failed to cache:', url, error);
            return Promise.resolve();
          });
      })
    );
  });
}

self.addEventListener('install', event => {
  event.waitUntil(addResourcesToCache(URLS));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

