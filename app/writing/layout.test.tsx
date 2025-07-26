import React from 'react';
import { render, screen } from '@testing-library/react';
import LayoutBlogPost from '@/app/writing/layout';

jest.mock('@/components/ui/scroll-progress', () => ({
  ScrollProgress: function MockScrollProgress() {
    return <div data-testid="scroll-progress" />;
  },
}));

describe('LayoutBlogPost Component', () => {
  it('renders the layout with correct structure', () => {
    const mockChildren = (
      <div data-testid="test-content">Test Article Content</div>
    );

    render(<LayoutBlogPost>{mockChildren}</LayoutBlogPost>);

    expect(screen.getByTestId('test-content')).toBeInTheDocument();

    expect(screen.getByRole('main')).toBeInTheDocument();

    expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
  });

  it('handles empty children gracefully', () => {
    expect(() => {
      render(<LayoutBlogPost>{null}</LayoutBlogPost>);
    }).not.toThrow();
  });
});
