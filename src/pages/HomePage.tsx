import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { useNavigate, useSearch } from '@tanstack/react-router';
import GreetingCard from '../components/GreetingCard';
import { SAY_HELLO } from '../store';

const API_URL = import.meta.env.VITE_API_URL || '/api';

function HomePage(props: any) {
  const [greetings, setGreetings] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const navigate = useNavigate();
  const search = useSearch({ from: '/' });
  const lang = search.lang;

  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL + '/greetings.json')
      .then((res: any) => {
        setGreetings(res.data);
        setLoading(false);
      })
      .catch((err: any) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const changeLang = (e: any) => {
    const value = e.target.value;
    navigate({ to: '/', search: value === 'all' ? {} : { lang: value } });
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Something went wrong: {error}</div>;

  const shown = lang === 'all' ? greetings : greetings.filter((g: any) => g.language === lang);

  return (
    <div>
      <h1 style={{ fontSize: '40px', color: '#333333', marginBottom: '4px' }}>Hello, World!</h1>
      <p style={{ color: '#777777', marginTop: 0 }}>Say hello in {greetings.length} languages.</p>

      <div style={{ margin: '20px 0' }}>
        <label htmlFor="lang" style={{ marginRight: '8px' }}>
          Language:
        </label>
        <select id="lang" value={lang} onChange={changeLang} style={{ padding: '6px', fontSize: '14px' }}>
          <option value="all">All</option>
          {greetings.map((g: any) => (
            <option key={g.id} value={g.language}>
              {g.languageName}
            </option>
          ))}
        </select>
        <button className="btn" style={{ marginLeft: '12px' }} onClick={props.sayHello}>
          Say hello
        </button>
      </div>

      <div className="grid">
        {shown.map((g: any) => (
          <GreetingCard
            key={g.id}
            greeting={g}
            favourite={props.favourite === g.id}
            onClick={() => navigate({ to: '/greetings/$id', params: { id: String(g.id) } })}
          />
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state: any) => ({ favourite: state.favourite });
const mapDispatchToProps = (dispatch: any) => ({
  sayHello: () => dispatch({ type: SAY_HELLO }),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
