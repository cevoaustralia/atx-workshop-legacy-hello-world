/**
 * Component tests for GreetingCard
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GreetingCard } from './GreetingCard';
import { createGreeting } from '@/lib/testing/fixtures';

describe('GreetingCard', () => {
  it('should render greeting text and language name', () => {
    const greeting = createGreeting({
      languageName: 'English',
      text: 'Hello, World!',
    });

    render(<GreetingCard greeting={greeting} />);

    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('should render note when showNote is true', () => {
    const greeting = createGreeting({
      note: 'A classic greeting',
    });

    render(<GreetingCard greeting={greeting} showNote={true} />);

    expect(screen.getByText('A classic greeting')).toBeInTheDocument();
  });

  it('should not render note when showNote is false', () => {
    const greeting = createGreeting({
      note: 'A classic greeting',
    });

    render(<GreetingCard greeting={greeting} showNote={false} />);

    expect(screen.queryByText('A classic greeting')).not.toBeInTheDocument();
  });

  it('should not render note when showNote is undefined', () => {
    const greeting = createGreeting({
      note: 'A classic greeting',
    });

    render(<GreetingCard greeting={greeting} />);

    expect(screen.queryByText('A classic greeting')).not.toBeInTheDocument();
  });

  it('should render favourite badge when favourite is true', () => {
    const greeting = createGreeting();

    render(<GreetingCard greeting={greeting} favourite={true} />);

    expect(screen.getByText('★ Favourite')).toBeInTheDocument();
  });

  it('should not render favourite badge when favourite is false', () => {
    const greeting = createGreeting();

    render(<GreetingCard greeting={greeting} favourite={false} />);

    expect(screen.queryByText('★ Favourite')).not.toBeInTheDocument();
  });

  it('should set data-favourite attribute when favourite is true', () => {
    const greeting = createGreeting();

    const { container } = render(<GreetingCard greeting={greeting} favourite={true} />);
    const card = container.querySelector('.card');

    expect(card).toHaveAttribute('data-favourite', 'true');
  });

  it('should set data-favourite attribute when favourite is false', () => {
    const greeting = createGreeting();

    const { container } = render(<GreetingCard greeting={greeting} favourite={false} />);
    const card = container.querySelector('.card');

    expect(card).toHaveAttribute('data-favourite', 'false');
  });

  it('should call onClick when card is clicked', async () => {
    const greeting = createGreeting();
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<GreetingCard greeting={greeting} onClick={handleClick} />);

    const card = screen.getByText('Hello, World!').closest('.card');
    expect(card).toBeInTheDocument();

    if (card) {
      await user.click(card);
      expect(handleClick).toHaveBeenCalledTimes(1);
    }
  });

  it('should have pointer cursor when onClick is provided', () => {
    const greeting = createGreeting();
    const handleClick = vi.fn();

    const { container } = render(<GreetingCard greeting={greeting} onClick={handleClick} />);
    const card = container.querySelector('.card');

    expect(card).toHaveStyle({ cursor: 'pointer' });
  });

  it('should have default cursor when onClick is not provided', () => {
    const greeting = createGreeting();

    const { container } = render(<GreetingCard greeting={greeting} />);
    const card = container.querySelector('.card');

    expect(card).toHaveStyle({ cursor: 'default' });
  });

  it('should handle special characters in greeting text', () => {
    const greeting = createGreeting({
      languageName: 'Spanish',
      text: '¡Hola, Mundo!',
      note: 'Spoken by over 500 million people.',
    });

    render(<GreetingCard greeting={greeting} showNote={true} />);

    expect(screen.getByText('¡Hola, Mundo!')).toBeInTheDocument();
    expect(screen.getByText('Spanish')).toBeInTheDocument();
    expect(screen.getByText('Spoken by over 500 million people.')).toBeInTheDocument();
  });
});
