import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'resources/js',
            filename: 'sw.js',

            // The manifest and icons are static files under public/, which Vite
            // does not process (laravel-vite-plugin sets publicDir: false).
            manifest: false,
            includeManifestIcons: false,

            // app.jsx registers the worker itself; there is no HTML entrypoint
            // for the plugin to inject a registration script into.
            injectRegister: false,

            injectManifest: {
                globPatterns: ['**/*.{js,css,woff,woff2}'],

                // Workbox lists the assets relative to public/build/, but the
                // worker runs at the site root, so every entry needs the
                // /build/ prefix to resolve.
                manifestTransforms: [
                    (entries) => ({
                        manifest: entries.map((entry) => ({
                            ...entry,
                            url: `/build/${entry.url}`,
                        })),
                    }),
                ],

                // Classic script, not an ES module: Safari and Firefox do not
                // support module service workers.
                rollupFormat: 'iife',
            },
        }),
    ],
});
