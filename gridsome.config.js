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
    split: true,
    loaderOptions: {
      sass: {
        additionalData: "@import '@/styles/variables.scss'"
      }
    }
  },
  cacheBusting: false,
  plugins: [{
    use: '@allanchain/gridsome-plugin-pwa',
    options: {
      manifestPath: 'manifest.json',
      name: 'AC Dustbin',
      themeColor: '#1976d2',
      icon: {
        androidChrome: [
          {
            src: './src/icon-maskable.png',
            sizes: [512, 384, 192, 144],
            purpose: 'maskable'
          },
          {
            sizes: [512, 384, 192, 144, 96, 72, 48],
            purpose: 'any'
          }
        ]
      },
      manifestOptions: {
        short_name: 'AC Dustbin',
        description: 'AllanChain\'s Dustbin',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff'
      },
      appShellPath: 'offline/index.html',
      workboxPluginMode: 'generateSW',
      workboxOptions: {
        globPatterns: ['assets/@(js|css)/*', 'offline/index.html'],
        navigateFallback: '/blog/offline/index.html',
        navigateFallbackAllowlist: [/\/$/],
        runtimeCaching: [
          {
            urlPattern: new RegExp('/img/.*'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'GithHub',
              expiration: { maxEntries: 20 }
            }
          },
          {
            urlPattern: new RegExp('/index.json$'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'Post-Data',
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 20 }
            }
          },
          {
            urlPattern: new RegExp('https://(cdn\\.jsdelivr\\.net|fonts\\.(gstatic|googleapis)\\.com)/.*'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'CDN',
              expiration: { maxEntries: 5 }
            }
          }
        ]
      }
    }
  }]
}
