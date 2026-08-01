import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../app/component/common/ThemeToggle';

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('shows moon icon by default in light mode', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  test('toggles theme on click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  test('has accessibility label', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
  });

  test('reads theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'dark');
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  test('reads prefers-color-scheme if no stored theme', () => {
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true,
      media: query,
    }));
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Switch to light mode');
  });
});
