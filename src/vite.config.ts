import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
   plugins: [react()],
   server: {
     // Removed proxy configuration since we're using mock data
   },
   resolve: {
     alias: {
    }
  }
})