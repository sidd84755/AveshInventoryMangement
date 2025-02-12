import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend server address
        // target: 'https://aveshinventorymangement.onrender.com',
        changeOrigin: true,
        secure: false
      }
    }
  }
})