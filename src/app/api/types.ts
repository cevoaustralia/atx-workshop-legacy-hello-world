/**
 * @deprecated Use types from @/lib/api/models/greeting.models instead
 * 
 * These hand-written types are replaced by Valibot schema-derived types.
 * This file is kept for backwards compatibility during migration.
 * 
 * Migration guide:
 * - import { Greeting } from './types' 
 *   → import { Greeting } from '@/lib/api/models/greeting.models'
 * - import { GreetingsList } from './types'
 *   → import { GreetingsList } from '@/lib/api/models/greeting.models'
 */

/**
 * @deprecated Use Greeting from @/lib/api/models/greeting.models
 */
export interface Greeting {
  id: number;
  language: string;
  languageName: string;
  text: string;
  note: string;
}

/**
 * @deprecated Use GreetingsList from @/lib/api/models/greeting.models
 */
export type GreetingsList = Greeting[];
