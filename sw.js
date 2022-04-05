/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "webpack-runtime-4d863bdb73257ccc15fa.js"
  },
  {
    "url": "framework-109f897ac1c4de17fd7b.js"
  },
  {
    "url": "styles.e590b94683fdfc799bc6.css"
  },
  {
    "url": "91cfaedf-223d9ef2b1f4d81bc242.js"
  },
  {
    "url": "8c94476aecfffef8bb188161ebc5955ec9aac41a-fc86e7748288654442a7.js"
  },
  {
    "url": "dc6a8720040df98778fe970bf6c000a41750d3ae-a1a1fb14cd230c267cb3.js"
  },
  {
    "url": "app-c023ae50e07787ef8f3f.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "485fa2c5ca0fdc21ed8d6910b3e6adc6"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "8ddd8a5abf8dc289428b4e4c56406df6"
  },
  {
    "url": "page-data/sq/d/1170113242.json",
    "revision": "08845f5fbfb54c8960a9c561db952d96"
  },
  {
    "url": "page-data/sq/d/3387501435.json",
    "revision": "11a6c8b3cc4847343cc08d3e64d4d6ed"
  },
  {
    "url": "page-data/sq/d/3992131839.json",
    "revision": "76082772208e7ac9eab1b6150eb379de"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "b912cbda64e2a4d06a142d92eae26626"
  },
  {
    "url": "polyfill-4b4ce6cee4dcefa48e5a.js"
  },
  {
    "url": "page-data/index/page-data.json",
    "revision": "26f2d8680c06616eeb71e13070b808c3"
  },
  {
    "url": "page-data/404/page-data.json",
    "revision": "681e90dc65a6bde6413e68b849695c47"
  },
  {
    "url": "page-data/about/page-data.json",
    "revision": "bbf5e53df19691b2b2b80cf4d93bea40"
  },
  {
    "url": "page-data/game/page-data.json",
    "revision": "19a919edcbe01b0d165ef414cf273876"
  },
  {
    "url": "page-data/settings/page-data.json",
    "revision": "1b30964539584542bf9a7b520f341385"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "c4d5465fe0365e60da43fa77eab03f73"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|avif|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())

    // We detected compilation hash mismatch
    // we should clear runtime cache as data
    // files might be out of sync and we should
    // do fresh fetches for them
    event.waitUntil(
      caches.keys().then(function (keyList) {
        return Promise.all(
          keyList.map(function (key) {
            if (key && key.includes(`runtime`)) {
              return caches.delete(key)
            }

            return Promise.resolve()
          })
        )
      })
    )
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^/periotrisjs`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/periotrisjs/app-c023ae50e07787ef8f3f.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/periotrisjs/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
