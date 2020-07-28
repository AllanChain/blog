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
  outputDir: 'blog',
  templates: {
    Post: '/post/:slug',
    Label: '/:type/:name'
  },
  css: {
    split: true
  },
  cacheBusting: false,
  configureWebpack: { plugins },
  plugins: [{
    use: '@allanchain/gridsome-plugin-pwa',
    options: {
      manifestPath: 'manifest.json',
      name: 'AC Dustbin',
      themeColor: '#1976d2',
      icon: 'src/favicon.png',
      maskableIcon: true,
      manifestOptions: {
        short_name: 'AC Dustbin',
        description: 'AllanChain\'s Dustbin',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff'
      },
      workboxOptions: {
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: new RegExp('https://camo.githubusercontent.com/.*'),
            handler: 'StaleWhileRevalidate',
            options: { // Images don't support CORS
              cacheName: 'GithHub-Images',
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: new RegExp('https://avatars\\d.githubusercontent.com/u/.*'),
            handler: 'CacheFirst',
            options: { // Avatars support CORS
              cacheName: 'GithHub-Avatars',
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          {
            urlPattern: new RegExp('/(index.json)?$'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'Post-Data',
              cacheableResponse: {
                statuses: [200]
              }
            }
          },
          {
            urlPattern: new RegExp('https://(cdn.jsdelivr.net|fonts.(gstatic|googleapis).com)/.*'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'Vuetify',
              cacheableResponse: {
                statuses: [200]
              }
            }
          }
        ]
      }
    }
  }]
}
