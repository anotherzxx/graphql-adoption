import svelte from 'rollup-plugin-svelte'
import sveltePreprocess from 'svelte-preprocess'
import { defineConfig } from 'vite'
import windicss from 'vite-plugin-windicss'

export default defineConfig(({ mode }) => ({
  base: '/graphql-adoption/',

  build: {
    outDir: 'docs',
  },

  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
      emitCss: mode == 'production',
    }),

    windicss(),
  ],
}))
