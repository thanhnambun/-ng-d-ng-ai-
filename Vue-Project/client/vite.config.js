import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  
  // Path resolution
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url)),
      '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
      '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
      '@stores': fileURLToPath(new URL('./src/store', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@styles': fileURLToPath(new URL('./src/styles', import.meta.url)),
    },
  },
  
  // Development server
  server: {
    port: 5173,
    host: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  
  // Build optimization
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps in development
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Reduce bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
      },
    },
    
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-vue': ['vue', 'vue-router', 'vuex'],
          'vendor-ui': ['sweetalert2'],
          'vendor-icons': ['@fortawesome/fontawesome-svg-core', '@fortawesome/vue-fontawesome'],
          'vendor-utils': ['axios', 'crypto-js'],
          
          // Firebase chunk (if used)
          'vendor-firebase': ['firebase/app', 'firebase/analytics'],
        },
        
        // File naming for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    
    // Asset size warnings
    chunkSizeWarningLimit: 1000,
  },
  
  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
        charset: false,
      },
    },
    // PostCSS plugins are configured in postcss.config.js
    postcss: {
      plugins: [],
    },
  },
  
  // Environment variables prefix
  envPrefix: 'VITE_APP_',
  
  // Optimizations
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'vuex',
      'axios',
      'sweetalert2',
      '@fortawesome/vue-fontawesome',
    ],
    exclude: ['@vitejs/plugin-vue'],
  },
  
  // Preview server (for build preview)
  preview: {
    port: 4173,
    host: true,
  },
})