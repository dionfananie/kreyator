import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";
import { pluginReactRouter } from "rsbuild-plugin-react-router";

export default defineConfig({
	environments: {
		node: {
			performance: {
				// Cloudflare Workers cannot load dynamic chunks at runtime.
				chunkSplit: { strategy: "all-in-one" },
			},
			tools: {
				rspack: {
					// The Worker entry must stay ESM so workerd can import it.
					externalsType: "module",
					output: {
						chunkFormat: "module",
						chunkLoading: "import",
						workerChunkLoading: "import",
						wasmLoading: "fetch",
						library: { type: "module" },
						module: true,
					},
					resolve: {
						conditionNames: ["workerd", "worker", "browser", "import", "require"],
					},
				},
			},
		},
	},
	plugins: [
		pluginReactRouter({
			// The Worker (server/index.ts) owns the React Router request handler.
			customServer: true,
		}),
		pluginReact(),
	],
});
