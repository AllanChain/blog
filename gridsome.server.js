const fs = require('fs')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const githubData = require('./src/api/server')
const { version } = require('./package.json')

module.exports = (api) => {
  process.env.GRIDSOME_BASE_URL = api.config.publicPath
  process.env.GRIDSOME_VERSION = version
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
  })
  api.loadSource(async ({ addCollection, addSchemaTypes }) => {
    addSchemaTypes(fs.readFileSync('./blog.schema.gql'))
    const { posts, labels } = await dataPromise
    const postCollection = addCollection('Post')
    const labelCollection = addCollection('Label')
    postCollection.addReference('labels', 'Label')

    for (const post of posts) postCollection.addNode(post)
    for (const label of labels) labelCollection.addNode(label)
  })
}
