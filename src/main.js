// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import goTo from 'vuetify/es5/services/goto'
import store from '@/store'
import vuetify from '@/plugins/vuetify'
import '@/plugins/composition-api'
import { startLoading } from '@/composables/usePageLoading'

export default function (Vue, { appOptions, router, head, isClient }) {
  if (isClient) {
    require('./registerServiceWorker')
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        macros: {
          ds: '\\displaystyle'
        }
      },
      svg: { fontCache: 'global' }
    }
  }

  Object.assign(appOptions, { vuetify, store })

  head.link.push({
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css'
  })

  router.options.scrollBehavior = (to, from, savedPosition) => {
    const target = savedPosition ? savedPosition.y : 0
    if (to.hash) return null
    setTimeout(() => goTo(target, {
      duration: 700,
      offset: 10,
      easing: 'easeInOutQuart'
    }), 500)
  }
  router.beforeEach((to, from, next) => {
    if (!to.hash) { startLoading() }
    next()
  })
}
