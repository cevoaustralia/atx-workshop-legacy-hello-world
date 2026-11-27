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
      data-favourite={favourite}
      onClick={onClick}
      style={{
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      <div className="text-caption">
        {greeting.languageName}
      </div>
      <div className="text-heading" style={{ margin: '0.375rem 0' }}>{greeting.text}</div>
      {showNote && <div className="text-body">{greeting.note}</div>}
      {favourite && <div className="badge">★ Favourite</div>}
    </div>
  );
};
