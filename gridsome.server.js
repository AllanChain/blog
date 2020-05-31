// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const nodeExternals = require('webpack-node-externals')
const github = require('./src/api/github')

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

  const dataPromise = github.data()
  api.loadSource(async ({ addCollection }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    const { posts, labels } = await dataPromise
    const postCollection = addCollection('Post')
    for (const post of posts) {
      console.log(post)
      postCollection.addNode(post)
    }
    const labelCollection = addCollection('Label')
    console.log(labels)
    for (const label of labels) {
      console.log(label)
      labelCollection.addNode(label)
    }
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
