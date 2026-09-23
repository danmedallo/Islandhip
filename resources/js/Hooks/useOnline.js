import { useEffect, useState } from 'react';

/**
 * Whether the browser currently believes it has a connection.
 *
 * navigator.onLine only reports whether a network interface is up, so it can
 * say true on a captive portal or a dead mobile signal. That is fine here: it
 * is used to discourage a doomed navigation, not to guarantee one succeeds.
 */
export default function useOnline() {
    const [online, setOnline] = useState(
        typeof navigator === 'undefined' ? true : navigator.onLine,
    );

    useEffect(() => {
        const update = () => setOnline(navigator.onLine);

        window.addEventListener('online', update);
        window.addEventListener('offline', update);
        update();

        return () => {
            window.removeEventListener('online', update);
            window.removeEventListener('offline', update);
        };
    }, []);

    return online;
}
