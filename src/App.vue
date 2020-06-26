<template>
  <default-layout>
    <v-scroll-y-transition>
      <router-view />
    </v-scroll-y-transition>
  </default-layout>
</template>

<static-query>
  query {
    metadata {
      siteName
      siteDescription
    }
  }
</static-query>

<script>
import DefaultLayout from '@/layouts/Default'

export default {
  components: {
    DefaultLayout
  },
  metaInfo () {
    return {
      title: this.$static.metadata.siteName,
      meta: [
        {
          key: 'description',
          name: 'description',
          content: this.$static.metadata.siteDescription
        }
      ],
      changed: newInfo => {
        this.$store.commit('setTitle', newInfo.titleChunk)
      }
    }
  },
  mounted () {
    if (location.hash) this.goToHash(location.hash.slice(1))
    window.onhashchange = this.handleHash.bind(this)
  },
  methods: {
    /**
     * Two method below are handling hash
     * more info at github.data.js
     */
    goToHash (hash) {
      this.$vuetify.goTo(`#article-${hash}`, {
        duration: 700,
        offset: 120,
        easing: 'easeInOutQuart'
      })
    },
    handleHash () {
      if (location.hash.startsWith('#~')) {
        const hash = location.hash.slice(2)
        this.goToHash(hash)
        location.hash = `#${hash}`
      }
    }
  }
}
</script>
