/**
 * Unit tests for Valibot greeting models and validators
 */
import { describe, it, expect } from 'vitest';
import * as v from 'valibot';
import {
  GreetingSchema,
  GreetingsListSchema,
  parseGreeting,
  parseGreetingsList,
} from './greeting.models';
import { createGreeting, createGreetingsList } from '@/lib/testing/fixtures';

describe('greeting.models', () => {
  describe('GreetingSchema', () => {
    it('should validate a valid greeting', () => {
      const greeting = createGreeting();
      const result = v.safeParse(GreetingSchema, greeting);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toEqual(greeting);
      }
    });

    it('should reject greeting with missing required field', () => {
      const invalid = { id: 1, language: 'en' }; // missing languageName, text, note
      const result = v.safeParse(GreetingSchema, invalid);
      
      expect(result.success).toBe(false);
    });

    it('should reject greeting with wrong type', () => {
      const invalid = createGreeting({ id: '1' as any }); // id should be number
      const result = v.safeParse(GreetingSchema, invalid);
      
      expect(result.success).toBe(false);
    });

    it('should reject null', () => {
      const result = v.safeParse(GreetingSchema, null);
      
      expect(result.success).toBe(false);
    });

    it('should reject undefined', () => {
      const result = v.safeParse(GreetingSchema, undefined);
      
      expect(result.success).toBe(false);
    });
  });

  describe('GreetingsListSchema', () => {
    it('should validate a valid greetings list', () => {
      const greetings = createGreetingsList(3);
      const result = v.safeParse(GreetingsListSchema, greetings);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toHaveLength(3);
      }
    });

    it('should validate an empty array', () => {
      const result = v.safeParse(GreetingsListSchema, []);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.output).toHaveLength(0);
      }
    });

    it('should reject non-array', () => {
      const result = v.safeParse(GreetingsListSchema, { greetings: [] });
      
      expect(result.success).toBe(false);
    });

    it('should reject array with invalid greeting', () => {
      const invalid = [
        createGreeting(),
        { id: 'invalid' }, // Invalid greeting
      ];
      const result = v.safeParse(GreetingsListSchema, invalid);
      
      expect(result.success).toBe(false);
    });
  });

  describe('parseGreeting', () => {
    it('should parse valid greeting', () => {
      const greeting = createGreeting();
      const result = parseGreeting(greeting);
      
      expect(result).toEqual(greeting);
    });

    it('should throw on invalid data', () => {
      const invalid = { id: 'not-a-number' };
      
      expect(() => parseGreeting(invalid)).toThrow();
    });

    it('should throw on null', () => {
      expect(() => parseGreeting(null)).toThrow();
    });

    it('should throw on undefined', () => {
      expect(() => parseGreeting(undefined)).toThrow();
    });

    it('should preserve all fields', () => {
      const greeting = createGreeting({
        id: 42,
        language: 'mi',
        languageName: 'Māori',
        text: 'Kia ora, te Ao!',
        note: 'An official language of Aotearoa New Zealand.',
      });
      const result = parseGreeting(greeting);
      
      expect(result).toEqual(greeting);
    });
  });

  describe('parseGreetingsList', () => {
    it('should parse valid greetings list', () => {
      const greetings = createGreetingsList(3);
      const result = parseGreetingsList(greetings);
      
      expect(result).toEqual(greetings);
      expect(result).toHaveLength(3);
    });

    it('should parse empty array', () => {
      const result = parseGreetingsList([]);
      
      expect(result).toEqual([]);
    });

    it('should throw on non-array', () => {
      expect(() => parseGreetingsList('not an array')).toThrow();
    });

    it('should throw on array with invalid item', () => {
      const invalid = [createGreeting(), { invalid: 'data' }];
      
      expect(() => parseGreetingsList(invalid)).toThrow();
    });

    it('should throw on null', () => {
      expect(() => parseGreetingsList(null)).toThrow();
    });
  });
});
