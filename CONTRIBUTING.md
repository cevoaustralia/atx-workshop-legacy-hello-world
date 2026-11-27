# Contributing Guide

## Development Setup

```bash
npm ci
npm start              # Development server
npm run start:mock     # Development with MSW mocking
npm run build          # Production build
```

## Architecture Overview

This is a **modern React application** using:
- TanStack Router for file-based routing
- TanStack Query for server state
- Zustand for client state
- MSW for API mocking
- Atomic-design component structure

See [docs/project-overview.md](docs/project-overview.md) for complete architecture details.

## Development Conventions

### Path Alias

Use `@/` for all imports from `src/`:

```typescript
// ✅ Good
import { useGetGreetingsQuery } from '@/app/api/queries/useGetGreetingsQuery';

// ❌ Bad
import { useGetGreetingsQuery } from '../../../app/api/queries/useGetGreetingsQuery';
```

### TypeScript

- **Strict mode enabled** - No `any` types without justification
- **Explicit return types** for exported functions
- **Infer types** from Valibot schemas, don't duplicate

### Component Placement

Follow atomic-design principles in `src/app/components/`:

| Level | Use Case | Examples |
|-------|----------|----------|
| `atom/` | Single-element wrappers | Link, Icon, Button |
| `molecule/` | 2+ atoms, one purpose | InputField, GreetingCard |
| `organism/` | Complex sections with logic | Header, SideNav |
| `templates/` | Page layouts | Layout, Page, TileGrid |

**Feature pages** go in `src/app/pages/`, not in components.

See [src/app/components/README.md](src/app/components/README.md) for detailed rules.

### Routing

#### Adding a Route

1. **Create route config** in `src/app/routePaths/`:

```typescript
// src/app/routePaths/users.$id.tsx
import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';

const searchSchema = v.object({
  tab: v.optional(v.string()),
});

type SearchSchema = v.InferOutput<typeof searchSchema>;

export const Route = createFileRoute('/users/$id')({
  validateSearch: (search): SearchSchema => v.parse(searchSchema, search),
});
```

2. **Create lazy component**:

```typescript
// src/app/routePaths/users.$id.lazy.tsx
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/users/$id')({
  component: UserDetailPage,
});

function UserDetailPage() {
  const { id } = Route.useParams();
  const { tab } = Route.useSearch();
  // Component implementation
}
```

3. Route tree regenerates automatically on dev server restart.

See [docs/tanstack-router.md](docs/tanstack-router.md) for complete routing guide.

### Data Fetching

#### Create Wrapper Hooks

**Always use wrapper hooks**, never call axios or generated clients directly.

```typescript
// src/app/api/queries/useGetUsersQuery.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { User } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get<User[]>(`${API_URL}/users.json`);
  return response.data;
};

export const useGetUsersQuery = () => {
  return useQuery({
    queryKey: ['users', 'list'],
    queryFn: fetchUsers,
  });
};
```

#### Use in Components

```typescript
import { useGetUsersQuery } from '@/app/api/queries/useGetUsersQuery';

function UserList() {
  const { data: users, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;

  return <ul>{users?.map(user => <li key={user.id}>{user.name}</li>)}</ul>;
}
```

See [docs/tanstack-query.md](docs/tanstack-query.md) for complete data fetching guide.

### State Management

#### Zustand Stores

Create stores in `src/app/stores/` with:
- **sessionStorage persistence**
- **Atomic selectors** for granular subscriptions

```typescript
// src/app/stores/userStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  preferences: UserPreferences;
  setPreferences: (prefs: UserPreferences) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      preferences: {},
      setPreferences: (prefs) => set({ preferences: prefs }),
    }),
    {
      name: 'user-storage',
      storage: {
        getItem: (name) => {
          const str = sessionStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => {
          sessionStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => sessionStorage.removeItem(name),
      },
    }
  )
);

// Atomic selectors
export const useUserPreferences = () => 
  useUserStore((state) => state.preferences);
export const useSetUserPreferences = () => 
  useUserStore((state) => state.setPreferences);
```

See [docs/zustand-state-management.md](docs/zustand-state-management.md) for complete guide.

### Mocking APIs

#### Add Fixtures

```typescript
// src/lib/mock-service/fixtures/usersFixtures.ts
import type { User } from '@/app/api/types';

export const defaultUsersFixture: User[] = [
  { id: 1, name: 'Alice', role: 'admin' },
  { id: 2, name: 'Bob', role: 'user' },
];

export const emptyUsersFixture: User[] = [];
```

#### Add Handler

```typescript
// src/lib/mock-service/handlers.ts
import { http, HttpResponse } from 'msw';
import { defaultUsersFixture, emptyUsersFixture } from './fixtures/usersFixtures';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const handlers = [
  // ... existing handlers
  http.get(`${API_URL}/users.json`, ({ request }) => {
    const scenarioHeader = request.headers.get('x-mock-scenario');
    
    if (scenarioHeader?.includes('users.state=empty')) {
      return HttpResponse.json(emptyUsersFixture);
    }
    
    return HttpResponse.json(defaultUsersFixture);
  }),
];
```

See [docs/test-scenario-overrides.md](docs/test-scenario-overrides.md) for complete mocking guide.

### Feature Flags

#### Add a Flag

```typescript
// src/app/featureFlag/featureFlagStore.ts

// 1. Add key
export const FEATURE_FLAG_KEYS = {
  // ... existing
  NEW_FEATURE: 'new_feature',
} as const;

// 2. Add configuration
const FEATURE_FLAGS = {
  // ... existing
  [FEATURE_FLAG_KEYS.NEW_FEATURE]: { 
    demo: true,  // Enabled in dev/demo
    dev: true,
    prod: false  // Disabled in production
  },
};
```

#### Use in Components

```typescript
import { FeatureFlagGate, FEATURE_FLAG_KEYS } from '@/app/featureFlag/featureFlagStore';

function MyComponent() {
  return (
    <FeatureFlagGate featureKey={FEATURE_FLAG_KEYS.NEW_FEATURE}>
      <NewFeature />
    </FeatureFlagGate>
  );
}
```

See [docs/feature-flagging.md](docs/feature-flagging.md) for complete guide.

## Code Quality

### Type Safety

```typescript
// ✅ Good - explicit types
function processUser(user: User): UserProfile {
  return { id: user.id, name: user.name };
}

// ❌ Bad - implicit any
function processUser(user) {
  return { id: user.id, name: user.name };
}
```

### Atomic Selectors

```typescript
// ✅ Good - atomic selector
const count = useHelloCount();

// ❌ Bad - subscribes to entire store
const count = useGreetingsStore((state) => state.helloCount);
```

### Navigation

```typescript
// ✅ Good - typed navigation
navigate({ to: '/users/$id', params: { id: '123' } });

// ❌ Bad - string navigation
navigate('/users/123');
```

## Testing

(To be added by test-automation engineer)

## Build and Deployment

```bash
# Type check
npm run build  # Runs tsc --noEmit && vite build

# Production build
npm run build

# Preview production build
npm run preview
```

## Questions?

See documentation in `docs/` or ask in team channels.
