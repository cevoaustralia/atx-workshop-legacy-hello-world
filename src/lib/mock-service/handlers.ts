import { http, HttpResponse } from 'msw';
import { defaultGreetingsFixture, emptyGreetingsFixture } from './fixtures/greetingsFixtures';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const handlers = [
  http.get(`${API_URL}/greetings.json`, ({ request }) => {
    // Parse x-mock-scenario header for future scenario overrides
    const scenarioHeader = request.headers.get('x-mock-scenario');
    
    if (scenarioHeader?.includes('greetings.state=empty')) {
      return HttpResponse.json(emptyGreetingsFixture);
    }
    
    if (scenarioHeader?.includes('greetings.state=error')) {
      return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
    
    // Default response
    return HttpResponse.json(defaultGreetingsFixture);
  }),
];
