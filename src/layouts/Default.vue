<template>
  <v-app>
    <v-app-bar
      app
      dark
      color="primary"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title class="pl-0">
        {{ $store.state.title }}
      </v-toolbar-title>
    </v-app-bar>
    <v-main class="ma-5">
      <slot />
    </v-main>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list shaped>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              {{ $static.metadata.siteName }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          to="/"
        >
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link to="/labels">
          <v-list-item-icon>
            <v-icon>mdi-label-multiple-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>All Labels</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item @click="install && install.prompt()">
          <v-list-item-icon>
            <v-icon>mdi-plus-circle-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Add to Homescreen</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          link
          :href="profileUrl"
          target="_blank"
          rel="noopener"
        >
          <v-list-item-icon>
            <v-icon>mdi-github</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Follow Me</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider />
        <v-list-item>
          <v-list-item-content>
            <span>
              <v-icon small>
                mdi-cogs
              </v-icon>
              v{{ version }} - {{ $store.state.swStatus }}
            </span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </v-app>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
import { profileUrl } from '@/config'

export default {
  data () {
    return {
      drawer: false,
      install: false,
      profileUrl,
      version: process.env.GRIDSOME_VERSION
    }
  },
  beforeMount () {
    window.addEventListener('beforeinstallprompt', this.installPrompt)
  },
  beforeDestroy () {
    window.removeEventListener('beforeinstallprompt', this.installPrompt)
  },
  methods: {
    installPrompt (e) {
      console.log('Receive install prompt')
      this.install = e
      e.preventDefault()
    }
  }
}
</script>

<style lang="sass">
.v-card__title
  word-break: normal !important

.clean-last-p p:last-of-type
  margin-bottom: 0px

*
  & ::-webkit-scrollbar
    width: 4px
    height: 4px
  & ::-webkit-scrollbar-thumb
    background-color: slategray
    border-radius: 2px
</style>
