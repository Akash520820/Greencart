import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // IMPORTANT: Replace 'your-repo-name' with your actual GitHub repository name
  // For example: if your repo is 'greencart-client', use '/greencart-client/'
  base: process.env.NODE_ENV === 'production' ? '/Greencart/' : '/',
  
  // Build optimizations
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['bootstrap', 'react-icons', 'react-hot-toast'],
        }
      }
    }
  },
  
  // Development server
  server: {
    port: 5173,
    host: true,
    open: true,
  },
  
  // Preview server
  preview: {
    port: 4173,
    host: true,
  },
})