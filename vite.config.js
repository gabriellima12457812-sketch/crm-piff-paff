import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        contracts: 'contracts.html',
        conectar: 'conectar_whatsapp.html'
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
