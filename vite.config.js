import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { linterPlugin, EsLinter } from 'vite-plugin-linter';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    react(),
    linterPlugin({
      include: ['./src/**/*.js', './src/**/*.jsx'],
      linters: [new EsLinter({ configEnv })],
    }),
    svgr({ svgrOptions: { icon: true } }),
  ],
  server: { port: 4000, host: true },
}));
