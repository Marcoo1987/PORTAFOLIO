import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/PORTAFOLIO/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        sobremi: resolve(__dirname, 'sobre-mi.html'),
        portafolio: resolve(__dirname, 'portafolio.html'),
        precios: resolve(__dirname, 'precios.html'),
        contacto: resolve(__dirname, 'contacto.html')
      }
    }
  },
});
