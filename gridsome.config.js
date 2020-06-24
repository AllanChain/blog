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
  templates: {
    Post: '/post/:slug',
    Label: '/:type/:name'
  },
  configureWebpack: { plugins },
  plugins: [{
    use: 'gridsome-plugin-pwa',
    options: {
      // Service Worker Options
      disableServiceWorker: false,
      serviceWorkerPath: 'service-worker.js',
      cachedFileTypes: 'js,json,css,html,png,jpg,jpeg,svg,gif',
      disableTemplatedUrls: false, // Optional
      manifestPath: 'manifest.json',
      title: 'AC Dustbin',
      startUrl: '.',
      display: 'standalone',
      statusBarStyle: 'default',
      themeColor: '#666600',
      backgroundColor: '#ffffff',
      icon: 'src/favicon.png'
      // shortName: 'AC Dustbin', // Optional
      // description: 'AllanChain\'s Dustbin', // Optional
      // gcmSenderId: undefined, // Optional
      // // Standard Meta Tags
      // svgFavicon: 'favicon.png', // Optional. Requires favicon.ico fallback
      // // Microsoft Windows Meta Tags
      // msTileColor: '#666600', // Optional
      // // Apple MacOS Meta Tags
      // appleMaskIcon: 'favicon.png', // Optional
      // appleMaskIconColor: '#666600' // Optional
    }
  }]
}
