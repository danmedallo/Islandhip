import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { forgetCachedPagesOnAuthChange, registerServiceWorker } from './pwa';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        forgetCachedPagesOnAuthChange(props.initialPage.props.auth?.user);

        router.on('success', (event) => {
            forgetCachedPagesOnAuthChange(event.detail.page.props.auth?.user);
        });

        // Inertia navigates by XHR. Offline that request simply fails and the
        // visitor is left on the current page with nothing happening, even
        // when the worker holds a cached copy of the destination. Remember
        // where each visit was headed and, if it throws, hand over to a full
        // navigation the worker can answer.
        let attempted = null;

        router.on('start', (event) => {
            attempted = event.detail.visit?.url?.toString() ?? null;
        });

        router.on('exception', (event) => {
            if (!attempted) {
                return;
            }

            event.preventDefault();
            window.location.href = attempted;
        });

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

registerServiceWorker();
