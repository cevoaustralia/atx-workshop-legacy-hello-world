import { createFileRoute } from '@tanstack/react-router';
import * as v from 'valibot';

const searchSchema = v.object({
  lang: v.optional(v.string()),
});

type SearchSchema = v.InferOutput<typeof searchSchema>;

export const Route = createFileRoute('/')({
  validateSearch: (search): SearchSchema => v.parse(searchSchema, search),
});
