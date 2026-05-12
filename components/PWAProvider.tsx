'use client';

import { useEffect, useState } from 'react';

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }
}

/**
 * Validates and converts VAPID public key from base64 string to ArrayBuffer
 * VAPID keys must be 65 bytes (520 bits) when decoded
 */
const validateAndConvertVapidKey = (keyString: string): ArrayBuffer | null => {
  try {
    // Validate that it's a valid base64 string
    const decoded = atob(keyString);

    // VAPID keys are exactly 65 bytes when decoded
    if (decoded.length !== 65) {
      console.warn(`Invalid VAPID key length: expected 65 bytes, got ${decoded.length}`);
      return null;
    }

    // Convert to ArrayBuffer
    const array = new Uint8Array(decoded.length);
    for (let i = 0; i < decoded.length; i++) {
      array[i] = decoded.charCodeAt(i);
    }
    return array.buffer;
  } catch (err) {
    console.error('Failed to parse VAPID key:', err);
    return null;
  }
};

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((err) => {
          console.warn('Service Worker registration failed:', err);
        });
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Request notification permission on first session
    try {
      const hasAskedForNotifications = localStorage.getItem('asked-for-notifications');
      if (!hasAskedForNotifications && 'Notification' in window) {
        setTimeout(() => {
          setShowNotificationPrompt(true);
          localStorage.setItem('asked-for-notifications', 'true');
        }, 3000);
      }
    } catch (err) {
      console.warn('localStorage access failed:', err);
    }

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    setShowInstallPrompt(false);
    setDeferredPrompt(null);
  };

  const handleNotifications = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notifications enabled');
        scheduleReminders();
      }
    }
    setShowNotificationPrompt(false);
  };

  const scheduleReminders = async () => {
    try {
      // Check browser support
      if (!('serviceWorker' in navigator && 'PushManager' in window)) {
        console.warn('Push Manager not supported in this browser');
        return;
      }

      // Get service worker registration
      const registration = await navigator.serviceWorker.ready;

      // Check if already subscribed
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        console.log('Already subscribed to push notifications');
        return;
      }

      // Validate and convert VAPID key
      const vapidKeyString = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKeyString) {
        console.warn('VAPID public key not configured');
        return;
      }

      const vapidPublicKey = validateAndConvertVapidKey(vapidKeyString);
      if (!vapidPublicKey) {
        console.error('Invalid VAPID public key configuration');
        return;
      }

      // Subscribe to push notifications
      await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidPublicKey,
      });

      console.log('Successfully subscribed to push notifications');
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err);
    }
  };

  return (
    <>
      {children}

      {/* Install Prompt */}
      {showInstallPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg shadow-lg p-4 flex items-center justify-between gap-3 z-50">
          <div className="flex-1">
            <p className="font-semibold text-sm">Install Brainwave</p>
            <p className="text-xs opacity-90">Add to your home screen for easy access</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowInstallPrompt(false)}
              className="px-3 py-1 rounded bg-orange-700 hover:bg-orange-800 text-xs font-medium"
            >
              Later
            </button>
            <button
              onClick={handleInstall}
              className="px-3 py-1 rounded bg-white text-orange-700 hover:bg-orange-50 text-xs font-medium"
            >
              Install
            </button>
          </div>
        </div>
      )}

      {/* Notification Permission Prompt */}
      {showNotificationPrompt && (
        <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg p-4 flex items-center justify-between gap-3 z-50">
          <div className="flex-1">
            <p className="font-semibold text-sm">Get Session Reminders</p>
            <p className="text-xs opacity-90">We'll remind you when it's time for your session</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNotificationPrompt(false)}
              className="px-3 py-1 rounded bg-blue-700 hover:bg-blue-800 text-xs font-medium"
            >
              Skip
            </button>
            <button
              onClick={handleNotifications}
              className="px-3 py-1 rounded bg-white text-blue-700 hover:bg-blue-50 text-xs font-medium"
            >
              Enable
            </button>
          </div>
        </div>
      )}
    </>
  );
}
