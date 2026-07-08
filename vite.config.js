import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'SLOGAN.png', 'Fichier 1.png', 'filigrane .png'],
      manifest: {
        name: 'Bon de Caisse Numérique – DRONEK',
        short_name: 'BonCaisse',
        description: 'Application de gestion des bons de caisse DRONEK',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#149655',
        lang: 'fr',
        icons: [
          {
            src: '/SLOGAN.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/SLOGAN.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Mise en cache des ressources statiques
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Cache API Laravel (lecture seule – stale-while-revalidate)
            urlPattern: /^http:\/\/localhost:8000\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 h
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
