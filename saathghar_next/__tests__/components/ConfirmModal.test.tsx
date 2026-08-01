import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmModal from '../../app/component/common/ConfirmModal';

describe('ConfirmModal Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  test('renders title and message when open', () => {
    render(
      <ConfirmModal 
        isOpen={true} 
        title="Delete Item" 
        message="Are you sure?" 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  test('does not render when closed', () => {
    render(
      <ConfirmModal 
        isOpen={false} 
        title="Title" 
        message="Msg" 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    expect(screen.queryByText('Title')).not.toBeInTheDocument();
  });

  test('calls onConfirm when confirm button clicked', () => {
    render(
      <ConfirmModal 
        isOpen={true} 
        title="Title" 
        message="Msg" 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  test('calls onCancel when cancel button clicked', () => {
    render(
      <ConfirmModal 
        isOpen={true} 
        title="Title" 
        message="Msg" 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  test('renders custom button labels', () => {
    render(
      <ConfirmModal 
        isOpen={true} 
        title="Delete" 
        message="Are you sure?" 
        confirmLabel="Yes, delete it" 
        cancelLabel="No, keep it" 
        onConfirm={mockOnConfirm} 
        onCancel={mockOnCancel} 
      />
    );
    expect(screen.getByText('Yes, delete it')).toBeInTheDocument();
    expect(screen.getByText('No, keep it')).toBeInTheDocument();
  });
});
