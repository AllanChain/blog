import { register } from 'register-service-worker'
import { ref } from '@vue/composition-api'

export function useServiceWorker () {
  const updatable = ref(false)

  if (process.isClient && process.env.NODE_ENV === 'production') {
    register(`${process.env.GRIDSOME_BASE_URL}service-worker.js`, {
      updated () {
        updatable.value = true
      },
      error (error) {
        console.error('Error during service worker registration:', error)
      }
    })
  }
  return {
    updatable,
    async skipWaiting () {
      if (!updatable.value) return
      const swr = await navigator.serviceWorker.getRegistration()
      if (!swr.waiting) return

      swr.waiting.onstatechange = function () {
        if (this.state === 'activated') {
          location.reload()
        }
      }
      swr.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }
}
