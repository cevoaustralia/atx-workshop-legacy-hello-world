/**
 * Test fixture helpers
 * Reusable builders for test data
 */
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

/**
 * Create an empty greetings list
 */
export function createEmptyGreetingsList(): GreetingsList {
  return [];
}
