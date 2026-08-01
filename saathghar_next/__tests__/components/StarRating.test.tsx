import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StarRating from '../../app/component/common/StarRating';

describe('StarRating Component', () => {
  test('renders 5 stars by default', () => {
    const { container } = render(<StarRating rating={0} />);
    const stars = container.querySelectorAll('svg');
    expect(stars.length).toBe(5);
  });

  test('highlights correct number of stars based on rating', () => {
    const { container } = render(<StarRating rating={3} />);
    const yellowStars = container.querySelectorAll('.text-yellow-400');
    expect(yellowStars.length).toBe(3);
  });

  test('calls onChange when a star is clicked', () => {
    const mockOnChange = jest.fn();
    const { container } = render(<StarRating rating={0} onChange={mockOnChange} interactive={true} />);
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[3]); // Click 4th star button
    expect(mockOnChange).toHaveBeenCalledWith(4);
  });

  test('does not call onChange when not interactive', () => {
    const mockOnChange = jest.fn();
    const { container } = render(<StarRating rating={0} onChange={mockOnChange} interactive={false} />);
    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[3]);
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
