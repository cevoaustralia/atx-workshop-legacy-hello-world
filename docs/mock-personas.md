# Mock Personas and Test Data

This document describes the mock data and personas available in **mocked mode** (`npm run start:mock`).

## Overview

The application uses **MSW (Mock Service Worker)** to provide deterministic test data during development and testing. All mock data is defined in `src/lib/mock-service/fixtures/`.

## Mock Greetings Data

### Default Fixture

**Location**: `src/lib/mock-service/fixtures/greetingsFixtures.ts`

The default fixture contains 6 greetings in different languages:

| ID | Language | Language Name | Text | Note |
|----|----------|---------------|------|------|
| 1 | en | English | Hello, World! | The classic first program. |
| 2 | es | Spanish | ¡Hola, Mundo! | Spoken by over 500 million people. |
| 3 | fr | French | Bonjour, le Monde ! | Note the space before the exclamation mark. |
| 4 | de | German | Hallo, Welt! | Nouns are always capitalised. |
| 5 | ja | Japanese | こんにちは、世界！ | Konnichiwa, sekai. |
| 6 | mi | Māori | Kia ora, te Ao! | An official language of Aotearoa New Zealand. |

### Empty Fixture

**Usage**: Testing empty states

```typescript
import { emptyGreetingsFixture } from '@/lib/mock-service/fixtures/greetingsFixtures';
// Returns: []
```

### Error Fixture

**Usage**: Testing error handling

```typescript
// In MSW handler
if (scenarioHeader?.includes('greetings.state=error')) {
  return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

## Test Scenarios

### Scenario: Default State

**Header**: None (default)

**Response**: All 6 greetings from `defaultGreetingsFixture`

**Use case**: Normal happy path testing

### Scenario: Empty State

**Header**: `x-mock-scenario: greetings.state=empty`

**Response**: Empty array `[]`

**Use case**: Testing "no data" UI states

### Scenario: Error State

**Header**: `x-mock-scenario: greetings.state=error`

**Response**: HTTP 500 with `{ error: 'Internal server error' }`

**Use case**: Testing error handling and error UI

## Using Scenarios in Tests

### In Vitest Tests

```typescript
import { http, HttpResponse } from 'msw';
import { server } from '@/lib/testing/mswServer';

test('should handle empty greetings list', async () => {
  // Override the handler for this test
  server.use(
    http.get('/api/greetings.json', () => {
      return HttpResponse.json([]);
    })
  );

  // Test proceeds with empty response
});
```

### In Playwright Tests

Scenarios are set via the `x-mock-scenario` header in the axios client. For smoke tests, we typically use the default fixture since we're verifying normal user flows.

For specific scenario testing, you would need to:
1. Add a UI control to set the scenario (e.g., a hidden query parameter)
2. Or add scenario variants to the MSW handlers

## Mock IDs for E2E Tests

When writing smoke tests that navigate to specific resources, use these stable IDs:

- **Greeting ID 1**: English greeting ("Hello, World!")
- **Greeting ID 2**: Spanish greeting ("¡Hola, Mundo!")
- **Greeting ID 3**: French greeting ("Bonjour, le Monde !")
- **Greeting ID 4**: German greeting ("Hallo, Welt!")
- **Greeting ID 5**: Japanese greeting ("こんにちは、世界！")
- **Greeting ID 6**: Māori greeting ("Kia ora, te Ao!")

Example:
```typescript
await page.goto('/greetings/1'); // Always navigates to English greeting
```

## State Persistence

The application uses **sessionStorage** for state persistence:

- **helloCount**: Number of times "Say hello" button has been clicked
- **favouriteGreetingId**: ID of the user's favourite greeting (or null)

This state persists across page navigations within a session but is reset when the tab is closed.

## Adding New Mock Data

### 1. Create a new fixture file

```typescript
// src/lib/mock-service/fixtures/usersFixtures.ts
import type { User } from '@/lib/api/models/user.models';

export const defaultUserFixture: User = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};

export const defaultUsersFixture: User[] = [
  defaultUserFixture,
  { id: 2, name: 'Another User', email: 'another@example.com' },
];
```

### 2. Add a handler

```typescript
// src/lib/mock-service/handlers.ts
import { defaultUsersFixture } from './fixtures/usersFixtures';

http.get(`${API_URL}/users`, () => {
  return HttpResponse.json(defaultUsersFixture);
}),
```

### 3. Create test fixture helpers

```typescript
// src/lib/testing/fixtures/userFixtures.ts
import type { User } from '@/lib/api/models/user.models';

export function createUser(overrides?: Partial<User>): User {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    ...overrides,
  };
}
```

## Best Practices

1. **Use stable IDs**: Mock data should have predictable IDs (1, 2, 3, etc.) for E2E tests
2. **Realistic data**: Use data that reflects production complexity (special characters, edge cases)
3. **Minimal fixtures**: Don't create a fixture for every possible state - only the common ones
4. **Scenario variants**: Use `x-mock-scenario` header for edge cases (errors, empty states, slow responses)
5. **Document mock IDs**: Update this document when adding new fixtures with stable IDs

## References

- [Test Scenario Overrides](./test-scenario-overrides.md) - How the `x-mock-scenario` header works
- [Test Automation](./test-automation.md) - Testing infrastructure overview
- [MSW Documentation](https://mswjs.io/) - Official MSW documentation
