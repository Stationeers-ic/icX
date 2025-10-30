import path from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
			"@tests": path.resolve(__dirname, "tests"),
			"@tools": path.resolve(__dirname, "tools"),
		},
	},
	build: {
		minify: true,
		sourcemap: false,
		lib: {
			entry: path.resolve(__dirname, "src/index.ts"),
			name: "icx",
			formats: ["cjs", "umd"],
			fileName: (format) => {
				switch (format) {
					case "umd":
						return "icx.umd.js"
					case "cjs":
						return "icx.cjs.js"
				}
				return "icx.js"
			},
		},
		rollupOptions: {
			external: [/^@tests\//, /^@tools\//],
			output: {
				globals: {
					icx: "icx",
				},
			},
		},
	},
	plugins: [
		// dts({
		// 	entryRoot: "src",
		// 	outDir: "dist",
		// 	exclude: ["tests/**/*", "tools/**/*", "node_modules/**/*", "vite.config.ts"],
		// 	rollupTypes: true,
		// 	insertTypesEntry: true,
		// }),
	],
	define: {
		__VITE_ENV: JSON.stringify(process.env.NODE_ENV || "production"),
		isProd: process.env.NODE_ENV === "production",
	},
})
