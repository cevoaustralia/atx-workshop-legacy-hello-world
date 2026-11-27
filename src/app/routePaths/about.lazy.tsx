import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/about')({
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="max-w-2xl leading-relaxed">
      <h2 className="text-heading mb-4">About</h2>
      <p className="text-body">
        This little app says hello in a few languages. It was written in 2019 and has not been touched
        since.
      </p>
      <div 
        className="p-4 rounded border mt-4"
        style={{ 
          background: '#fff3cd', 
          borderColor: '#ffe08a' 
        }}
      >
        <p className="text-body m-0">
          <strong>Tip:</strong> pick a greeting on the home page to make it your favourite.
        </p>
      </div>
    </div>
  );
}
