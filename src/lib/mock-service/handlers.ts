/**
 * MSW Request Handlers
 * Mock API responses for development and testing
 * Uses runtime config and x-mock-scenario header for scenario selection
 */
import { http, HttpResponse } from 'msw';
import { getConfig } from '@/microsite-config';
import { defaultGreetingsFixture, emptyGreetingsFixture } from './fixtures/greetingsFixtures';
import { parseScenarioHeader } from '@/app/scenarioTesting/scenarioRegistry';

/**
 * Get API base URL from runtime config
 */
function getApiUrl(): string {
  return getConfig().apiUrl;
}

/**
 * MSW handlers for API endpoints
 */
export const handlers = [
  /**
   * GET /greetings.json
   * Returns greetings list with scenario support
   */
  http.get(`${getApiUrl()}/greetings.json`, ({ request }) => {
    // Parse x-mock-scenario header
    const scenarioHeader = request.headers.get('x-mock-scenario');
    const scenarios = parseScenarioHeader(scenarioHeader || '');
    
    // Check greeting scenarios with safe property access
    const greetingsState = scenarios['greetings']?.['state'];
    
    if (greetingsState === 'empty') {
      return HttpResponse.json(emptyGreetingsFixture);
    }
    
    if (greetingsState === 'error') {
      return HttpResponse.json(
        { error: 'Internal server error' }, 
        { status: 500 }
      );
    }
    
    // Default response
    return HttpResponse.json(defaultGreetingsFixture);
  }),
];
