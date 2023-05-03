import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import UnoCSS from 'unocss/astro'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import { colors } from 'unocss/preset-mini'
import sass from 'sass'

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
        ['card-container', 'flex flex-wrap items-center justify-evenly'],
        ['card-item', 'm-1 w-xs grow-0.3'],
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
          functions: {
            'theme-color($color, $shade)': function (color, shade) {
              if (!(color instanceof sass.types.String)) {
                throw '$color: Expected a string.'
              }
              if (!(shade instanceof sass.types.Number)) {
                throw '$shade: Expected a number.'
              }
              if (shade.getUnit()) {
                throw '$shade: Expected a unitless number.'
              }
              const colorName = color.getValue()
              if (!(colorName in colors)) {
                throw `$color: ${colorName} not found.`
              }
              const colorShades = colors[colorName]
              if (!colorShades || typeof colorShades !== 'object') {
                throw `$color: ${colorName} not supported.`
              }
              const shadeValue = shade.getValue()
              if (!(shadeValue in colorShades)) {
                throw `$shade: shade ${shadeValue} not supported in ${colorName}`
              }
              const colorByte = parseInt(colorShades[shadeValue].slice(1), 16)
              return new sass.types.Color(colorByte + 0xff000000)
            },
          },
        },
      },
    },
  },
})
