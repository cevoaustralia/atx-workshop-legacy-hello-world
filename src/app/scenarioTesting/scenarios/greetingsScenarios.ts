/**
 * Greetings API Scenarios
 * 
 * Defines test scenarios for the greetings API endpoints.
 */

import { registerScenarioFeature } from '../scenarioRegistry';

registerScenarioFeature({
  key: 'greetings',
  label: 'Greetings API',
  description: 'Control the state of greetings API responses',
  dimensions: [
    {
      key: 'state',
      label: 'Response State',
      defaultOption: 'default',
      options: [
        {
          key: 'default',
          label: 'Default',
          description: 'Normal response with 6 greetings',
        },
        {
          key: 'empty',
          label: 'Empty',
          description: 'No greetings returned',
        },
        {
          key: 'error',
          label: 'Error',
          description: 'Server error (500)',
        },
      ],
    },
  ],
});
