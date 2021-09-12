<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="5">
        <v-img
          class="rounded-circle mx-auto my-4"
          :src="`${baseURL}avatar/300.jpg`"
          :lazy-src="`${baseURL}avatar/37.png`"
          max-width="250"
        />
      </v-col>
      <v-col cols="12" md="6" class="d-table">
        <div style="vertical-align: middle" class="d-table-cell">
          <p class="text-h6">
            Hi! Thanks for your interest in my blog!
          </p>
          <p>
            I'm Allan Chain, a programming hobbyist and open source lover.
            My primary programming languages are
            <v-icon>mdi-language-python</v-icon> Python and
            <v-icon>mdi-language-javascript</v-icon> JavaScript.
            I'm also having (or had) "fun" with
            <span
              v-for="icon of [
                'mdi-docker',
                'mdi-manjaro',
                'mdi-raspberry-pi',
                'mdi-minecraft',
                'mdi-language-java',
                'mdi-language-go',
                'mdi-language-rust'
              ]"
              :key="icon"
            >
              <v-icon>{{ icon }}</v-icon>
            </span>
          </p>
          <p>
            This blog mainly hosts my notes when programming,
            as well as some other interesting bits.
          </p>
        </div>
      </v-col>
      <v-col cols="0" md="1" />
    </v-row>
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
    <HomeHeader>Recent Updates</HomeHeader>
    <v-row>
      <v-col
        v-for="edge of $page.allPost.edges"
        :key="edge.node.id"
        cols="12"
        sm="6"
        md="4"
      >
        <PostPreview :post="edge.node" />
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
  allPost(sortBy: "lastEditedAt", limit: 3) {
    edges {
      node {
        id
        title
        path
        summary
        createdAt
        lastEditedAt
        image
        imageLazy
        logo {
          src
          lazySrc
        }
        labels {
          id
          type
          color
          name
          path
        }
      }
    }
  }
}
</page-query>

<script>
import { capitalize } from '@/utils'
import extraData from '@/assets/.cache/extra.json'
import HomeCard from '@/components/HomeCard'
import HomeHeader from '@/components/HomeHeader'
import PostPreview from '@/components/PostPreview'
import { useLoadNotifier } from '@/composables/usePageLoading'

const { friends } = extraData

export default {
  metaInfo: {
    title: 'AC Dustbin'
  },
  components: {
    HomeCard,
    HomeHeader,
    PostPreview
  },
  setup () {
    useLoadNotifier()
  },
  data () {
    return {
      friends,
      baseURL: process.env.GRIDSOME_BASE_URL
    }
  },
  methods: { capitalize }
}
</script>

<style>

</style>
