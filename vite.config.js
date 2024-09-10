import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import commonjs from '@rollup/plugin-commonjs';
import viteCompression from 'vite-plugin-compression2';

export default defineConfig({
  server: {
    host: "::",
    port: "8000",
  },
  plugins: [
    react(),
    commonjs({
      include: /node_modules/,
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
      disable: process.env.NODE_ENV === 'development',
    }),
    {
      name: 'debug-plugin',
      resolveId(source, importer) {
        console.log(`Resolving: ${source} from ${importer}`);
      }
    }
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
      {
        find: "lib",
        replacement: resolve(__dirname, "lib"),
      },
    ],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].js',
        chunkFileNames: '[name].[hash].js',
        assetFileNames: '[name].[hash].[ext]',
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lodash')) {
              return 'lodash-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    esbuild: {
      drop: ['console', 'debugger'],  // Remove console.log and debugger in production
    },
  },
  css: {
    // No postcss configuration, since we're removing autoprefixer
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@react-google-maps/api', 'lodash'],
  },
});
