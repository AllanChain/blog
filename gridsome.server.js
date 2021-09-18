const fs = require('fs')
const { execSync } = require('child_process')
const { IgnorePlugin } = require('webpack')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { PurgeCSS } = require('purgecss')
const fg = require('fast-glob')
const githubData = require('./src/api/server')
const resolvers = require('./src/api/server/resolvers')
const { version } = require('./package.json')

const revision = execSync('git rev-parse --short HEAD').toString().trim()

module.exports = (api) => {
  process.env.GRIDSOME_BASE_URL = api.config.publicPath
  process.env.GRIDSOME_VERSION = `${version}+${revision}`
  const dataPromise = githubData()
  api.chainWebpack(async (config, { isClient, isProd }) => {
    config.plugin('VuetifyLoaderPlugin').use(VuetifyLoaderPlugin)
    config.plugin('CopyPlugin').use(CopyPlugin, [{
      patterns: [
        { from: 'src/assets/.cache/images/', to: 'img' }
      ]
    }])
    config.plugin('IgnorePlugin').use(IgnorePlugin, [{
      resourceRegExp: /(api\/server)/
    }])

    if (isProd && isClient) {
      config.optimization.splitChunks({
        chunks: 'all',
        maxInitialRequests: Infinity,
        cacheGroups: {
          vueVendor: {
            test: /[\\/]node_modules[\\/](vue|vue-router)[\\/]/,
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
          },
          styles: {
            name: 'styles',
            test: m => /css\/mini-extract/.test(m.type),
            chunks: 'all',
            enforce: true
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
  api.loadSource(async ({
    addCollection,
    addSchemaTypes,
    addSchemaResolvers
  }) => {
    addSchemaTypes(fs.readFileSync('./blog.schema.gql'))
    const { posts, labels } = await dataPromise
    const postCollection = addCollection('Post')
    const labelCollection = addCollection('Label')
    postCollection.addReference('labels', 'Label')

    addSchemaResolvers(resolvers)

    for (const post of posts) postCollection.addNode(post)
    for (const label of labels) labelCollection.addNode(label)
  })
  api.afterBuild(async () => {
    // purge embedded css
    const files = await fg(['blog/**/*.html'])
    Promise.all(files.map(async file => {
      let html = fs.readFileSync(file, 'utf-8')
      let vuetifyCSS
      // Two purpose replacing with a placeholder:
      // - Easy replace again after async handler return
      // - Remove selectors PurgeCSS will otherwise consider used
      html = html.replace(
        /(<style .+? id="vuetify-theme-stylesheet" .+?>)([^]+?)<\/style>/,
        (match, tag, css) => {
          vuetifyCSS = css
          return `${tag}<%= VUETIFY_CSS %></style>`
        }
      )
      const result = await new PurgeCSS().purge({
        content: [{
          raw: html,
          extension: 'html'
        }],
        css: [{
          raw: vuetifyCSS
        }]
      })
      html = html.replace('<%= VUETIFY_CSS %>', result[0].css)
      fs.writeFileSync(file, html, { encoding: 'utf-8' })
    }))
    // purge external css
    const purgeResults = await new PurgeCSS().purge({
      content: ['blog/**/*.html', 'src/**/*.vue'],
      css: ['blog/assets/css/*'],
      output: 'blog/assets/css/'
    })

    for (const purgeResult of purgeResults) {
      fs.writeFileSync(purgeResult.file, purgeResult.css, { encoding: 'utf-8' })
    }
  })
}
