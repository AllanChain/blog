<template>
  <default-layout>
    <v-slide-x-transition>
      <router-view />
    </v-slide-x-transition>
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
    this.$store.commit('setTitle',
      document.title.split(' - ').slice(0, -1).join(' - '))
    if (location.hash) {
      this.$vuetify.goTo(location.hash, {
        duration: 700,
        /**
         * `offset` take app bar into account
         * to keep up with browser handler,
         * set it negtive bar height
         */
        offset: -56,
        easing: 'easeInOutQuart'
      })
    }
  }
}
</script>
