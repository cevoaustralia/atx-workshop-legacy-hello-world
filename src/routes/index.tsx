import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import HomePage from '../pages/HomePage';

const searchSchema = z.object({
  lang: z.string().optional().default('all'),
});

export const Route = createFileRoute('/')({
  component: HomePage,
  validateSearch: searchSchema,
});
