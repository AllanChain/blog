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
      profileUrl
    }
  }
}
</script>

<style>

</style>
