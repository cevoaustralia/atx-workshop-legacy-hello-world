/**
 * Development runtime configuration
 * This file is loaded in index.html for MODE=development
 */
window.CONFIG = {
  apiUrl: '/api',
  environment: 'development',
  features: {
    enableMockScenarios: false,
    enableDevTools: true,
  },
};
