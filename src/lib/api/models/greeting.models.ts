/**
 * Valibot schemas for API models
 * These are the source of truth for type definitions
 * Types are inferred from schemas, not hand-written
 */
import * as v from 'valibot';

/**
 * Greeting model schema
 */
export const GreetingSchema = v.object({
  id: v.number(),
  language: v.string(),
  languageName: v.string(),
  text: v.string(),
  note: v.string(),
});

/**
 * Greetings list schema
 */
export const GreetingsListSchema = v.array(GreetingSchema);

/**
 * Inferred types from schemas
 * These replace the hand-written interfaces in src/app/api/types.ts
 */
export type Greeting = v.InferOutput<typeof GreetingSchema>;
export type GreetingsList = v.InferOutput<typeof GreetingsListSchema>;

/**
 * Validate and parse a greeting response
 */
export function parseGreeting(data: unknown): Greeting {
  return v.parse(GreetingSchema, data);
}

/**
 * Validate and parse a greetings list response
 */
export function parseGreetingsList(data: unknown): GreetingsList {
  return v.parse(GreetingsListSchema, data);
}
