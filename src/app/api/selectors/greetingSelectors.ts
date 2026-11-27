import type { Greeting, GreetingsList } from '../types';

export const selectGreetingById = (greetings: GreetingsList, id: string): Greeting | undefined => {
  return greetings.find((g) => String(g.id) === id);
};

export const selectGreetingsByLanguage = (greetings: GreetingsList, language: string): GreetingsList => {
  if (language === 'all') return greetings;
  return greetings.filter((g) => g.language === language);
};
