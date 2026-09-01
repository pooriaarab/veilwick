// Note: In dev mode, the webview loads from devUrl (localhost:3000).
// In production, frontendDist serves these files as a fallback loading screen.
// The Rust setup hook navigates to MASTER_TEMPLATE_PROD_URL (option_env!) in release.

import { invoke } from '@tauri-apps/api/core';
import { isPermissionGranted, requestPermission, sendNotification } from '@tauri-apps/plugin-notification';
import { check } from '@tauri-apps/plugin-updater';

console.log("Master Template starting...");

// Initialize notifications
async function initNotifications() {
  let permissionGranted = await isPermissionGranted();
  if (!permissionGranted) {
    const permission = await requestPermission();
    permissionGranted = permission === 'granted';
  }
  if (permissionGranted) {
    console.log("Notifications enabled");
  }
}

// Check for updates on startup (silent)
async function checkForUpdates() {
  try {
    const update = await check();
    if (update) {
      console.log(`Update available: v${update.version}`);
      const granted = await isPermissionGranted();
      if (granted) {
        sendNotification({
          title: 'Master Template Update Available',
          body: `Version ${update.version} is ready to install.`,
        });
      }
    }
  } catch (e) {
    console.error('Update check failed:', e);
  }
}

// Detect platform and set up platform-specific features
async function initPlatform() {
  try {
    const platform = await invoke<string>('get_platform');
    document.documentElement.setAttribute('data-platform', platform);

    if (platform === 'ios') {
      console.log('Running on iOS — safe area and haptics enabled');
      const { impactFeedback } = await import('@tauri-apps/plugin-haptics');

      window.__appDesktop = {
        isDesktop: false,
        isMobile: true,
        platform: 'ios',
        haptic: {
          light: async () => { await impactFeedback('light'); },
          medium: async () => { await impactFeedback('medium'); },
          heavy: async () => { await impactFeedback('heavy'); },
        },
        notify: async (title: string, body?: string) => {
          const granted = await isPermissionGranted();
          if (granted) {
            sendNotification({ title, body });
          }
        },
        checkForUpdates,
      };
    } else {
      window.__appDesktop = {
        isDesktop: true,
        isMobile: false,
        platform,
        notify: async (title: string, body?: string) => {
          const granted = await isPermissionGranted();
          if (granted) {
            sendNotification({ title, body });
          }
        },
        checkForUpdates,
      };
    }
  } catch (e) {
    console.error('Platform detection failed:', e);
    window.__appDesktop = {
      isDesktop: false,
      isMobile: false,
      platform: 'web',
    };
  }
}

initNotifications().catch(console.error);
initPlatform().catch(console.error);

// Check for updates 5 seconds after startup (non-blocking)
setTimeout(() => {
  checkForUpdates().catch(console.error);
}, 5000);
