/// <reference types="vitest" />
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  base: undefined, // Silence SvelteKit warning
  plugins: [sveltekit()],
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["node_modules", ".svelte-kit", "static/*.{png,jpg,jpeg,gif,svg,webp,pdf}"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest-setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      exclude: [
        "tests/**",
        "src/lib/assets/**",
        "types/**",
        "static/*.{png,jpg,jpeg,gif,svg,webp,pdf}",
        "**/*.d.ts",
        "**/*.scss"
      ],
      // all: true,
      // Note: Branch coverage for Svelte components may show false negatives
      // due to how V8 instruments reactive statements ($:) and template literals.
      // The compiler generates branches for template interpolations like {variable}
      // which cannot be meaningfully tested separately from statement execution.
      thresholds: {
        statements: 95,
        branches: 78, // Lower threshold accounts for Svelte compiler artifacts
        functions: 95,
        lines: 95
      }
    }
  },
  build: {
    sourcemap: true,
    minify: true
  }
});
