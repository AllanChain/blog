<template>
  <v-container fluid>
    <v-alert
      class="py-2"
      border="left"
      color="amber darken-3"
      icon="mdi-gold"
      outlined
    >
      <span class="d-inline-block my-1">
        We will glow in the dark turning dust to gold.
      </span>
      <span class="float-right my-1">
        <v-icon color="primary">mdi-video</v-icon>
        <a
          class="text-decoration-none"
          target="blank"
          rel="noopener"
          href="https://www.bilibili.com/video/bv14h411R7iL"
        >
          Dream It Possible
        </a>
      </span>
    </v-alert>
    <HomeHeader>Blog Entries</HomeHeader>
    <v-row justify="center">
      <v-col
        v-for="edge of $page.allLabel.edges"
        :key="edge.node.id"
        cols="12"
        sm="6"
        md="4"
      >
        <HomeCard
          :name="capitalize(edge.node.name)"
          :to="edge.node.path"
          :description="edge.node.description"
          :logo="edge.node.logo"
          :logo-lazy="edge.node.logoLazy"
        />
      </v-col>
    </v-row>

    <HomeHeader>Friends</HomeHeader>
    <v-row justify="center">
      <v-col
        v-for="friend of friends"
        :key="friend.name"
        cols="12"
        sm="6"
        md="4"
      >
        <HomeCard
          :name="friend.name"
          :href="friend.blog"
          :logo="friend.avatar"
          :description="friend.moto"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<page-query>
query {
  allLabel(filter: { type: { eq: "blog" } }) {
    edges {
      node {
        name
        description
        logo
        logoLazy
        path
      }
    }
  }
}
</page-query>

<script>
import { capitalize } from '@/utils'
import { friends } from '@/assets/.cache/extra.json'
import HomeCard from '~/components/HomeCard'
import HomeHeader from '@/components/HomeHeader'

export default {
  metaInfo: {
    title: 'AC Dustbin'
  },
  components: {
    HomeCard,
    HomeHeader
  },
  data () {
    return {
      friends
    }
  },
  methods: { capitalize }
}
</script>

<style>

</style>
