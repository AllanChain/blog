const fs = require('fs')
const { IgnorePlugin } = require('webpack')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')
const githubData = require('./src/api/server')
const { version } = require('./package.json')

module.exports = (api) => {
  process.env.GRIDSOME_BASE_URL = api.config.publicPath
  process.env.GRIDSOME_VERSION = version
  const dataPromise = githubData()
  api.chainWebpack(async (config, { isClient, isProd }) => {
    config.plugin('VuetifyLoaderPlugin').use(VuetifyLoaderPlugin)
    config.plugin('CopyPlugin').use(CopyPlugin, [{
      patterns: [
        { from: 'src/assets/.cache/images/', to: 'img' }
      ]
    }])
    config.plugin('IgnorePlugin').use(IgnorePlugin, [
      /(api\/server)/
    ])
    // We are not using g-image which uses url-loader,
    // we just need file-loader to get correct url
    config.module.rules.delete('images')

    if (isProd && isClient) {
      config.optimization.splitChunks({
        chunks: 'all',
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
            minSize: 10000,
            name: 'axios'
          }
        }
      })
      config.plugin('extract-css').tap(() => [{
        filename: 'assets/css/styles.[contenthash:8].css'
      }])

      config.output.filename('assets/js/[name].[contenthash:8].js')
      config.output.chunkFilename('assets/js/[name].[contenthash:8].js')

      if (process.env.WEBPACK_STATS) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
        config.plugin('BundleAnalyzerPlugin').use(BundleAnalyzerPlugin)
      }
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
