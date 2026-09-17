import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // expõe na rede local — dá pra abrir do celular via IP
    port: 5173,
  },
});
