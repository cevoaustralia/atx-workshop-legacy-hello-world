import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0' }}>
      <h2 style={{ fontSize: '48px', margin: 0, color: '#cccccc' }}>404</h2>
      <p>Nobody said hello here.</p>
      <Link to="/">Go home</Link>
    </div>
  );
}
