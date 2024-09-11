import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import commonjs from '@rollup/plugin-commonjs';
import viteCompression from 'vite-plugin-compression2';

export default defineConfig({
  base: '/seamless-chat-integration/',  // Set the base URL, useful for deployment in subdirectories
  server: {
    host: "::",  // Allow IPv6
    port: "8000",  // Set local dev server to port 8000
  },
  plugins: [
    react(),  // React support
    commonjs({
      include: /node_modules/,  // Handle CommonJS modules
    }),
    // Gzip Compression
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    // Brotli Compression (disabled in development)
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
      disable: process.env.NODE_ENV === 'development',  // Disable Brotli during development
    }), 
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),  // Alias '@' to 'src' directory
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),  // Alias 'lib' to 'lib' directory
      },
    ],
  },
  build: {
    target: 'esnext',  // Target modern browsers using ESNext
    minify: 'esbuild',  // Use esbuild for fast minification
    sourcemap: false,  // Disable sourcemaps in production
    commonjsOptions: {
      transformMixedEsModules: true,  // Handle mixed ES and CommonJS modules
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',  // Cache-busting entry file names
        chunkFileNames: '[name].[hash].js',  // Cache-busting chunk file names
        assetFileNames: '[name].[hash].[ext]',  // Cache-busting asset file names
        manualChunks(id) {
          // Vendor chunking logic
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';  // React-related libraries in 'react-vendor' chunk
            }
            if (id.includes('lodash')) {
              return 'lodash-vendor';  // Lodash in 'lodash-vendor' chunk
            }
            return 'vendor';  // All other node_modules go into 'vendor' chunk
          }
        },
      },
    },
    esbuild: {
      drop: ['console', 'debugger'],  // Drop console.logs and debugger statements in production
    },
  },
  css: {
    // No PostCSS configuration, autoprefixer removed
  },
  define: {
    'process.env': JSON.stringify(process.env),
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@react-google-maps/api', 'lodash'],  // Pre-bundle common dependencies
  },
});
