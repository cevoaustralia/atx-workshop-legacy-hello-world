import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import GreetingPage from './pages/GreetingPage';
import AboutPage from './pages/AboutPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/greetings/:id" component={GreetingPage} />
          <Route path="/about" component={AboutPage} />
          <Redirect from="/home" to="/" />
          <Route path="*" component={NotFound} />
        </Switch>
      </div>
      <footer style={{ padding: '12px 24px', fontSize: '12px', color: '#999999', borderTop: '1px solid #eeeeee' }}>
        Hello World Inc. © 2019
      </footer>
    </div>
  );
}
