import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../../app/component/common/Footer';

describe('Footer Component', () => {
  test('renders copyright information', () => {
    render(<Footer />);
    expect(screen.getByText(/©/)).toBeInTheDocument();
    const companyNames = screen.getAllByText(/SathGhar/);
    expect(companyNames.length).toBeGreaterThan(0);
  });

  test('renders social media links', () => {
    render(<Footer />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  test('renders section headings', () => {
    render(<Footer />);
    expect(screen.getByText(/Platform Links/i)).toBeInTheDocument();
  });

  test('renders individual navigation links correctly', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /Find Partners/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Book a Room/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /How it Works/i })).toBeInTheDocument();
  });

  test('renders description text describing the SathGhar service', () => {
    render(<Footer />);
    expect(screen.getByText(/trusted portal to find matching roommates/i)).toBeInTheDocument();
  });
});
