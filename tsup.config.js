// Tsup configuration file
// https://tsup.egoist.dev/

// Tsup is a zero-config TypeScript bundler powered by esbuild with a set of plugins to help you build TypeScript projects with ease.
// This is a configuration file for Tsup, which is used to configure the build process.

import { defineConfig } from 'tsup'
import pkg from './package.json' with { type: 'json' }

export default defineConfig([
    {
        name: pkg.name,
        dts: true, // Generate .d.ts files
        minify: false, // Minify output
        minifyWhitespace: false,
        minifyIdentifiers: false,
        minifySyntax: false,
        keepNames: true,
        splitting: false,
        clean: true,
        sourcemap: true, // Generate sourcemaps
        treeshake: true, // Remove unused code
        outDir: "build", // Output directory
        entry: [
            'src/index.ts'
        ], // Entry point(s)
        format: ['cjs','esm'], // Output format(s)
        target: ['chrome91', 'firefox90', 'edge91', 'safari15', 'ios15', 'opera77'],
        external: ['react', 'react-dom', 'swiper', 'styled-components'],
        injectStyle: false,
    },
])