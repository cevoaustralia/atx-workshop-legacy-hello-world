/**
 * Feature flag store with typed keys and runtime config
 * Following the convention: FEATURE_FLAG_KEYS and FEATURE_FLAGS must stay in sync
 */
import { create } from 'zustand';
import { getConfig } from '@/microsite-config';

/**
 * Typed union of all feature flag keys
 * Keep this in sync with FEATURE_FLAGS
 */
export const FEATURE_FLAG_KEYS = {
  GREETINGS_LIST: 'greetings_list',
  GREETING_DETAIL: 'greeting_detail',
  FAVOURITE_FEATURE: 'favourite_feature',
} as const;

/**
 * Feature flag key type derived from FEATURE_FLAG_KEYS
 */
export type FeatureFlagKey = typeof FEATURE_FLAG_KEYS[keyof typeof FEATURE_FLAG_KEYS];

/**
 * Feature flag configuration
 * Each flag defines its state per environment
 */
const FEATURE_FLAGS: Record<FeatureFlagKey, { demo: boolean; dev: boolean; prod: boolean }> = {
  [FEATURE_FLAG_KEYS.GREETINGS_LIST]: { demo: true, dev: true, prod: true },
  [FEATURE_FLAG_KEYS.GREETING_DETAIL]: { demo: true, dev: true, prod: true },
  [FEATURE_FLAG_KEYS.FAVOURITE_FEATURE]: { demo: true, dev: true, prod: true },
};

/**
 * Feature flag store state interface
 */
interface FeatureFlagState {
  flags: Record<string, boolean>;
  overrides: Record<string, boolean>;
  setOverride: (key: FeatureFlagKey, value: boolean) => void;
  clearOverride: (key: FeatureFlagKey) => void;
}

/**
 * Get environment from runtime config
 */
function getEnvironment(): 'development' | 'mocked' | 'production' {
  if (typeof window === 'undefined') {
    return 'development';
  }
  return getConfig().environment;
}

/**
 * Calculate default flag values based on environment
 */
function getDefaultFlags(): Record<string, boolean> {
  const env = getEnvironment();
  const result: Record<string, boolean> = {};
  
  Object.entries(FEATURE_FLAGS).forEach(([key, config]) => {
    // development and mocked both use demo values
    if (env === 'development' || env === 'mocked') {
      result[key] = config.demo;
    } else {
      result[key] = config.prod;
    }
  });
  
  return result;
}

/**
 * Feature flag store
 */
export const useFeatureFlagStore = create<FeatureFlagState>((set) => ({
  flags: getDefaultFlags(),
  overrides: {},
  setOverride: (key, value) =>
    set((state) => ({
      overrides: { ...state.overrides, [key]: value },
    })),
  clearOverride: (key) =>
    set((state) => {
      const { [key]: _, ...rest } = state.overrides;
      return { overrides: rest };
    }),
}));

/**
 * Check if a feature is enabled
 * Fail closed: missing keys return false
 * 
 * @param key - Feature flag key
 * @returns true if feature is enabled
 */
export function isFeatureEnabled(key: FeatureFlagKey): boolean {
  const state = useFeatureFlagStore.getState();
  const env = getEnvironment();
  
  // Overrides only work in non-production
  if (env !== 'production' && key in state.overrides) {
    const overrideValue = state.overrides[key];
    return overrideValue ?? false;
  }
  
  // Fail closed - missing key returns false
  const flagValue = state.flags[key];
  return flagValue ?? false;
}
