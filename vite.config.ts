import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { APP_VERSION } from './src/config/version.js'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'cils-version',
      transformIndexHtml(html) {
        return html.replaceAll('%APP_VERSION%', APP_VERSION)
      },
    },
    tailwindcss(),
    VitePWA({
      // 'prompt': a nova versão fica à espera e a app oferece a actualização no
      // banner (src/components/UpdateBanner.tsx). Nada de recarregamentos
      // surpresa a meio de uma prova.
      registerType: 'prompt',
      // O registo do service worker é feito pela app (src/App.tsx) para o
      // banner de nova versão — o plugin não injecta o script sozinho.
      injectRegister: null,
      includeAssets: ['favicon.svg', 'favicon-32.png', 'icon.svg', 'app-icons/**/*.{png,svg,ico}'],
      manifest: {
        name: 'CILS B1 Cittadinanza — Prep',
        short_name: 'CILS B1',
        description:
          'Estudo e simulação do exame oficial CILS B1 Cittadinanza (Università per Stranieri di Siena).',
        lang: 'pt-PT',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: '#ffffff',
        theme_color: '#0f766e',
        categories: ['education'],
        icons: [
          { src: `/icon.svg?v=${APP_VERSION}`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: `/app-icons/v${APP_VERSION}/icon-192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: `/app-icons/v${APP_VERSION}/icon-512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: `/app-icons/v${APP_VERSION}/apple-touch-icon.png`, sizes: '180x180', type: 'image/png', purpose: 'any' },
          { src: `/app-icons/v${APP_VERSION}/maskable-192.png`, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
          { src: `/app-icons/v${APP_VERSION}/maskable-512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Simular exame', short_name: 'Simulado', url: '/#/mock' },
          { name: 'Praticar', short_name: 'Prática', url: '/#/practice' },
          { name: 'Guia', short_name: 'Guia', url: '/#/guide' },
        ],
      },
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
      },
    }),
  ],
  build: {
    rolldownOptions: {
      output: {
        // As bibliotecas pesadas ficam em ficheiros próprios, para o browser
        // as cachear separadamente e o shell da app continuar pequeno.
        codeSplitting: {
          groups: [
            { name: 'dexie', test: /node_modules[\\/]dexie/ },
            { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
          ],
        },
      },
    },
    chunkSizeWarningLimit: 550,
  },
})
