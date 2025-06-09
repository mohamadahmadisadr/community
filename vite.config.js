import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Handle client-side routing during development
    historyApiFallback: true,
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Ensure proper build for SPA
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@mui/system',
            '@emotion/react',
            '@emotion/styled'
          ],
          'vendor-firebase': [
            'firebase/app',
            'firebase/firestore',
            'firebase/auth',
            'firebase/storage'
          ],
          // App chunks
          'components-common': [
            './src/components/common/PaginationComponent.jsx',
            './src/components/common/InfiniteScrollComponent.jsx',
            './src/utils/contactUtils.js'
          ],
          'components-dining': [
            './src/components/dining/DiningPage.jsx',
            './src/components/restaurants/RestaurantDetailPage.jsx',
            './src/components/cafes/CafeDetailPage.jsx'
          ],
          'components-events': [
            './src/components/events/EventsPage.jsx',
            './src/components/events/EventDetailPage.jsx'
          ],
          'components-jobs': [
            './src/pages/HomePage.jsx',
            './src/components/JobDetail/JobDetailComponent.jsx'
          ]
        },
      },
    },
  },
})
