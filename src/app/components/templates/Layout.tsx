import React from 'react';
import { Header } from '@/app/components/organism/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="app">
      <Header />
      <div className="content">{children}</div>
      <footer
        style={{
          padding: '12px 24px',
          fontSize: '12px',
          color: '#999999',
          borderTop: '1px solid #eeeeee',
        }}
      >
        Hello World Inc. © 2019
      </footer>
    </div>
  );
};
