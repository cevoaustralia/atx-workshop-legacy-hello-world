import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useGetGreetingsQuery } from '@/app/api/queries/useGetGreetingsQuery';
import { selectGreetingsByLanguage } from '@/app/api/selectors/greetingSelectors';
import { GreetingCard } from '@/app/components/molecule/GreetingCard';
import { useIncrementHelloCount, useFavouriteGreetingId } from '@/app/stores/greetingsStore';
import { Button } from '@/design-system/components';

export const Route = createLazyFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { lang = 'all' } = Route.useSearch();
  const navigate = useNavigate();
  const { data: greetings, isLoading, error } = useGetGreetingsQuery();
  const incrementHelloCount = useIncrementHelloCount();
  const favouriteGreetingId = useFavouriteGreetingId();

  const changeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    navigate({ to: '/', search: value === 'all' ? undefined : { lang: value } });
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div style={{ color: 'var(--color-text-muted)' }}>Something went wrong: {String(error)}</div>;
  if (!greetings) return <div>No greetings found</div>;

  const shown = selectGreetingsByLanguage(greetings, lang);

  return (
    <div>
      <h1 className="text-5xl font-bold mb-1" style={{ color: 'var(--color-text-primary)' }}>
        Hello, World!
      </h1>
      <p className="text-body mt-0">
        Say hello in {greetings.length} languages.
      </p>

      <div className="flex items-center gap-3 my-5">
        <label htmlFor="lang" className="text-body">
          Language:
        </label>
        <select
          id="lang"
          value={lang}
          onChange={changeLang}
          className="px-2 py-1.5 text-sm rounded border border-gray-300"
        >
          <option value="all">All</option>
          {greetings.map((g) => (
            <option key={g.id} value={g.language}>
              {g.languageName}
            </option>
          ))}
        </select>
        <Button onClick={incrementHelloCount}>
          Say hello
        </Button>
      </div>

      <div className="grid">
        {shown.map((g) => (
          <GreetingCard
            key={g.id}
            greeting={g}
            favourite={favouriteGreetingId === g.id}
            onClick={() => navigate({ to: '/greetings/$id', params: { id: String(g.id) } })}
          />
        ))}
      </div>
    </div>
  );
}
