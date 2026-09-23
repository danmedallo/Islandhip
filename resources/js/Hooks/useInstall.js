import { useEffect, useState } from 'react';
import {
    canInstall,
    iosInstallState,
    isInstalled,
    onInstallAvailabilityChange,
    promptInstall,
} from '@/pwa';

/**
 * Install state for the current browser, as a single mode so callers cannot
 * render two conflicting branches at once:
 *
 *   installed  - already running from the home screen
 *   prompt     - Chrome/Edge captured a prompt we can replay
 *   ios        - iOS Safari; Add to Home Screen is manual, there is no API
 *   ios-other  - iOS but not Safari, where installing is impossible
 *   manual     - anything else; point at the browser menu
 *
 * iOS is checked before `prompt` deliberately. Real iOS never fires
 * beforeinstallprompt, so the two cannot both be true on a device — but a
 * desktop browser sent with an iPhone user agent would otherwise show both.
 */
export default function useInstall() {
    const [promptable, setPromptable] = useState(canInstall);
    const [installed, setInstalled] = useState(isInstalled);

    useEffect(() => {
        // The event may have fired before this mounted, so read once on mount
        // as well as subscribing.
        setPromptable(canInstall());

        const unsubscribe = onInstallAvailabilityChange(setPromptable);
        const onInstalled = () => setInstalled(true);

        window.addEventListener('appinstalled', onInstalled);

        return () => {
            unsubscribe();
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    const { isIOS, isSafari } = iosInstallState();

    const mode = installed
        ? 'installed'
        : isIOS
          ? (isSafari ? 'ios' : 'ios-other')
          : promptable
            ? 'prompt'
            : 'manual';

    return { mode, install: promptInstall };
}
