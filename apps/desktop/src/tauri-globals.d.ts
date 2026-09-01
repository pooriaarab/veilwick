/** Tauri desktop app globals injected on the window object */

interface AppDesktop {
  isDesktop?: boolean;
  isMobile?: boolean;
  platform: string;
  haptic?: {
    light: () => Promise<void>;
    medium: () => Promise<void>;
    heavy: () => Promise<void>;
  };
  notify?: (title: string, body?: string) => Promise<void>;
  checkForUpdates?: () => Promise<void>;
}

interface Window {
  /** Present when running inside a Tauri desktop/mobile shell */
  __TAURI_INTERNALS__?: unknown;
  /** Desktop / mobile shell metadata (set by the Tauri host) */
  __appDesktop?: AppDesktop;
}
