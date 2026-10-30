/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { serviceWorker } from './sw-plugin'
export default defineConfig({ base: './', plugins: [vue(), serviceWorker()], test: { environment: 'jsdom' } })
