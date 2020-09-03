/* eslint-env worker */
/* eslint-disable no-undef */
importScripts('http://storage.googleapis.com/workbox-cdn/releases/6.0.0-alpha.2/workbox-sw.js')

const manifest = self.__WB_MANIFEST
const precacheManifest = []
const runtimeManifest = []

for (const file of manifest) {
  if (file.url.endsWith('index.json')) runtimeManifest.push(file)
  else precacheManifest.push(file)
}

class InjectRevision extends workbox.strategies.Strategy {
  async _handle (request, handler) {
    let injectedUrl, response, error
    const urlToMatch = request.url.match(new RegExp('.*?://.*?(/.*)'))[1]
    console.log(urlToMatch)
    for (const file of runtimeManifest) {
      console.log(file.url)
      if (file.url === urlToMatch) {
        injectedUrl = `${request.url}?__REVISION__=${file.revision}`
        response = await handler.cacheMatch(injectedUrl)
        break
      }
    }
    if (!response) { // cache fail
      try {
        if (!injectedUrl) response = await fetch(request)
        else response = await handler.fetchAndCachePut(injectedUrl)
      } catch (err) {
        error = err
      }
    }
    if (!response) { // fetch fail
      throw new Error('no-response', { url: request.url, error })
    }
    return response
  }
}

workbox.precaching.precacheAndRoute(precacheManifest)
self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting())
})

// https://developers.google.com/web/tools/workbox/modules/workbox-cacheable-response#what_are_the_defaults
workbox.routing.registerRoute(
  new RegExp('https://camo.githubusercontent.com/.*'),
  new workbox.strategies.StaleWhileRevalidate({ cacheName: 'GithHub' })
)
workbox.routing.registerRoute(
  new RegExp('https://avatars\\d.githubusercontent.com/u/.*'),
  new workbox.strategies.CacheFirst({ cacheName: 'GithHub' })
)
workbox.routing.registerRoute(
  new RegExp('/index.json$'),
  new InjectRevision({
    cacheName: 'Post-Data',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 20
      })
    ]
  })
)
workbox.routing.registerRoute(
  new RegExp('https://(cdn.jsdelivr.net|fonts.(gstatic|googleapis).com)/.*'),
  new workbox.strategies.CacheFirst({ cacheName: 'CDN' })
)
