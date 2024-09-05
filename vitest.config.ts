import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import {svelteTesting} from '@testing-library/svelte/vite'

export default defineConfig({
    plugins: [
        svelte({ hot: !process.env.VITEST }),
        svelteTesting(),
    ],
    test: {
        include: ["test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        environment: "jsdom",
        setupFiles: ['./vitest-setup.js'],
    },
});