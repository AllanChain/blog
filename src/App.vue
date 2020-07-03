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
  created () {
    this.$store.commit('setTitle',
      document.title.split(' - ').slice(0, -1).join(' - '))
  }
}
</script>
