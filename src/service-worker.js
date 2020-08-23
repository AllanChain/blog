import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { StaleWhileRevalidate, CacheFirst, Strategy } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'
import { WorkboxError } from 'workbox-core/_private/WorkboxError'

const manifest = self.__WB_MANIFEST
const precacheManifest = []
const runtimeManifest = []

for (const file of manifest) {
  if (file.url.endsWith('index.json')) runtimeManifest.push(file)
  else precacheManifest.push(file)
}

class InjectRevision extends Strategy {
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
      throw new WorkboxError('no-response', { url: request.url, error })
    }
    return response
  }
}

precacheAndRoute(precacheManifest)

// https://developers.google.com/web/tools/workbox/modules/workbox-cacheable-response#what_are_the_defaults
registerRoute(
  new RegExp('https://camo.githubusercontent.com/.*'),
  new StaleWhileRevalidate({ cacheName: 'GithHub' })
)
registerRoute(
  new RegExp('https://avatars\\d.githubusercontent.com/u/.*'),
  new CacheFirst({ cacheName: 'GithHub' })
)
registerRoute(
  new RegExp('/index.json$'),
  new InjectRevision({
    cacheName: 'Post-Data',
    plugins: [
      ExpirationPlugin({
        maxEntries: 20
      })
    ]
  })
)
registerRoute(
  new RegExp('https://(cdn.jsdelivr.net|fonts.(gstatic|googleapis).com)/.*'),
  new CacheFirst({ cacheName: 'CDN' })
)
