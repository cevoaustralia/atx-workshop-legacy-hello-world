import { createLazyFileRoute, Link } from '@tanstack/react-router';
import { useGetGreetingsQuery } from '@/app/api/queries/useGetGreetingsQuery';
import { selectGreetingById } from '@/app/api/selectors/greetingSelectors';
import { GreetingCard } from '@/app/components/molecule/GreetingCard';
import { useFavouriteGreetingId, useSetFavouriteGreetingId } from '@/app/stores/greetingsStore';
import { Button } from '@/design-system/components';

export const Route = createLazyFileRoute('/greetings/$id')({
  component: GreetingPage,
});

function GreetingPage() {
  const { id } = Route.useParams();
  const { data: greetings, isLoading, error } = useGetGreetingsQuery();
  const favouriteGreetingId = useFavouriteGreetingId();
  const setFavouriteGreetingId = useSetFavouriteGreetingId();

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div style={{ color: 'var(--color-text-muted)' }}>Something went wrong: {String(error)}</div>;
  if (!greetings) return <div>No greetings found</div>;

  const greeting = selectGreetingById(greetings, id);

  if (!greeting) {
    return (
      <div>
        <p>No greeting with id {id}.</p>
        <Link 
          to="/" 
          search={undefined}
          className="no-underline hover:opacity-80"
          style={{ color: 'var(--color-brand-primary)' }}
        >
          Back
        </Link>
      </div>
    );
  }

  const isFavourite = favouriteGreetingId === greeting.id;

  return (
    <div className="max-w-lg">
      <Link 
        to="/" 
        search={undefined}
        className="no-underline hover:opacity-80"
        style={{ color: 'var(--color-brand-primary)' }}
      >
        ← All greetings
      </Link>
      
      <div className="mt-4">
        <GreetingCard greeting={greeting} favourite={isFavourite} showNote />
      </div>
      
      <Button
        className="mt-4"
        onClick={() => setFavouriteGreetingId(isFavourite ? null : greeting.id)}
      >
        {isFavourite ? 'Remove favourite' : 'Make favourite'}
      </Button>
    </div>
  );
}
