import React from 'react';
import { create } from 'zustand';

export const FEATURE_FLAG_KEYS = {
  GREETINGS_LIST: 'greetings_list',
  GREETING_DETAIL: 'greeting_detail',
  FAVOURITE_FEATURE: 'favourite_feature',
} as const;

type FeatureFlagKey = typeof FEATURE_FLAG_KEYS[keyof typeof FEATURE_FLAG_KEYS];

interface FeatureFlagState {
  flags: Record<string, boolean>;
  overrides: Record<string, boolean>;
  setOverride: (key: FeatureFlagKey, value: boolean) => void;
  clearOverride: (key: FeatureFlagKey) => void;
}

const FEATURE_FLAGS: Record<string, { demo: boolean; dev: boolean; prod: boolean }> = {
  [FEATURE_FLAG_KEYS.GREETINGS_LIST]: { demo: true, dev: true, prod: true },
  [FEATURE_FLAG_KEYS.GREETING_DETAIL]: { demo: true, dev: true, prod: true },
  [FEATURE_FLAG_KEYS.FAVOURITE_FEATURE]: { demo: true, dev: true, prod: true },
};

const getEnvironment = (): 'local' | 'mock' | 'mocked' | 'dev' | 'demo' | 'prod' => {
  const mode = import.meta.env.MODE;
  if (mode === 'mock' || mode === 'mocked') return 'mock';
  if (mode === 'development') return 'local';
  return 'prod';
};

const getDefaultFlags = (): Record<string, boolean> => {
  const env = getEnvironment();
  const result: Record<string, boolean> = {};
  
  Object.entries(FEATURE_FLAGS).forEach(([key, config]) => {
    // mock/mocked/local/dev/demo all resolve to demo key
    if (env === 'local' || env === 'mock' || env === 'mocked' || env === 'dev') {
      result[key] = config.demo;
    } else {
      result[key] = config.prod;
    }
  });
  
  return result;
};

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

export const isFeatureEnabled = (key: FeatureFlagKey): boolean => {
  const state = useFeatureFlagStore.getState();
  const env = getEnvironment();
  
  // Overrides only work in local/mock/mocked
  if ((env === 'local' || env === 'mock' || env === 'mocked') && key in state.overrides) {
    return state.overrides[key];
  }
  
  // Fail closed - missing key returns false
  return state.flags[key] ?? false;
};

export const FeatureFlagGate: React.FC<{
  featureKey: FeatureFlagKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ featureKey, children, fallback = null }) => {
  const isEnabled = isFeatureEnabled(featureKey);
  return React.createElement(React.Fragment, null, isEnabled ? children : fallback);
};
