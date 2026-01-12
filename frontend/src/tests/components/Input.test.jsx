import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../../components/common/Input';

describe('Input', () => {
  it('renders input with label', () => {
    render(<Input label="Email" name="email" />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders required indicator', () => {
    render(<Input label="Email" name="email" required />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();
    render(
      <Input
        name="email"
        value=""
        onChange={handleChange}
      />
    );
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message', () => {
    render(
      <Input
        name="email"
        error="Email is required"
      />
    );
    
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  it('renders password input with toggle', () => {
    render(<Input type="password" name="password" />);
    const input = screen.getByRole('textbox', { hidden: true });
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility', () => {
    render(<Input type="password" name="password" />);
    const toggleButton = screen.getByRole('button');
    
    fireEvent.click(toggleButton);
    const input = screen.getByRole('textbox', { hidden: true });
    expect(input).toHaveAttribute('type', 'text');
  });

  it('renders with icon', () => {
    const icon = <span data-testid="icon">@</span>;
    render(<Input name="email" icon={icon} />);
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('displays helper text', () => {
    render(
      <Input
        name="email"
        helperText="Enter your email address"
      />
    );
    
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input name="email" disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
});

