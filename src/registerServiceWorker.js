import { register } from 'register-service-worker'
import store from './store'

register(`${process.env.GRIDSOME_BASE_URL}service-worker.js`, {
  ready () {
    console.log(
      'App is being served from cache by a service worker.\n' +
      'For more details, visit https://goo.gl/AFskqB'
    )
  },
  registered () {
    store.commit('swUpdate', 'registered')
    console.log('Service worker has been registered.')
  },
  cached () {
    store.commit('swUpdate', 'cached')
    console.log('Content has been cached for offline use.')
  },
  updatefound () {
    store.commit('swUpdate', 'updateFound')
    console.log('New content is downloading.')
  },
  updated () {
    store.commit('swUpdate', 'updated')
    console.log('New content is available; please refresh.')
  },
  offline () {
    store.commit('swUpdate', 'offline')
    console.log('No internet connection found. App is running in offline mode.')
  },
  error (error) {
    store.commit('swUpdate', 'error')
    console.error('Error during service worker registration:', error)
  }
})
