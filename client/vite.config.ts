import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/s/': 'http://localhost:8081/s/',
    },
  },
  define: { 'process.env': {} },
  resolve: { alias: { vue: 'vue/dist/vue.esm-bundler.js' } },
});
