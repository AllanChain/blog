// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api

import store from '@/store'
import vuetify from '@/plugins/vuetify'
import './style.sass'
import DefaultLayout from '~/layouts/Default.vue'

export default function (Vue, { appOptions, router, head, isClient }) {
  Object.assign(appOptions, { vuetify, store })

  head.link.push({
    rel: 'stylesheet',
    href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css'
  })

  head.link.push({
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900'
  })

  // Set default layout as a global component
  Vue.component('Layout', DefaultLayout)
}
