import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const vuetifyOptions = {
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    light: {
      secondary: '#3F51B5',
      anchor: '#1976D2'
    },
    dark: {
      secondary: '#7986CB',
      anchor: '#2196F3'
    }
  }
}

if (process.isServer) {
  const csso = require('csso')
  vuetifyOptions.theme.options = {
    minifyTheme: css => csso.minify(css).css
  }
}

export default new Vuetify(vuetifyOptions)
