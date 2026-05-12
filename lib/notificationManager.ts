// Message types for service worker communication
type ServiceWorkerMessage = {
  type: 'SEND_NOTIFICATION' | 'SCHEDULE_REMINDER' | 'CANCEL_NOTIFICATION';
  title?: string;
  options?: NotificationOptions;
  frequency?: 'morning' | 'evening' | 'both';
  frequency_hz?: number;
};

// Send notification via service worker
export const sendNotification = async (title: string, options?: NotificationOptions) => {
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    const message: ServiceWorkerMessage = {
      type: 'SEND_NOTIFICATION',
      title,
      options,
    };
    navigator.serviceWorker.controller.postMessage(message);
  }
};

// Schedule a notification for a specific time
export const scheduleNotification = (
  title: string,
  body: string,
  timeInMinutes: number,
  url: string = '/'
) => {
  const delay = timeInMinutes * 60 * 1000;
  setTimeout(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        tag: 'brainwave-scheduled',
        requireInteraction: false,
      });
    }
  }, delay);
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

// Check if notifications are enabled
export const notificationsEnabled = (): boolean => {
  return 'Notification' in window && Notification.permission === 'granted';
};

/**
 * Schedules a reminder notification for a specific time
 * Extracted helper to reduce code duplication
 */
const scheduleReminderForTime = (
  scheduledTime: Date,
  shouldSchedule: boolean,
  title: string,
  body: string
): void => {
  if (!shouldSchedule) return;

  const now = new Date();
  const delayMs = scheduledTime.getTime() - now.getTime();

  if (delayMs <= 0) return; // Time already passed

  setTimeout(() => {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const message: ServiceWorkerMessage = {
        type: 'SEND_NOTIFICATION',
        title,
        options: {
          body,
          icon: '/icon-192.png',
          badge: '/badge-72.png',
          data: { url: '/' },
        },
      };
      navigator.serviceWorker.controller.postMessage(message);
    }
  }, delayMs);
};

/**
 * Schedule morning/evening session reminders based on user preference
 */
export const scheduleSessionReminder = (
  frequency: 'morning' | 'evening' | 'both',
  frequency_hz: number
): void => {
  const now = new Date();

  const morningTime = new Date();
  morningTime.setHours(9, 0, 0); // 9 AM

  const eveningTime = new Date();
  eveningTime.setHours(21, 0, 0); // 9 PM

  scheduleReminderForTime(
    morningTime,
    frequency === 'morning' || frequency === 'both',
    'Time for your morning session',
    `Start your ${frequency_hz} Hz focus session`
  );

  scheduleReminderForTime(
    eveningTime,
    frequency === 'evening' || frequency === 'both',
    'Time for your evening session',
    `Start your ${frequency_hz} Hz relaxation session`
  );
};
