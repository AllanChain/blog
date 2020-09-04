<template>
  <v-container fluid>
    <v-row justify="center">
      <h2 class="pb-2">
        Blog Entries
      </h2>
    </v-row>
    <v-row justify="center">
      <v-col
        v-for="edge of $static.allLabel.edges"
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
        />
      </v-col>
    </v-row>

    <v-divider class="my-5" />
    <v-row justify="center">
      <h2 class="pb-2">
        Friends
      </h2>
    </v-row>
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

<static-query>
query {
  allLabel(filter: { type: { eq: "blog" } }) {
    edges {
      node {
        name
        description
        logo
        path
      }
    }
  }
}
</static-query>

<script>
import { capitalize } from '@/utils'
import { friends } from '@/.temp/extraData.json'
import HomeCard from '~/components/HomeCard'

export default {
  metaInfo: {
    title: 'Home'
  },
  components: {
    HomeCard
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
