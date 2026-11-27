/**
 * Mock/Mocked mode runtime configuration
 * This file is loaded in index.html for MODE=mock or MODE=mocked
 */
window.CONFIG = {
  apiUrl: '/api',
  environment: 'mocked',
  features: {
    enableMockScenarios: true,
    enableDevTools: true,
  },
};
