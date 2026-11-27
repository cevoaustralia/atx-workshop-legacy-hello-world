import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div style={{ maxWidth: '600px', lineHeight: '1.6' }}>
      <h2 style={{ color: '#333333' }}>About</h2>
      <p>
        This little app says hello in a few languages. It was written in 2019 and has not been touched
        since.
      </p>
      <p style={{ background: '#fff3cd', padding: '10px', border: '1px solid #ffe08a' }}>
        Tip: pick a greeting on the home page to make it your favourite.
      </p>
    </div>
  );
}
