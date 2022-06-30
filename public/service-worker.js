// It just unregisters the old one

self.registration
  .unregister({ immediate: true })
  .then(function () {
    return self.clients.matchAll()
  })
  .then(function (clients) {
    clients.forEach((client) => client.navigate(client.url))
  })
