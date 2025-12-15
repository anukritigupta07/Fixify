import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// ✅ Vite configuration with full backend proxy setup
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
    proxy: {
      '/maps': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/bookings': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
      '/payment': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
