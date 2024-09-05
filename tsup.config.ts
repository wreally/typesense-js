import { defineConfig } from "tsup";
import type { Options } from "tsup";
import browserList from "browserslist-to-esbuild";
import { nodeModulesPolyfillPlugin } from "esbuild-plugins-node-modules-polyfill";
import { builtinModules } from "module";

export default defineConfig([
  {
    target: browserList(["defaults"]) as Options["target"],
    entry: ["src/Typesense.ts"],
    sourcemap: true,
    clean: true,
    format: ["cjs", "esm"],
    dts: true,
    outDir: "dist",
    minify: true,
    outExtension({ format }) {
      return {
        js: `.min.${format === "cjs" ? "js" : "mjs"}`,
      };
    },
    splitting: true,
    platform: "browser",
    external: [...builtinModules],
    esbuildOptions(options) {
      options.mainFields = ["module", "main", "browser"];
    },
    esbuildPlugins: [
      nodeModulesPolyfillPlugin({
        fallback: "empty",
      }),
    ],
  },
  {
    target: browserList(["defaults"]) as Options["target"],
    entry: ["src/Typesense.ts"],
    clean: true,
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: true,
    outDir: "lib",
    minify: true,
    outExtension({ format }) {
      return {
        js: `.min.${format === "cjs" ? "js" : "mjs"}`,
      };
    },
    splitting: true,
    esbuildOptions(options) {
      options.mainFields = ["module", "main"];
    },
  },
]);
