import React from 'react';
import axios from 'axios';
import { Link, useParams } from '@tanstack/react-router';
import { connect } from 'react-redux';
import GreetingCard from '../components/GreetingCard';
import { SET_FAVOURITE } from '../store';

const API_URL = import.meta.env.VITE_API_URL || '/api';

class GreetingPage extends React.Component<any, any> {
  state: any = { greeting: null, loading: true, error: null };

  componentDidMount() {
    this.load();
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.params.id !== this.props.params.id) {
      this.load();
    }
  }

  load() {
    this.setState({ loading: true });
    // Fetches the whole list again just to find one item.
    axios
      .get(API_URL + '/greetings.json')
      .then((res: any) => {
        const greeting = res.data.find((g: any) => String(g.id) === this.props.params.id);
        this.setState({ greeting, loading: false });
      })
      .catch((err: any) => this.setState({ error: err.message, loading: false }));
  }

  render() {
    const { greeting, loading, error } = this.state;
    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>Something went wrong: {error}</div>;
    if (!greeting) {
      return (
        <div>
          <p>No greeting with id {this.props.params.id}.</p>
          <Link to="/">Back</Link>
        </div>
      );
    }

    const isFavourite = this.props.favourite === greeting.id;
    return (
      <div style={{ maxWidth: '480px' }}>
        <Link to="/" style={{ color: '#ff6600' }}>
          ← All greetings
        </Link>
        <div style={{ marginTop: '16px' }}>
          <GreetingCard greeting={greeting} favourite={isFavourite} showNote />
        </div>
        <button
          className="btn"
          style={{ marginTop: '16px' }}
          onClick={() => this.props.setFavourite(isFavourite ? null : greeting.id)}
        >
          {isFavourite ? 'Remove favourite' : 'Make favourite'}
        </button>
      </div>
    );
  }
}

// Wrapper to inject TanStack Router params
function GreetingPageWrapper(props: any) {
  const params = useParams({ from: '/greetings/$id' });
  return <GreetingPage {...props} params={params} />;
}

const mapStateToProps = (state: any) => ({ favourite: state.favourite });
const mapDispatchToProps = (dispatch: any) => ({
  setFavourite: (id: any) => dispatch({ type: SET_FAVOURITE, payload: id }),
});

export default connect(mapStateToProps, mapDispatchToProps)(GreetingPageWrapper);
