// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Proxy removed - contact form now uses Cloudflare Worker
  // If you need to proxy to Cloudflare Worker in development, uncomment and update:
  // server: {
  //   proxy: {
  //     '/api/contact': {
  //       target: 'https://contact.your-subdomain.workers.dev',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api\/contact/, '/contact'),
  //     },
  //   },
  // },
})
