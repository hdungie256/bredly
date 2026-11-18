import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Trang chạy ở https://hdungie256.github.io/bredly/
export default defineConfig({
  base: '/bredly/',
  plugins: [react()],
})
