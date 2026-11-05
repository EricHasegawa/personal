import React from 'react';
import { render, screen } from '@/lib/test/test-utils';
import { Header } from '@/app/header';

describe('Header Component', () => {
  it('renders the site title and byline', () => {
    render(<Header />);

    const titleLink = screen.getByRole('link', {
      name: /thoughts and writings/i,
    });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/');
    expect(screen.getByText('Eric Hasegawa')).toBeInTheDocument();
  });

  it('has proper semantic HTML structure', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/');
  });
});
