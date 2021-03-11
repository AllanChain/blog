// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import store from '@/store'
import vuetify from '@/plugins/vuetify'
import goTo from 'vuetify/es5/services/goto'

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
  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900&display=swap'
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
}
