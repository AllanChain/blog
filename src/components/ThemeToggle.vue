<template>
  <v-btn
    icon
    @click="$vuetify.theme.dark = !$vuetify.theme.dark"
  >
    <v-icon>mdi-brightness-{{ $vuetify.theme.dark ? '4' : '7' }}</v-icon>
  </v-btn>
</template>

<script>
export default {
  watch: {
    '$vuetify.theme.dark' (val) {
      localStorage.setItem('vuetify__dark', val)
      // toggle(token [, force]) force add or force remove
      document.documentElement.classList.toggle('theme--dark', val)
    }
  },
  beforeMount () {
    let darkTheme = localStorage.getItem('vuetify__dark')

    if (darkTheme === null) {
      try {
        darkTheme = matchMedia('(prefers-color-scheme: dark)')
          .matches.toString()
      } catch (err) {
        console.warn('Fail to detect prefered colorscheme!')
      }
    }
    this.$vuetify.theme.dark = darkTheme === 'true'
  }
}
</script>
