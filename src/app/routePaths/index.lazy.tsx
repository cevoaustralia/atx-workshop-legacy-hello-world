import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import React from 'react';
import { useGetGreetingsQuery } from '@/app/api/queries/useGetGreetingsQuery';
import { selectGreetingsByLanguage } from '@/app/api/selectors/greetingSelectors';
import { GreetingCard } from '@/app/components/molecule/GreetingCard';
import { useIncrementHelloCount, useFavouriteGreetingId } from '@/app/stores/greetingsStore';

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
  if (error) return <div style={{ color: 'red' }}>Something went wrong: {String(error)}</div>;
  if (!greetings) return <div>No greetings found</div>;

  const shown = selectGreetingsByLanguage(greetings, lang);

  return (
    <div>
      <h1 style={{ fontSize: '40px', color: '#333333', marginBottom: '4px' }}>Hello, World!</h1>
      <p style={{ color: '#777777', marginTop: 0 }}>Say hello in {greetings.length} languages.</p>

      <div style={{ margin: '20px 0' }}>
        <label htmlFor="lang" style={{ marginRight: '8px' }}>
          Language:
        </label>
        <select
          id="lang"
          value={lang}
          onChange={changeLang}
          style={{ padding: '6px', fontSize: '14px' }}
        >
          <option value="all">All</option>
          {greetings.map((g) => (
            <option key={g.id} value={g.language}>
              {g.languageName}
            </option>
          ))}
        </select>
        <button className="btn" style={{ marginLeft: '12px' }} onClick={incrementHelloCount}>
          Say hello
        </button>
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
