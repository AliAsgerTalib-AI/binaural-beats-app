'use client';

import { useEffect, useState } from 'react';
import { notificationsEnabled, scheduleSessionReminder } from '@/lib/notificationManager';

interface SessionReminderProps {
  onSessionComplete?: () => void;
}

export default function SessionReminder({ onSessionComplete }: SessionReminderProps) {
  const [showReminderPrompt, setShowReminderPrompt] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState<'morning' | 'evening' | 'both'>('morning');

  const handleScheduleReminder = (frequency: 'morning' | 'evening' | 'both') => {
    // Get the frequency from settings if available
    const settings = localStorage.getItem('binaural_settings');
    const userFrequency = settings ? JSON.parse(settings).age : 30;

    scheduleSessionReminder(frequency, 40); // Default to 40 Hz for now
    setShowReminderPrompt(false);

    // Show confirmation
    localStorage.setItem('reminder-scheduled', JSON.stringify({ frequency, date: new Date() }));
  };

  // This component doesn't render anything by default
  // It handles background reminder scheduling
  return null;
}
