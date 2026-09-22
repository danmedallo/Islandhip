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

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

registerServiceWorker();
