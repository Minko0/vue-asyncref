import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Vue asyncRef',
            fileName: (format) => `asyncref.${format}.js`,  // Output file format
        },
        rollupOptions: {
            external: ['react', 'vue'],
            output: {
                globals: {
                    react: 'React',
                    vue: 'Vue',
                },
            },
        },
    },
});