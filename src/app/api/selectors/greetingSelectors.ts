/**
 * Selector functions for greeting data transformations
 * Types are derived from Valibot schemas, not hand-written
 */
import type { Greeting, GreetingsList } from '@/lib/api/models/greeting.models';

/**
 * Select a single greeting by ID
 * 
 * @param greetings - List of greetings
 * @param id - Greeting ID as string
 * @returns Greeting if found, undefined otherwise
 */
export function selectGreetingById(
  greetings: GreetingsList, 
  id: string
): Greeting | undefined {
  return greetings.find((g) => String(g.id) === id);
}

/**
 * Filter greetings by language
 * 
 * @param greetings - List of greetings
 * @param language - Language code or 'all'
 * @returns Filtered list of greetings
 */
export function selectGreetingsByLanguage(
  greetings: GreetingsList, 
  language: string
): GreetingsList {
  if (language === 'all') {
    return greetings;
  }
  return greetings.filter((g) => g.language === language);
}

/**
 * Get unique languages from greetings list
 * 
 * @param greetings - List of greetings
 * @returns Array of unique language codes
 */
export function selectUniqueLanguages(greetings: GreetingsList): string[] {
  return Array.from(new Set(greetings.map((g) => g.language)));
}

/**
 * Get greeting count by language
 * 
 * @param greetings - List of greetings
 * @returns Map of language code to count
 */
export function selectLanguageCounts(
  greetings: GreetingsList
): Record<string, number> {
  return greetings.reduce(
    (acc, greeting) => {
      acc[greeting.language] = (acc[greeting.language] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
}
