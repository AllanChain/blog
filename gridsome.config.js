// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

const plugins = []
if (process.env.WEBPACK_STATS) {
  const { StatsWriterPlugin } = require('webpack-stats-plugin')
  plugins.push(new StatsWriterPlugin({
    fields: null,
    stats: { chunkModules: true }
  }))
}

module.exports = {
  siteName: 'AC Dustbin',
  siteUrl: 'https://allanchian.github.io',
  pathPrefix: '/blog',
  plugins: [],
  templates: {
    Post: '/post/:slug',
    Label: '/:type/:name'
  },
  configureWebpack: { plugins }
}
