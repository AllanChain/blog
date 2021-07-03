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
import { ref, provide, onBeforeMount } from '@vue/composition-api'
import DefaultLayout from '@/layouts/Default'

export default {
  components: {
    DefaultLayout
  },
  setup () {
    const title = ref('AC Dustbin')

    provide('title', title)

    onBeforeMount(() => {
      title.value = document.title.split(' - ').slice(0, -1).join(' - ')
    })

    return { title }
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
        this.title = newInfo.titleChunk
      }
    }
  },
  beforeMount () {
  }
}
</script>
