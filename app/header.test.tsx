import React from 'react';
import { render, screen } from '@/lib/test/test-utils';
import { Header } from '@/app/header';

describe('Header Component', () => {
  it('renders the site title and description', () => {
    render(<Header />);

    const titleLink = screen.getByRole('link', { name: /root function/i });
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toHaveAttribute('href', '/');

    const description = screen.getByText(
      /eric hasegawa's thoughts and writings/i,
    );
    expect(description).toBeInTheDocument();
  });

  it('has proper semantic HTML structure', () => {
    render(<Header />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const titleLink = screen.getByRole('link');
    expect(titleLink).toBeInTheDocument();
  });

  it('renders correctly with theme provider', () => {
    render(<Header />);

    expect(screen.getByText('Root Function')).toBeInTheDocument();
    expect(screen.getByText(/thoughts and writings/i)).toBeInTheDocument();
  });
});
