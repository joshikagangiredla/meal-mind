import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages serves the site from /meal-mind/, so production builds use that base path.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/meal-mind/' : '/',
  plugins: [react(), tailwindcss()],
}));
