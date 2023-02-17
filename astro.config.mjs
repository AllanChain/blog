import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import UnoCSS from '@unocss/astro'
import { presetUno, presetAttributify, presetIcons } from 'unocss'

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
      presets: [presetUno({ dark: 'media' }), presetAttributify(), presetIcons()],
      shortcuts: [
        [
          'icon-btn',
          'text-current cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100',
        ],
        [
          'dash-divider',
          'border-t-2 border-gray-400 dark:border-gray-600 border-t-dashed flex-grow h-0 mx-2',
        ],
        ['icon', 'inline-block vertical-sub'],
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
  },
})
