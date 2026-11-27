import React from 'react';
import type { Greeting } from '@/lib/api/models/greeting.models';

interface GreetingCardProps {
  greeting: Greeting;
  favourite?: boolean;
  showNote?: boolean;
  onClick?: () => void;
}

export const GreetingCard: React.FC<GreetingCardProps> = ({ greeting, favourite, showNote, onClick }) => {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        borderColor: favourite ? '#ff6600' : '#dddddd',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div style={{ fontSize: '11px', color: '#888888', textTransform: 'uppercase' }}>
        {greeting.languageName}
      </div>
      <div style={{ fontSize: '26px', margin: '6px 0' }}>{greeting.text}</div>
      {showNote && <div style={{ fontSize: '14px', color: '#555555' }}>{greeting.note}</div>}
      {favourite && <div className="badge">★ Favourite</div>}
    </div>
  );
};
