import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import csso from 'csso'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  theme: {
    options: {
      minifyTheme: css => csso.minify(css).css
    }
  }
})
