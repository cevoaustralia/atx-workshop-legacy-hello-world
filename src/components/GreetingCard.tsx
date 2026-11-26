import React from 'react';

export default function GreetingCard(props: any) {
  return (
    <div
      className="card"
      onClick={props.onClick}
      style={{ borderColor: props.favourite ? '#ff6600' : '#dddddd', cursor: props.onClick ? 'pointer' : 'default' }}
    >
      <div style={{ fontSize: '11px', color: '#888888', textTransform: 'uppercase' }}>{props.greeting.languageName}</div>
      <div style={{ fontSize: '26px', margin: '6px 0' }}>{props.greeting.text}</div>
      {props.showNote && <div style={{ fontSize: '14px', color: '#555555' }}>{props.greeting.note}</div>}
      {props.favourite && <div className="badge">★ Favourite</div>}
    </div>
  );
}
