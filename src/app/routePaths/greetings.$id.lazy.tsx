import { createLazyFileRoute, Link } from '@tanstack/react-router';
import React from 'react';
import { useGetGreetingsQuery } from '@/app/api/queries/useGetGreetingsQuery';
import { selectGreetingById } from '@/app/api/selectors/greetingSelectors';
import { GreetingCard } from '@/app/components/molecule/GreetingCard';
import { useFavouriteGreetingId, useSetFavouriteGreetingId } from '@/app/stores/greetingsStore';

export const Route = createLazyFileRoute('/greetings/$id')({
  component: GreetingPage,
});

function GreetingPage() {
  const { id } = Route.useParams();
  const { data: greetings, isLoading, error } = useGetGreetingsQuery();
  const favouriteGreetingId = useFavouriteGreetingId();
  const setFavouriteGreetingId = useSetFavouriteGreetingId();

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Something went wrong: {String(error)}</div>;
  if (!greetings) return <div>No greetings found</div>;

  const greeting = selectGreetingById(greetings, id);

  if (!greeting) {
    return (
      <div>
        <p>No greeting with id {id}.</p>
        <Link to="/" search={undefined}>Back</Link>
      </div>
    );
  }

  const isFavourite = favouriteGreetingId === greeting.id;

  return (
    <div style={{ maxWidth: '480px' }}>
      <Link to="/" search={undefined} style={{ color: '#ff6600' }}>
        ← All greetings
      </Link>
      <div style={{ marginTop: '16px' }}>
        <GreetingCard greeting={greeting} favourite={isFavourite} showNote />
      </div>
      <button
        className="btn"
        style={{ marginTop: '16px' }}
        onClick={() => setFavouriteGreetingId(isFavourite ? null : greeting.id)}
      >
        {isFavourite ? 'Remove favourite' : 'Make favourite'}
      </button>
    </div>
  );
}
