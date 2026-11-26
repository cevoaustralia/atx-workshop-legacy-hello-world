import React from 'react';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import Header from '../components/Header';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <Outlet />
      </div>
      <footer style={{ padding: '12px 24px', fontSize: '12px', color: '#999999', borderTop: '1px solid #eeeeee' }}>
        Hello World Inc. © 2019
      </footer>
    </div>
  );
}
