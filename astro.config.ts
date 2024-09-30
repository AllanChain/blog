import { defineConfig } from 'astro/config'
import * as sass from 'sass'
import { setGlobalDispatcher, ProxyAgent } from 'undici'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import UnoCSS from 'unocss/astro'
import { colors } from 'unocss/preset-mini'

import sitemap from '@astrojs/sitemap'

if (process.env.https_proxy) {
  const dispatcher = new ProxyAgent({ uri: process.env.https_proxy })
  globalThis[Symbol.for('undici.globalDispatcher.1')] = dispatcher
}

export default defineConfig({
  site: 'https://allanchain.github.io',
  base: '/blog/',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      filter: (page) => page.includes('/post/') || page.endsWith('/blog/'),
    }),
    UnoCSS({
      injectReset: 'normalize.css',
      presets: [
        presetUno({ dark: 'media' }),
        presetAttributify(),
        presetIcons({
          extraProperties: {
            display: 'inline-block',
            'vertical-align': 'sub',
          },
        }),
      ],
      shortcuts: [
        [
          'icon-btn',
          'text-current cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100',
        ],
        [
          'dash-divider',
          'border-t-2 border-gray-400 dark:border-gray-600 border-t-dashed flex-grow h-0 mx-2',
        ],
        [
          'theme-link',
          'text-current decoration-none hover:decoration-dashed hover:decoration-underline',
        ],
      ],
      rules: [[/^grow-([\d.]+)$/, ([, d]) => ({ 'flex-grow': d })]],
    }),
  ],
  vite: {
    ssr: {
      noExternal: ['normalize.css'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          functions: {
            'theme-color($color, $shade)': function (args: sass.SassArgumentList[]) {
              const color = args[0].assertString()
              const shade = args[1].assertNumber().assertNoUnits()
              if (!(color.text in colors)) {
                throw `$color: ${color.text} not found.`
              }
              const colorShades = colors[color.text]
              if (!colorShades || typeof colorShades !== 'object') {
                throw `$color: ${color.text} not supported.`
              }
              if (!(shade.value in colorShades)) {
                throw `$shade: shade ${shade.value} not supported in ${color.text}`
              }
              const colorByte = parseInt(colorShades[shade.value].slice(1), 16)
              return new sass.SassColor({
                red: (colorByte >> 16) & 255,
                green: (colorByte >> 8) & 255,
                blue: colorByte & 255,
              })
            },
          },
        },
      },
    },
  },
})
