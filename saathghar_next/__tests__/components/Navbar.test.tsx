import React from 'react';
import { render, screen } from '@testing-library/react';
import Navbar from '../../app/component/common/Navbar';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock cookies-client
jest.mock('@/lib/cookies-client', () => ({
  getCookieClientSide: jest.fn(() => Promise.resolve('')),
}));

// Mock auth-action
jest.mock('@/lib/actions/auth-action', () => ({
  handleLogoutUser: jest.fn(() => Promise.resolve({ success: true })),
}));

describe('Navbar Component', () => {
  test('renders logo', () => {
    render(<Navbar />);
    expect(screen.getByText(/SathGhar/i)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<Navbar />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test('renders login link when not authenticated', () => {
    render(<Navbar />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('has correct href for links', () => {
    render(<Navbar />);
    expect(screen.getByText(/Home/i).closest('a')).toHaveAttribute('href', '/');
  });

  test('is sticky or fixed at top', () => {
    const { container } = render(<Navbar />);
    expect(container.firstChild).toHaveClass('sticky');
  });
});
