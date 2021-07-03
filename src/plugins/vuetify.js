import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

const vuetifyOptions = {
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    light: {
      anchor: '#1976D2'
    },
    dark: {
      anchor: '#2196F3'
    }
  }
}

export default new Vuetify(vuetifyOptions)
