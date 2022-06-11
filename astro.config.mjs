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
      }),
    ],
  },
})
