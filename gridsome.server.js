// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const githubData = require('./github.data')

module.exports = (api) => {
  api.chainWebpack((config, { isServer }) => {
    config.plugin('VuetifyLoaderPlugin').use(VuetifyLoaderPlugin)
    config.plugin('VuetifyLoaderPlugin').tap(args => [{
      progressiveImages: {
        sharp: true
      }
    }])
  })
  process.env.GRIDSOME_BASE_URL = api.config.publicPath
  const dataPromise = githubData()
  api.loadSource(async ({ addCollection, addSchemaTypes }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    addSchemaTypes(`
      type Post implements Node {
        title: String!,
        createdAt: Date!,
        lastEditedAt: Date!,
        slug: String!,
        summary: String,
        image: String,
        labels: [Label],
        body: String!
      }
    `)
    addSchemaTypes(`
      type Label implements Node {
        description: String,
        logo: String,
        name: String!,
        type: String!,
        color: String!
      }
    `)
    const { posts, labels } = await dataPromise
    const postCollection = addCollection('Post')
    const labelCollection = addCollection('Label')
    postCollection.addReference('labels', 'Label')

    for (const post of posts) postCollection.addNode(post)
    for (const label of labels) labelCollection.addNode(label)
  })

  api.createPages(({ createPage }) => {
    // Use the Pages API here: https://gridsome.org/docs/pages-api/
  })
}
