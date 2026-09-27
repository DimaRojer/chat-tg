import path from 'node:path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        proxy: {
            "/green-api": {
                target: "https://api.green-api.com",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/green-api/, ""),
                timeout: 60000,
                proxyTimeout: 60000,
            },
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "/src/styles/variables" as *;
                    @use "/src/styles/utilities" as *;
                `,
            },
        },
    },
});