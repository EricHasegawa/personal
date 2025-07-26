import React from 'react';
import userEvent from '@testing-library/user-event';
import { EmailSignup } from '@/components/ui/email-signup';
import { mockFetch, render, screen, waitFor } from '@/lib/test/test-utils';

describe('EmailSignup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email input and submit button', () => {
    render(<EmailSignup />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toBeRequired();

    const submitButton = screen.getByRole('button', { name: /subscribe/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('updates email input value when user types', async () => {
    const user = userEvent.setup();
    render(<EmailSignup />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('submits form with correct email', async () => {
    mockFetch({ success: true }, true);
    const user = userEvent.setup();
    render(<EmailSignup />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(global.fetch).toHaveBeenCalledWith('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
  });

  it('shows success message on successful submission', async () => {
    mockFetch({ success: true }, true);
    const user = userEvent.setup();
    render(<EmailSignup />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Thanks for subscribing!')).toBeInTheDocument();
    });

    expect(emailInput).toHaveValue('');
  });

  it('shows error message on failed submission', async () => {
    mockFetch({ error: 'Server error' }, false);
    const user = userEvent.setup();
    render(<EmailSignup />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('shows error message on network error', async () => {
    global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    const user = userEvent.setup();
    render(<EmailSignup />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    });
  });

  it('disables form during submission', async () => {
    global.fetch = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );
    const user = userEvent.setup();
    render(<EmailSignup />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    await user.type(emailInput, 'test@example.com');
    await user.click(submitButton);

    expect(emailInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Subscribing…');
  });

  it('prevents multiple submissions while in progress', async () => {
    global.fetch = jest.fn(
      () => new Promise((resolve) => setTimeout(resolve, 1000)),
    );
    const user = userEvent.setup();
    render(<EmailSignup />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', { name: /subscribe/i });

    await user.type(emailInput, 'test@example.com');

    await user.click(submitButton);
    await user.click(submitButton);

    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles form submission with Enter key', async () => {
    mockFetch({ success: true }, true);
    const user = userEvent.setup();
    render(<EmailSignup />);

    const emailInput = screen.getByPlaceholderText('you@example.com');

    await user.type(emailInput, 'test@example.com');
    await user.keyboard('{Enter}');

    expect(global.fetch).toHaveBeenCalledWith('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' }),
    });
  });
});
