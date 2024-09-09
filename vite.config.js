import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { splitVendorChunkPlugin } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: '/seamless-chat-integration/',
  server: {
    host: "::",
    port: "8000",
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
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
    sourcemap: command === 'serve',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
