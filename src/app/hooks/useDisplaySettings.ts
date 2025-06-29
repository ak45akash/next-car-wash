'use client';

import { useState, useEffect } from 'react';

interface DisplaySettings {
  showDuration: boolean;
  showCategory: boolean;
}

export function useDisplaySettings() {
  const [displaySettings, setDisplaySettings] = useState<DisplaySettings>({
    showDuration: true,
    showCategory: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDisplaySettings();
  }, []);

  async function fetchDisplaySettings() {
    try {
      setLoading(true);
      const response = await fetch('/api/settings/display_options');
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.value) {
          let settings;
          if (typeof data.value === 'string') {
            try {
              settings = JSON.parse(data.value);
            } catch (jsonError) {
              console.error('Invalid JSON in display settings:', data.value, jsonError);
              settings = { showDuration: true, showCategory: true };
            }
          } else {
            settings = data.value;
          }
          setDisplaySettings({
            showDuration: settings.showDuration !== false, // default to true
            showCategory: settings.showCategory !== false  // default to true
          });
        }
        setError(null);
      } else {
        // Use defaults if fetch fails
        console.log('Failed to fetch display settings, using defaults');
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching display settings:', err);
      setError('Failed to load display settings');
      // Keep default values
    } finally {
      setLoading(false);
    }
  }

  return {
    displaySettings,
    loading,
    error,
    refetch: fetchDisplaySettings
  };
} 