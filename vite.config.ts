import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/api': {
				target: 'http://159.223.40.127:5001', // Your backend server URL
				changeOrigin: true,
				rewrite: path => path.replace(/^\/api/, '/api'),
			},
		},
	},
});
