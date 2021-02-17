const fs = require('fs')
const { IgnorePlugin } = require('webpack')
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
    config.plugin('IgnorePlugin').use(IgnorePlugin, [
      /(api\/server)/
    ])
    // Since we are using progressive image provided by vuetify-loader,
    // we need to use file loader to separate high-res image from js file,
    // using file-loader, not url-loader provided by gridsome
    config.module.rules.delete('images')
    /* eslint-disable indent */
    config.module.rule('lazy-images')
      // no `?vuetify-preload` query present
      .test(/\.(png|jpe?g|gif|webp)$/)
      .use('file-loader')
        .loader(require.resolve('file-loader'))
        .options({
          name: 'assets/img/[name].[contenthash:8].[ext]'
        })
    /* eslint-enable indent */
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
          },
          lowRes: {
            test: /assets[\\/].+\.(png|jpe?g|gif|webp)/,
            name: 'lowRes'
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
