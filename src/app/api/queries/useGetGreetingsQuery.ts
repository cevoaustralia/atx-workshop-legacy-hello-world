/**
 * Wrapper hook for fetching greetings
 * Uses typed API client and Valibot schema validation
 * 
 * This follows the wrapper hook pattern where we:
 * 1. Use the typed apiClient for HTTP calls
 * 2. Validate responses with Valibot schemas
 * 3. Provide sensible defaults for query options
 * 4. Keep return types derived from the schema
 */
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/mutator/axiosClient';
import { 
  GreetingsList, 
  parseGreetingsList 
} from '@/lib/api/models/greeting.models';

/**
 * Query key factory for greetings
 */
export const greetingsQueryKeys = {
  all: ['greetings'] as const,
  lists: () => [...greetingsQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, unknown>) => 
    [...greetingsQueryKeys.lists(), filters] as const,
  details: () => [...greetingsQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...greetingsQueryKeys.details(), id] as const,
};

/**
 * Fetch and validate greetings list
 */
const fetchGreetings = async (): Promise<GreetingsList> => {
  const data = await apiClient.get<unknown>('/greetings.json');
  return parseGreetingsList(data);
};

/**
 * Hook to fetch greetings list with TanStack Query
 * 
 * @param options - Optional query configuration
 * @returns Query result with typed data
 */
export function useGetGreetingsQuery(
  options?: Omit<
    UseQueryOptions<GreetingsList, Error, GreetingsList, ReturnType<typeof greetingsQueryKeys.lists>>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<GreetingsList, Error> {
  return useQuery({
    queryKey: greetingsQueryKeys.lists(),
    queryFn: fetchGreetings,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
}
