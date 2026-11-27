import { http, HttpResponse } from 'msw';
import { defaultGreetingsFixture, emptyGreetingsFixture } from './fixtures/greetingsFixtures';
import { parseScenarioHeader } from '@/app/scenarioTesting/scenarioRegistry';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const handlers = [
  http.get(`${API_URL}/greetings.json`, ({ request }) => {
    // Parse x-mock-scenario header
    const scenarioHeader = request.headers.get('x-mock-scenario');
    const scenarios = parseScenarioHeader(scenarioHeader || '');
    
    // Check greeting scenarios
    const greetingsState = scenarios.greetings?.state;
    
    if (greetingsState === 'empty') {
      return HttpResponse.json(emptyGreetingsFixture);
    }
    
    if (greetingsState === 'error') {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
    
    // Default response
    return HttpResponse.json(defaultGreetingsFixture);
  }),
];
