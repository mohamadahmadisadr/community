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
    // Ensure proper build for SPA
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
