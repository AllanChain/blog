<template>
  <v-app>
    <v-app-bar
      app
      dark
      color="primary"
    >
      <v-badge
        left
        dot
        overlap
        color="red"
        :value="$store.state.swStatus === 'updated'"
      >
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </v-badge>
      <v-toolbar-title class="pl-0">
        {{ $store.state.title }}
      </v-toolbar-title>
      <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        bottom
        color="teal darken-3"
      />
    </v-app-bar>
    <v-main class="ma-5">
      <slot />
    </v-main>
    <v-navigation-drawer
      v-model="drawer"
      height="100%"
      disable-resize-watcher
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
        <g-link class="text-decoration-none" to="/">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </g-link>
        <g-link class="text-decoration-none" to="/post/about">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-information-variant</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>About</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </g-link>
        <g-link class="text-decoration-none" to="/labels">
          <v-list-item link>
            <v-list-item-icon>
              <v-icon>mdi-label-multiple-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>All Labels</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </g-link>
        <v-list-item :disabled="!install" @click="install.prompt()">
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
        <!-- <v-divider />
        <v-list-item>
          <v-list-item-content>

          </v-list-item-content>
        </v-list-item> -->
      </v-list>
      <template #append>
        <v-divider />
        <div class="px-4 py-2 d-flex">
          <v-badge dot overlap color="red" :value="$store.state.swStatus === 'updated'">
            <v-chip outlined @click="reload">
              <v-icon small left>
                mdi-cogs
              </v-icon>
              v{{ version }} - {{ $store.state.swStatus }}
            </v-chip>
          </v-badge>
          <v-spacer />
          <ThemeToggle />
        </div>
      </template>
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
import ThemeToggle from '@/components/ThemeToggle'
import { loading } from '@/composables/usePageLoading'

export default {
  components: { ThemeToggle },
  setup () {
    return {
      loading
    }
  },
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
    },
    reload () {
      location.reload(true)
    }
  }
}
</script>

<style lang="sass">
header .v-toolbar__content
  padding-left: 0px

.clean-last-p p:last-of-type
  margin-bottom: 0px

.theme--dark
  ::-webkit-scrollbar
    background-color: #151515

  ::-webkit-scrollbar-thumb
    background-color: #454545
    &:hover
      background-color: #7a7a7a
    &:active
      background-color: #a6a6a6
</style>
