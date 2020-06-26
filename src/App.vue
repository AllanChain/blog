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
  }
}
</script>
