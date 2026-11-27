/**
 * Orval Configuration Template
 * 
 * This file is a template for generating TypeScript types, React Query hooks,
 * and MSW handlers from OpenAPI specifications using Orval.
 * 
 * To use:
 * 1. Install Orval: npm install --save-dev orval
 * 2. Add an OpenAPI contracts package or spec file
 * 3. Update the input path below
 * 4. Run: npx orval --config orval.config.ts
 * 
 * Or integrate with projen by adding to .projenrc.ts:
 *   project.addTask('gen:api', {
 *     exec: 'npx orval --config orval.config.ts',
 *   });
 */

import { defineConfig } from 'orval';

export default defineConfig({
  greetings: {
    input: {
      // TODO: Replace with actual OpenAPI spec path
      // Examples:
      // - './node_modules/@my-org/api-contracts/openapi.yaml'
      // - './specs/openapi.json'
      // - 'https://api.example.com/openapi.json'
      target: './specs/openapi.yaml',
    },
    output: {
      target: './src/lib/api/generated/services/greetings/greetings.ts',
      client: 'react-query',
      mode: 'tags-split',
      mock: {
        type: 'msw',
        useExamples: true,
      },
      override: {
        mutator: {
          path: './src/lib/api/mutator/axiosClient.ts',
          name: 'customAxiosMutator',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});
