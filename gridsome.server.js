// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const nodeExternals = require('webpack-node-externals')
const githubData = require('./github.data')

module.exports = (api) => {
  api.chainWebpack((config, { isServer }) => {
    if (isServer) {
      config.externals([
        nodeExternals({
          whitelist: [/^vuetify/]
        })
      ])
    }
  })
  process.env.GRIDSOME_BASE_URL = api.config.publicPath
  const dataPromise = githubData()
  api.loadSource(async ({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    const { posts, labels } = await dataPromise
    const postCollection = addCollection('Post')
    const tagCollection = addCollection('Tag')
    const blogCollection = addCollection('Blog')
    postCollection.addReference('tag', 'Tag')
    postCollection.addReference('blog', 'Blog')

    for (const post of posts) {
      postCollection.addNode(post)
    }
    for (const tag of labels.tag) {
      console.log(tag)
      tagCollection.addNode(tag)
    }
    for (const blog of labels.blog) {
      console.log(blog)
      blogCollection.addNode(blog)
    }
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
