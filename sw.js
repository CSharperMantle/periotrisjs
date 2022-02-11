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
    "url": "webpack-runtime-ef229b921911f9022e6b.js"
  },
  {
    "url": "framework-7508fd33fe8296fa2642.js"
  },
  {
    "url": "app-65f65b9f8c8b7c87fd59.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "f5cc4fb5fb4e4c1f8a73272715350e9f"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-c2e11fc74135e78b6852.js"
  },
  {
    "url": "page-data/offline-plugin-app-shell-fallback/page-data.json",
    "revision": "f2c002077289a7e1ac538802bc7f5314"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "3a127d7ea7fc3a80a9fd2ca9c45b8abb"
  },
  {
    "url": "polyfill-989133dfb877c157a5b1.js"
  },
  {
    "url": "styles.e590b94683fdfc799bc6.css"
  },
  {
    "url": "91cfaedf-c7e8b5c05ce6ddd0116f.js"
  },
  {
    "url": "d3f64cdae943beef961c5b15e4ddeda8ecf768a6-895f966ea48de03cebfd.js"
  },
  {
    "url": "component---src-pages-index-tsx-af7d85f3cd706e78576a.js"
  },
  {
    "url": "page-data/index/page-data.json",
    "revision": "eddd9c865bdb939f461ee910691733c6"
  },
  {
    "url": "page-data/sq/d/1170113242.json",
    "revision": "669d701cd51ef6088adcf5a96cccb3c2"
  },
  {
    "url": "page-data/sq/d/3992131839.json",
    "revision": "76082772208e7ac9eab1b6150eb379de"
  },
  {
    "url": "component---src-pages-404-tsx-218ca40b0161d34bd3f3.js"
  },
  {
    "url": "page-data/404/page-data.json",
    "revision": "7449638f29c4db0eb50a6f66c8ed4208"
  },
  {
    "url": "component---src-pages-about-tsx-1adf5961198bfb774d2c.js"
  },
  {
    "url": "page-data/about/page-data.json",
    "revision": "18918e35f592db9c7bdc0abf604a01ee"
  },
  {
    "url": "page-data/sq/d/3387501435.json",
    "revision": "2e319681c52c4aa2220c447b02802b9c"
  },
  {
    "url": "component---src-pages-game-tsx-53094a383010af391d58.js"
  },
  {
    "url": "page-data/game/page-data.json",
    "revision": "1e55643c2a51a506093b271d81edb24e"
  },
  {
    "url": "component---src-pages-settings-tsx-4f2bf9ec5c68d9f50174.js"
  },
  {
    "url": "page-data/settings/page-data.json",
    "revision": "115ef8e593b564fbf53bba5d6643b775"
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
  if (!resources || !(await caches.match(`/periotrisjs/app-65f65b9f8c8b7c87fd59.js`))) {
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
