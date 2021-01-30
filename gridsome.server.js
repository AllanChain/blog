// Server API makes it possible to hook into various parts of Gridsome
// on server-side and add custom data to the GraphQL data layer.
// Learn more: https://gridsome.org/docs/server-api/

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`
const { resolve: pathResolve } = require('path')
const { writeFile } = require('fs')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const githubData = require('./github.data')

module.exports = (api) => {
  process.env.GRIDSOME_BASE_URL = api.config.publicPath
  process.env.GRIDSOME_VERSION = process.env.npm_package_version
  const dataPromise = githubData()
  api.chainWebpack(async (config, { isClient, isProd }) => {
    config.plugin('VuetifyLoaderPlugin').use(VuetifyLoaderPlugin, [{
      progressiveImages: { sharp: true }
    }])
    if (isProd && isClient) {
      config.optimization.splitChunks({
        chunks: 'initial',
        maxInitialRequests: Infinity,
        cacheGroups: {
          vueVendor: {
            test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
            name: 'vue-vendors'
          },
          gridsome: {
            test: /[\\/]node_modules[\\/](gridsome|vue-meta)[\\/]/,
            name: 'gridsome-vendors'
          },
          polyfill: {
            test: /[\\/]node_modules[\\/]core-js[\\/]/,
            name: 'core-js'
          },
          axios: {
            test: /[\\/]node_modules[\\/]axios[\\/]/,
            name: 'axios'
          }
        }
      })
      config.plugin('extract-css').tap(() => [{
        filename: 'assets/css/styles.[contenthash:8].css'
      }])

      config.output.filename('assets/js/[name].[contenthash:8].js')
      config.output.chunkFilename('assets/js/[name].[contenthash:8].js')
    }
    config.module.rule('gql').test(/\.gql$/).use('gql').loader('raw-loader')

    /**
     * write temp file while configuring webpack
     * so that won't be deleted by gridsome
     * Also, at this time, .temp/ is already created
     */
    const { extraData } = await dataPromise

    writeFile(
      pathResolve(process.GRIDSOME.config.tmpDir, 'extraData.json'),
      JSON.stringify(extraData),
      err => { if (err) throw err }
    )
  })
  api.loadSource(async ({ addCollection, addSchemaTypes }) => {
    // Use the Data Store API here: https://gridsome.org/docs/data-store-api/
    addSchemaTypes(`
      type Post implements Node {
        id: ID!,
        title: String!,
        createdAt: Date!,
        lastEditedAt: Date!,
        slug: String!,
        summary: String,
        image: String,
        labels: [Label],
        body: String!,
        serializedHeadings: String!
      }
    `)
    addSchemaTypes(`
      type Label implements Node {
        id: ID!,
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
