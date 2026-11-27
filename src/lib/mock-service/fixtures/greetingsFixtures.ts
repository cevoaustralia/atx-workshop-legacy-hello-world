import type { GreetingsList } from '@/app/api/types';

export const defaultGreetingsFixture: GreetingsList = [
  { id: 1, language: 'en', languageName: 'English', text: 'Hello, World!', note: 'The classic first program.' },
  { id: 2, language: 'es', languageName: 'Spanish', text: '¡Hola, Mundo!', note: 'Spoken by over 500 million people.' },
  { id: 3, language: 'fr', languageName: 'French', text: 'Bonjour, le Monde !', note: 'Note the space before the exclamation mark.' },
  { id: 4, language: 'de', languageName: 'German', text: 'Hallo, Welt!', note: 'Nouns are always capitalised.' },
  { id: 5, language: 'ja', languageName: 'Japanese', text: 'こんにちは、世界！', note: 'Konnichiwa, sekai.' },
  { id: 6, language: 'mi', languageName: 'Māori', text: 'Kia ora, te Ao!', note: 'An official language of Aotearoa New Zealand.' },
];

export const emptyGreetingsFixture: GreetingsList = [];

export const errorGreetingsFixture = null; // Used to trigger error responses
