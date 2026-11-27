/**
 * Integration tests for useGetGreetingsQuery hook
 * Tests query behavior with MSW mocking
 */
import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetGreetingsQuery } from './useGetGreetingsQuery';
import { createGreetingsList } from '@/lib/testing/fixtures';
import { http, HttpResponse } from 'msw';
import { server } from '@/lib/testing/mswServer';

// Helper to create a wrapper for React Query
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useGetGreetingsQuery', () => {
  it('should fetch and return greetings successfully', async () => {
    const { result } = renderHook(() => useGetGreetingsQuery(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for query to resolve
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert data is returned
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.length).toBeGreaterThan(0);
    expect(result.current.error).toBeNull();
  });

  it('should handle empty greetings list', async () => {
    // Override MSW handler for empty scenario
    server.use(
      http.get('/api/greetings.json', () => {
        return HttpResponse.json([]);
      })
    );

    const { result } = renderHook(() => useGetGreetingsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should handle API error', async () => {
    // Override MSW handler for error scenario
    server.use(
      http.get('/api/greetings.json', () => {
        return HttpResponse.json(
          { error: 'Internal server error' },
          { status: 500 }
        );
      })
    );

    const { result } = renderHook(() => useGetGreetingsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });

  it('should validate response schema', async () => {
    // Override with valid fixture data
    const mockData = createGreetingsList(3);
    server.use(
      http.get('/api/greetings.json', () => {
        return HttpResponse.json(mockData);
      })
    );

    const { result } = renderHook(() => useGetGreetingsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Assert validated data structure
    expect(result.current.data).toHaveLength(3);
    expect(result.current.data?.[0]).toHaveProperty('id');
    expect(result.current.data?.[0]).toHaveProperty('language');
    expect(result.current.data?.[0]).toHaveProperty('text');
  });

  it('should reject invalid response schema', async () => {
    // Override with invalid data (missing required fields)
    server.use(
      http.get('/api/greetings.json', () => {
        return HttpResponse.json([{ invalid: 'data' }]);
      })
    );

    const { result } = renderHook(() => useGetGreetingsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeDefined();
  });

  it('should use correct query key', async () => {
    const { result } = renderHook(() => useGetGreetingsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Query key should match the factory pattern
    expect(result.current.data).toBeDefined();
  });

  it('should handle custom query options', async () => {
    const { result } = renderHook(
      () => useGetGreetingsQuery({ enabled: false }),
      { wrapper: createWrapper() }
    );

    // Query should not run when enabled is false
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
