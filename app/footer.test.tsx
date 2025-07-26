import React from 'react';
import { render, screen } from '@/lib/test/test-utils';
import { Footer } from '@/app/footer';

describe('Footer Component', () => {
  it('renders footer element', () => {
    render(<Footer />);

    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('provides aria-label for RSS link', () => {
    render(<Footer />);

    expect(screen.getByLabelText('Subscribe to RSS feed')).toBeInTheDocument();
  });

  it('uses semantic footer element', () => {
    render(<Footer />);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('displays expected content', () => {
    render(<Footer />);

    expect(screen.getByText('RSS')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Light theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to Dark theme')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to System theme')).toBeInTheDocument();
  });
});
