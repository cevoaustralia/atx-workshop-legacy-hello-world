/**
 * Runtime configuration injected via window.CONFIG
 * Loaded from public/config.{mode}.js at runtime
 */
export interface MicrositeConfig {
  /** Base URL for API calls */
  apiUrl: string;
  /** Application environment */
  environment: 'development' | 'mocked' | 'production';
  /** Feature flags configuration */
  features?: {
    enableMockScenarios?: boolean;
    enableDevTools?: boolean;
  };
}

declare global {
  interface Window {
    CONFIG: MicrositeConfig;
  }
}

/**
 * Get runtime configuration with safe defaults
 */
export function getConfig(): MicrositeConfig {
  if (typeof window === 'undefined') {
    throw new Error('getConfig() can only be called in browser context');
  }

  if (!window.CONFIG) {
    // Provide safe defaults if config is not loaded
    console.warn('window.CONFIG not found, using defaults');
    return {
      apiUrl: '/api',
      environment: 'development',
      features: {
        enableMockScenarios: false,
        enableDevTools: true,
      },
    };
  }

  return window.CONFIG;
}
