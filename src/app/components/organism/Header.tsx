import React from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { useHelloCount } from '@/app/stores/greetingsStore';
import { cn } from '@/design-system/lib/utils';

export const Header: React.FC = () => {
  const helloCount = useHelloCount();
  const router = useRouterState();
  const pathname = router.location.pathname;

  return (
    <header className="header">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">👋 Hello World</span>
        
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            search={undefined}
            className={cn(
              "no-underline transition-colors hover:opacity-80",
              pathname === '/' 
                ? "font-bold" 
                : "font-normal"
            )}
            style={{ 
              color: pathname === '/' 
                ? 'var(--color-brand-primary)' 
                : 'var(--color-text-on-dark)' 
            }}
          >
            Home
          </Link>
          
          <Link
            to="/about"
            search={undefined}
            className={cn(
              "no-underline transition-colors hover:opacity-80",
              pathname === '/about' 
                ? "font-bold" 
                : "font-normal"
            )}
            style={{ 
              color: pathname === '/about' 
                ? 'var(--color-brand-primary)' 
                : 'var(--color-text-on-dark)' 
            }}
          >
            About
          </Link>
          
          <span style={{ color: '#ffcc00' }}>
            Hellos: {helloCount}
          </span>
        </nav>
      </div>
    </header>
  );
};
