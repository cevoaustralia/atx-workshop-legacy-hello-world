/**
 * Unit tests for greeting selectors
 */
import { describe, it, expect } from 'vitest';
import {
  selectGreetingById,
  selectGreetingsByLanguage,
  selectUniqueLanguages,
  selectLanguageCounts,
} from './greetingSelectors';
import { createGreeting, createGreetingsList, createEmptyGreetingsList } from '@/lib/testing/fixtures';

describe('greetingSelectors', () => {
  describe('selectGreetingById', () => {
    it('should return greeting when ID matches', () => {
      const greetings = createGreetingsList(3);
      const result = selectGreetingById(greetings, '2');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe(2);
    });

    it('should return undefined when ID does not match', () => {
      const greetings = createGreetingsList(3);
      const result = selectGreetingById(greetings, '999');
      
      expect(result).toBeUndefined();
    });

    it('should handle empty list', () => {
      const greetings = createEmptyGreetingsList();
      const result = selectGreetingById(greetings, '1');
      
      expect(result).toBeUndefined();
    });

    it('should convert numeric ID to string for comparison', () => {
      const greetings = [createGreeting({ id: 42 })];
      const result = selectGreetingById(greetings, '42');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe(42);
    });
  });

  describe('selectGreetingsByLanguage', () => {
    it('should return all greetings when language is "all"', () => {
      const greetings = createGreetingsList(6);
      const result = selectGreetingsByLanguage(greetings, 'all');
      
      expect(result).toHaveLength(6);
      expect(result).toEqual(greetings);
    });

    it('should filter greetings by language code', () => {
      const greetings = [
        createGreeting({ id: 1, language: 'en' }),
        createGreeting({ id: 2, language: 'es' }),
        createGreeting({ id: 3, language: 'en' }),
      ];
      const result = selectGreetingsByLanguage(greetings, 'en');
      
      expect(result).toHaveLength(2);
      expect(result[0]?.language).toBe('en');
      expect(result[1]?.language).toBe('en');
    });

    it('should return empty list when no matches', () => {
      const greetings = createGreetingsList(3);
      const result = selectGreetingsByLanguage(greetings, 'de');
      
      expect(result).toHaveLength(0);
    });

    it('should handle empty input list', () => {
      const greetings = createEmptyGreetingsList();
      const result = selectGreetingsByLanguage(greetings, 'en');
      
      expect(result).toHaveLength(0);
    });
  });

  describe('selectUniqueLanguages', () => {
    it('should return unique language codes', () => {
      const greetings = [
        createGreeting({ language: 'en' }),
        createGreeting({ language: 'es' }),
        createGreeting({ language: 'en' }),
        createGreeting({ language: 'fr' }),
      ];
      const result = selectUniqueLanguages(greetings);
      
      expect(result).toHaveLength(3);
      expect(result).toContain('en');
      expect(result).toContain('es');
      expect(result).toContain('fr');
    });

    it('should handle empty list', () => {
      const greetings = createEmptyGreetingsList();
      const result = selectUniqueLanguages(greetings);
      
      expect(result).toHaveLength(0);
    });

    it('should handle list with single language', () => {
      const greetings = [
        createGreeting({ language: 'en' }),
        createGreeting({ language: 'en' }),
      ];
      const result = selectUniqueLanguages(greetings);
      
      expect(result).toHaveLength(1);
      expect(result[0]).toBe('en');
    });
  });

  describe('selectLanguageCounts', () => {
    it('should count greetings by language', () => {
      const greetings = [
        createGreeting({ language: 'en' }),
        createGreeting({ language: 'es' }),
        createGreeting({ language: 'en' }),
        createGreeting({ language: 'fr' }),
        createGreeting({ language: 'en' }),
      ];
      const result = selectLanguageCounts(greetings);
      
      expect(result).toEqual({
        en: 3,
        es: 1,
        fr: 1,
      });
    });

    it('should handle empty list', () => {
      const greetings = createEmptyGreetingsList();
      const result = selectLanguageCounts(greetings);
      
      expect(result).toEqual({});
    });

    it('should handle single greeting', () => {
      const greetings = [createGreeting({ language: 'en' })];
      const result = selectLanguageCounts(greetings);
      
      expect(result).toEqual({ en: 1 });
    });
  });
});
