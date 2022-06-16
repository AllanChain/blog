import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import Unocss from 'unocss/vite'
import { presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  integrations: [svelte(), vue()],
  vite: {
    plugins: [
      Unocss({
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
        ],
      }),
    ],
  },
})
