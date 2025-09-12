import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import sitemap from 'vite-plugin-sitemap';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sitemap({ hostname: 'https://www.aialchemist-ab1r.vercel.app' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'src': path.resolve(__dirname, './src'),
    },
  },
  server: {
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn-images-1.medium.com https://miro.medium.com; connect-src 'self' https://api.rss2json.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
    },
  },
  preview: {
    headers: {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://cdn-images-1.medium.com https://miro.medium.com; connect-src 'self' https://api.rss2json.com; object-src 'none'; base-uri 'self'; frame-ancestors 'self'",
    },
  },
});
