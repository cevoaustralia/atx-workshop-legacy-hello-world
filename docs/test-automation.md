# Test Automation Infrastructure

This project uses a comprehensive three-tier testing strategy: **Vitest** for unit and integration tests, **Playwright** for smoke tests (E2E), and **fixture-first MSW** mocking for all test layers.

## Table of Contents

- [Test Suites](#test-suites)
- [Running Tests](#running-tests)
- [Test Structure](#test-structure)
- [Fixture-First Testing](#fixture-first-testing)
- [MSW Mocking Strategy](#msw-mocking-strategy)
- [Writing Tests](#writing-tests)
- [Coverage Tracking](#coverage-tracking)

---

## Test Suites

### 1. Vitest (Unit & Integration Tests)

**Location**: Colocated with source files (`*.test.ts`, `*.test.tsx`)

**Purpose**: Test individual functions, components, hooks, and stores in isolation

**Technology**:
- Vitest v5.1.2
- @testing-library/react v16.3.3
- @testing-library/jest-dom v8.0.0
- jsdom environment

**Current Coverage**:
- ✅ Valibot schema validators (19 tests)
- ✅ Greeting selectors (14 tests)
- ✅ GreetingCard component (12 tests)
- ✅ Zustand store (12 tests)
- ✅ TanStack Query hooks (7 tests)
- **Total: 64 tests**

### 2. Playwright (Smoke Tests)

**Location**: `e2e/smoke/`

**Purpose**: Verify every route renders and critical user flows work end-to-end

**Technology**:
- Playwright v1.65.1
- Desktop Chrome configuration
- Runs against mocked API (`npm run start:mock`)

**Current Coverage**:
- ✅ Home page (5 tests)
- ✅ Greeting detail page (6 tests)
- ✅ About page (3 tests)
- **Total: 14 tests**
- **Route Coverage: 100% (3/3 routes)**

### 3. MSW Mocking

**Location**: 
- Handlers: `src/lib/mock-service/handlers.ts`
- Fixtures: `src/lib/mock-service/fixtures/`
- Test server: `src/lib/testing/mswServer.ts`
- Test fixtures: `src/lib/testing/fixtures/`

**Purpose**: Provide deterministic, fixture-first API responses for all tests

---

## Running Tests

### Unit & Integration Tests (Vitest)

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

### Smoke Tests (Playwright)

```bash
# Install Playwright browsers (first time only)
npm run playwright:install

# Run all smoke tests (automatically starts mock server)
npm run playwright:run:smoke

# Run smoke coverage check
npm run smoke:check-coverage
```

### Build Verification

```bash
# Type-check and build (includes test files in type-checking)
npm run build
```

---

## Test Structure

### Unit Test Example

```typescript
// src/app/api/selectors/greetingSelectors.test.ts
import { describe, it, expect } from 'vitest';
import { selectGreetingById } from './greetingSelectors';
import { createGreeting, createGreetingsList } from '@/lib/testing/fixtures';

describe('selectGreetingById', () => {
  it('should return greeting when ID matches', () => {
    const greetings = createGreetingsList(3);
    const result = selectGreetingById(greetings, '2');
    
    expect(result).toBeDefined();
    expect(result?.id).toBe(2);
  });
});
```

### Component Test Example

```typescript
// src/app/components/molecule/GreetingCard.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GreetingCard } from './GreetingCard';
import { createGreeting } from '@/lib/testing/fixtures';

describe('GreetingCard', () => {
  it('should render greeting text and language name', () => {
    const greeting = createGreeting({
      languageName: 'English',
      text: 'Hello, World!',
    });

    render(<GreetingCard greeting={greeting} />);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });
});
```

### Integration Test Example

```typescript
// src/app/api/queries/useGetGreetingsQuery.test.tsx
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetGreetingsQuery } from './useGetGreetingsQuery';

describe('useGetGreetingsQuery', () => {
  it('should fetch and return greetings successfully', async () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetGreetingsQuery(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBeGreaterThan(0);
  });
});
```

### Smoke Test Example

```typescript
// e2e/smoke/home/home-page.spec.ts
import { test, expect, logIn } from '../utils/test';

test.describe('Home Page', () => {
  test('should render home page with greetings list', async ({ page }) => {
    await logIn(page);

    await expect(page.getByRole('heading', { name: 'Hello, World!' })).toBeVisible();
    await expect(page.getByRole('combobox', { name: 'Language:' })).toBeVisible();
    await expect(page.getByText('English')).toBeVisible();
  });
});
```

---

## Fixture-First Testing

**Philosophy**: Never duplicate large inline JSON. Always use reusable fixtures.

### Test Fixture Helpers

**Location**: `src/lib/testing/fixtures/`

```typescript
// src/lib/testing/fixtures/greetingFixtures.ts
import type { Greeting, GreetingsList } from '@/lib/api/models/greeting.models';

/**
 * Create a greeting with optional overrides
 */
export function createGreeting(overrides?: Partial<Greeting>): Greeting {
  return {
    id: 1,
    language: 'en',
    languageName: 'English',
    text: 'Hello, World!',
    note: 'The classic first program.',
    ...overrides,
  };
}

/**
 * Create a list of greetings
 */
export function createGreetingsList(count: number = 3): GreetingsList {
  return Array.from({ length: count }, (_, i) => 
    createGreeting({ 
      id: i + 1,
      language: ['en', 'es', 'fr'][i % 3],
      languageName: ['English', 'Spanish', 'French'][i % 3],
      text: ['Hello, World!', '¡Hola, Mundo!', 'Bonjour, le Monde !'][i % 3],
    })
  );
}
```

### Fixture Priority

1. **Helper fixtures** from `src/lib/testing/fixtures/` (e.g. `createGreeting`, `createGreetingsList`)
2. **Generated response builders** (future: when Orval is set up, `getXxxResponseMock`)
3. **Minimal inline payloads** (only as a last resort)

---

## MSW Mocking Strategy

### Architecture

- **Browser MSW**: `src/lib/mock-service/browser.ts` (for `npm run start:mock`)
- **Node MSW**: `src/lib/testing/mswServer.ts` (for Vitest tests)
- **Shared handlers**: `src/lib/mock-service/handlers.ts`
- **Shared fixtures**: `src/lib/mock-service/fixtures/`

### Default Handler

```typescript
// src/lib/mock-service/handlers.ts
import { http, HttpResponse } from 'msw';
import { defaultGreetingsFixture } from './fixtures/greetingsFixtures';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const handlers = [
  http.get(`${API_URL}/greetings.json`, () => {
    return HttpResponse.json(defaultGreetingsFixture);
  }),
];
```

### Test-Specific Overrides

```typescript
// In a test file
import { http, HttpResponse } from 'msw';
import { server } from '@/lib/testing/mswServer';

test('should handle empty greetings list', async () => {
  server.use(
    http.get('/api/greetings.json', () => {
      return HttpResponse.json([]);
    })
  );

  // Test proceeds with empty response
});
```

### Scenario Header Support

For more complex scenarios, use the `x-mock-scenario` header:

```typescript
// src/lib/mock-service/handlers.ts
http.get(`${API_URL}/greetings.json`, ({ request }) => {
  const scenarioHeader = request.headers.get('x-mock-scenario');
  
  if (scenarioHeader?.includes('greetings.state=empty')) {
    return HttpResponse.json([]);
  }
  
  if (scenarioHeader?.includes('greetings.state=error')) {
    return HttpResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
  
  return HttpResponse.json(defaultGreetingsFixture);
}),
```

---

## Writing Tests

### Rules

1. **Fixture-first**: Use `createGreeting()`, `createGreetingsList()` instead of inline JSON
2. **Descriptive names**: Test names should clearly state what they verify
3. **Arrange-Act-Assert**: Structure tests in three clear phases
4. **Independent tests**: Each test should be self-contained
5. **Type-safe**: Let TypeScript catch errors (don't use `any`)

### Component Testing Best Practices

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('MyComponent', () => {
  it('should handle user interaction', async () => {
    // Arrange: Set up fixture and mocks
    const handleClick = vi.fn();
    const user = userEvent.setup();
    const greeting = createGreeting();

    // Act: Render and interact
    render(<MyComponent greeting={greeting} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));

    // Assert: Verify outcome
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Smoke Testing Best Practices

```typescript
test.describe('Feature Area', () => {
  test('should verify critical user flow', async ({ page }) => {
    // 1. Setup - navigate or login if needed
    await logIn(page);
    
    // 2. Navigate to feature
    await page.goto('/feature');
    
    // 3. Assert critical UI renders
    await expect(page.getByRole('heading')).toBeVisible();
    
    // 4. Perform action
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // 5. Assert outcome
    await expect(page.getByText('Success')).toBeVisible();
  });
});
```

---

## Coverage Tracking

### Smoke Test Route Coverage

**Tool**: `e2e/smoke/utils/smoke-coverage-check.ts`

```bash
npm run smoke:check-coverage
```

**Output**:
```
📊 Smoke Test Route Coverage Report

Total routes: 3
Covered routes: 3
Coverage: 100%

✅ All routes are covered by smoke tests!
```

### Adding a New Route

1. Add the route to `APPLICATION_ROUTES` in `smoke-coverage-check.ts`
2. Write a smoke test spec in `e2e/smoke/<feature-area>/`
3. Add the route to `COVERED_ROUTES`
4. Run `npm run smoke:check-coverage` to verify

### Unit Test Coverage

```bash
npm run test:coverage
```

This generates an HTML report in `coverage/index.html`.

---

## CI/CD Integration

### Recommended CI Pipeline

```yaml
# .github/workflows/test.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      # Unit & Integration Tests
      - run: npm ci
      - run: npm test
      
      # Build verification
      - run: npm run build
      
      # Smoke Tests
      - run: npx playwright install --with-deps chromium
      - run: npm run playwright:run:smoke
      
      # Coverage check
      - run: npm run smoke:check-coverage
```

---

## Test Files Summary

### Unit Tests (Vitest)
- `src/lib/api/models/greeting.models.test.ts` - Valibot schema validators (19 tests)
- `src/app/api/selectors/greetingSelectors.test.ts` - Selector functions (14 tests)
- `src/app/components/molecule/GreetingCard.test.tsx` - Component rendering (12 tests)
- `src/app/stores/greetingsStore.test.ts` - Zustand store (12 tests)
- `src/app/api/queries/useGetGreetingsQuery.test.tsx` - TanStack Query hooks (7 tests)

### Smoke Tests (Playwright)
- `e2e/smoke/home/home-page.spec.ts` - Home page flows (5 tests)
- `e2e/smoke/greetings/greeting-detail.spec.ts` - Detail page flows (6 tests)
- `e2e/smoke/about/about-page.spec.ts` - About page (3 tests)

### Infrastructure
- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration
- `src/lib/testing/setup.ts` - Vitest setup file (MSW initialization)
- `src/lib/testing/mswServer.ts` - MSW server for Node environment
- `src/lib/testing/fixtures/` - Test fixture helpers
- `e2e/smoke/utils/test.ts` - Playwright test utilities
- `e2e/smoke/utils/smoke-coverage-check.ts` - Coverage tracking

---

## Troubleshooting

### "window.CONFIG not found, using defaults"

This warning appears in test output because the tests run in jsdom without the runtime config. It's harmless - the app falls back to sensible defaults.

### Playwright tests not found

Make sure to run `npm run playwright:install` first to install the Chromium browser.

### MSW handler not working in tests

Check that:
1. The handler is in `src/lib/mock-service/handlers.ts`
2. The server is started in `src/lib/testing/setup.ts`
3. The URL matches exactly (including `/api` prefix)

### Type errors in tests

Run `npm run build` to see all TypeScript errors, including those in test files.

---

## Next Steps

Future enhancements:
- [ ] Add Orval API generation for type-safe MSW mocks
- [ ] Add visual regression tests with Percy or Chromatic
- [ ] Add accessibility tests with @axe-core/playwright
- [ ] Increase coverage targets (aim for 80%+ on critical paths)
- [ ] Add performance tests for query hooks
- [ ] Add E2E tests for error scenarios (network failures, etc.)
