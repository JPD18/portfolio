import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // If deploying to GitHub Pages at /portfolio/, keep base as below.
  // If using a different repo name, change to `'/your-repo-name/'`.
  base: '/portfolio/',
})
