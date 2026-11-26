import { createFileRoute } from '@tanstack/react-router';
import GreetingPage from '../pages/GreetingPage';

export const Route = createFileRoute('/greetings/$id')({
  component: GreetingPage,
});
