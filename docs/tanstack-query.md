# TanStack Query Data Fetching

This application uses **TanStack Query v5** for server state management.

## Wrapper Hook Pattern

**Always use wrapper hooks, never generated hooks directly.**

Wrapper hooks live in:
- `src/app/api/queries/` - Query hooks
- `src/app/api/mutations/` - Mutation hooks
- `src/app/api/selectors/` - Data transform functions

### Example: Query Wrapper Hook

**src/app/api/queries/useGetGreetingsQuery.ts**
```typescript
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { GreetingsList } from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const fetchGreetings = async (): Promise<GreetingsList> => {
  const response = await axios.get<GreetingsList>(`${API_URL}/greetings.json`);
  return response.data;
};

export const useGetGreetingsQuery = () => {
  return useQuery({
    queryKey: ['greetings', 'list'],
    queryFn: fetchGreetings,
  });
};
```

### Usage in Components

```typescript
import { useGetGreetingsQuery } from '@/app/api/queries/useGetGreetingsQuery';

function MyComponent() {
  const { data: greetings, isLoading, error } = useGetGreetingsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {String(error)}</div>;
  
  return <div>{greetings?.length} greetings</div>;
}
```

## Data Selectors

Data transformation logic belongs in selectors, not components:

**src/app/api/selectors/greetingSelectors.ts**
```typescript
import type { Greeting, GreetingsList } from '../types';

export const selectGreetingById = (
  greetings: GreetingsList, 
  id: string
): Greeting | undefined => {
  return greetings.find((g) => String(g.id) === id);
};

export const selectGreetingsByLanguage = (
  greetings: GreetingsList, 
  language: string
): GreetingsList => {
  if (language === 'all') return greetings;
  return greetings.filter((g) => g.language === language);
};
```

## Query Keys

Use hierarchical query keys for cache management:

```typescript
// Good - hierarchical
['greetings', 'list']
['greetings', 'detail', id]
['users', 'list', { page, filter }]

// Bad - flat
['getGreetings']
['greeting_123']
```

## Query Configuration

The global QueryClient is configured in `src/main.tsx`:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

## Mutations

For mutations, follow the same wrapper pattern:

**src/app/api/mutations/useUpdateGreetingMutation.ts**
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const useUpdateGreetingMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateGreetingData) => {
      const response = await axios.put(`/api/greetings/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['greetings'] });
    },
  });
};
```

## Why Wrapper Hooks?

1. **Centralized configuration** - Query keys, error handling, transformations
2. **Type safety** - Proper TypeScript inference
3. **Testability** - Easy to mock at the wrapper level
4. **Consistency** - Single source of truth for each API call
5. **Future-proofing** - Easy to add auth, logging, error handling globally
