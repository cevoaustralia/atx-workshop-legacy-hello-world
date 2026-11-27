# MSW Mock Service and Test Scenarios

This application uses **MSW (Mock Service Worker) v2** for in-browser API mocking during development and testing.

## Mock Service Structure

```
src/lib/mock-service/
├── browser.ts              # MSW worker setup
├── handlers.ts             # Request handlers
└── fixtures/
    └── greetingsFixtures.ts   # Mock data
```

## Running in Mocked Mode

```bash
npm run start:mock
```

This starts the dev server with `MODE=mock`, which initializes MSW in the browser.

## Handler Pattern

**src/lib/mock-service/handlers.ts**
```typescript
import { http, HttpResponse } from 'msw';
import { defaultGreetingsFixture, emptyGreetingsFixture } from './fixtures/greetingsFixtures';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const handlers = [
  http.get(`${API_URL}/greetings.json`, ({ request }) => {
    // Parse x-mock-scenario header
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
```

## Fixtures

Fixtures are hard-coded mock data responses:

**src/lib/mock-service/fixtures/greetingsFixtures.ts**
```typescript
import type { GreetingsList } from '@/app/api/types';

export const defaultGreetingsFixture: GreetingsList = [
  { id: 1, language: 'en', languageName: 'English', text: 'Hello, World!', note: 'The classic first program.' },
  // ... more greetings
];

export const emptyGreetingsFixture: GreetingsList = [];

export const errorGreetingsFixture = null; // Triggers error responses
```

## Test Scenario Overrides

Scenario overrides allow testing different API responses using the `x-mock-scenario` header.

### Scenario Header Format

```
x-mock-scenario: featureKey.dimensionKey=value,otherFeature.dimension=value
```

Example:
```
x-mock-scenario: greetings.state=empty,auth.role=admin
```

### Handler Implementation

```typescript
http.get(`${API_URL}/greetings.json`, ({ request }) => {
  const scenarioHeader = request.headers.get('x-mock-scenario');
  
  // Parse scenario parameters
  if (scenarioHeader?.includes('greetings.state=empty')) {
    return HttpResponse.json(emptyGreetingsFixture);
  }
  
  if (scenarioHeader?.includes('greetings.state=error')) {
    return HttpResponse.error();
  }
  
  // Default
  return HttpResponse.json(defaultGreetingsFixture);
});
```

## Adding a New Endpoint

1. **Add fixture data**:
```typescript
// src/lib/mock-service/fixtures/usersFixtures.ts
export const defaultUsersFixture = [
  { id: 1, name: 'John Doe' },
];
```

2. **Add handler**:
```typescript
// src/lib/mock-service/handlers.ts
http.get(`${API_URL}/users`, ({ request }) => {
  return HttpResponse.json(defaultUsersFixture);
}),
```

3. **Create wrapper hook**:
```typescript
// src/app/api/queries/useGetUsersQuery.ts
export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: ['users', 'list'],
    queryFn: fetchUsers,
  });
};
```

## Scenario Variants

Add scenario variants only for error/edge cases:

```typescript
http.post(`${API_URL}/greetings`, ({ request }) => {
  const scenarioHeader = request.headers.get('x-mock-scenario');
  
  if (scenarioHeader?.includes('greetings.create=error')) {
    return HttpResponse.json(
      { error: 'Validation failed' }, 
      { status: 400 }
    );
  }
  
  if (scenarioHeader?.includes('greetings.create=slow')) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(HttpResponse.json(newGreetingFixture));
      }, 3000);
    });
  }
  
  return HttpResponse.json(newGreetingFixture);
});
```

## MSW vs Mock Server

This application uses **in-browser MSW** (not a separate mock server process):
- MSW intercepts requests at the browser's Service Worker level
- No separate server process needed
- Works in development and tests
- Same codebase for both

## Testing with MSW

MSW is automatically available in tests when configured:

```typescript
import { http, HttpResponse } from 'msw';
import { server } from './test/mswServer'; // Setup in test config

test('handles empty greetings', async () => {
  server.use(
    http.get('/api/greetings.json', () => {
      return HttpResponse.json([]);
    })
  );
  
  render(<HomePage />);
  expect(await screen.findByText('No greetings')).toBeInTheDocument();
});
```

## Production Builds

MSW code is **not included** in production builds:

```typescript
// src/main.tsx
async function enableMocking() {
  const mode = import.meta.env.MODE;
  if (mode === 'mock' || mode === 'mocked') {
    const { worker } = await import('./lib/mock-service/browser');
    return worker.start({ onUnhandledRequest: 'bypass' });
  }
  return Promise.resolve();
}
```

The dynamic import ensures MSW is tree-shaken from production builds.

## Best Practices

1. **Default fixtures from API contracts** - Keep mocks synchronized with actual API
2. **Scenario variants for edge cases** - Don't create scenarios for every possible response
3. **Realistic data** - Use data that reflects production complexity
4. **Performance testing** - Add `slow` scenario variants to test loading states
5. **Error testing** - Add error scenarios for unhappy paths
