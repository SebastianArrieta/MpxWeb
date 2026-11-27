import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Base absoluta: scripts/seo-build.mjs genera dist/<ruta>/index.html y con
  // rutas relativas ('./') los assets no cargarían en esas subcarpetas.
  // Para publicar en una subcarpeta usa VITE_BASE=/subcarpeta/.
  base: process.env.VITE_BASE || '/',
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
})
