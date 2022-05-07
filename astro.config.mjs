import { defineConfig } from 'astro/config'
import svelte from '@astrojs/svelte'
import Unocss from 'unocss/vite'
import { presetUno, presetAttributify } from 'unocss'

export default defineConfig({
  integrations: [svelte()],
  vite: {
    plugins: [
      Unocss({
        presets: [presetUno(), presetAttributify()],
      }),
    ],
  },
})
