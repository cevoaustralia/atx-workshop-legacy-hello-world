/**
 * MSW server setup for Node.js environment (tests)
 * Reuses the same handlers as the browser setup
 */
import { setupServer } from 'msw/node';
import { handlers } from '@/lib/mock-service/handlers';

export const server = setupServer(...handlers);
