import React from 'react';
import { render, screen } from '@testing-library/react';
import EmptyState from '../../app/component/common/EmptyState';

describe('EmptyState Component', () => {
  test('renders title and description', () => {
    render(<EmptyState title="No Results" description="Try changing your filters" />);
    expect(screen.getByText('No Results')).toBeInTheDocument();
    expect(screen.getByText('Try changing your filters')).toBeInTheDocument();
  });

  test('renders action button when actionLabel and onAction are provided', () => {
    render(<EmptyState title="T" description="S" actionLabel="Reset Filters" onAction={() => {}} />);
    expect(screen.getByRole('button', { name: /Reset Filters/i })).toBeInTheDocument();
  });

  test('renders icon', () => {
    const mockIcon = <svg data-testid="mock-icon" />;
    render(<EmptyState title="T" description="S" icon={mockIcon} />);
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  test('renders next/link when actionLabel and actionHref are provided', () => {
    render(<EmptyState title="T" description="S" actionLabel="Go Home" actionHref="/home" />);
    const link = screen.getByRole('link', { name: /Go Home/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/home');
  });

  test('has container div with correct Tailwind classes', () => {
    const { container } = render(<EmptyState title="T" description="S" />);
    expect(container.firstChild).toHaveClass('text-center');
    expect(container.firstChild).toHaveClass('py-16');
  });
});
