import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import uno from 'astro-uno'
import { presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  site: 'https://allanchain.github.io',
  // base: '/blog',
  trailingSlash: 'always',
  integrations: [
    svelte(),
    vue(),
    uno({
      presets: [presetUno(), presetAttributify(), presetIcons()],
      shortcuts: [
        [
          'icon-btn',
          'text-current cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100',
        ],
        [
          'dash-divider',
          'border-t-2 border-gray-400 border-t-dashed flex-grow h-0 mx-2',
        ],
        ['icon', 'inline-block relative top-0.18em'],
      ],
      rules: [[/^grow-([\d.]+)$/, ([, d]) => ({ 'flex-grow': d })]],
    }),
  ],
})
