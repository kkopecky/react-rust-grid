import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

export default defineConfig({
	plugins: [
		react(),
		wasm(),
		topLevelAwait(),
		viteStaticCopy({
			targets: [
				{
					src: 'public/rust-lib/*',
					dest: 'rust-lib',
				},
			],
		}),
	],
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'ReactWasmLib',
			fileName: (format) => `react-wasm-lib.${format}.js`,
		},
		rollupOptions: {
			external: ['react'],
			output: {
				globals: {
					react: 'React',
				},
			},
		},
	},
	optimizeDeps: {
		exclude: ['@syntect/wasm'],
	},
});
