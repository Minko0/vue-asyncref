import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'Vue asyncRef',
            fileName: (format) => `index.${format}.js`,  // Output file format
        },
        rollupOptions: {
            external: ['react', 'vue'],
            output: {
                globals: {
                    vue: 'Vue',
                },
            },
        },
        sourcemap: true,
        emptyOutDir: true,
    },
    test: {
        include: ["tests/*.spec.ts"],
    }
});