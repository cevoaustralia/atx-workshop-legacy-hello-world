import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useHelloCount } from '@/app/stores/greetingsStore';

export const Header: React.FC = () => {
  const helloCount = useHelloCount();
  const router = useRouterState();
  const pathname = router.location.pathname;

  const linkStyle = (active: boolean): React.CSSProperties => ({
    color: active ? '#ff6600' : '#ffffff',
    marginLeft: '18px',
    textDecoration: 'none',
    fontWeight: active ? 'bold' : 'normal',
  });

  return (
    <div className="header">
      <span style={{ fontSize: '22px', fontWeight: 'bold' }}>👋 Hello World</span>
      <span style={{ float: 'right' }}>
        <Link to="/" search={undefined} style={linkStyle(pathname === '/')}>
          Home
        </Link>
        <Link to="/about" search={undefined} style={linkStyle(pathname === '/about')}>
          About
        </Link>
        <span style={{ marginLeft: '18px', color: '#ffcc00' }}>Hellos: {helloCount}</span>
      </span>
    </div>
  );
};
