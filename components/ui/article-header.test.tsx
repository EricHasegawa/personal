import React from 'react';
import { render, screen } from '@/lib/test/test-utils';
import { ArticleHeader } from '@/components/ui/article-header';

describe('ArticleHeader Component', () => {
  const defaultProps = {
    title: 'Sample Article Title',
    publishedDate: 'January 1, 2024',
  };

  it('renders title and published date', () => {
    render(<ArticleHeader {...defaultProps} />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Sample Article Title');

    const publishedDate = screen.getByText('January 1, 2024');
    expect(publishedDate).toBeInTheDocument();
  });

  it('has proper semantic HTML structure', () => {
    render(<ArticleHeader {...defaultProps} />);

    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();

    const dateText = screen.getByText('January 1, 2024');
    expect(dateText.tagName).toBe('P');
  });

  it('handles empty title gracefully', () => {
    render(
      <ArticleHeader title="" publishedDate={defaultProps.publishedDate} />,
    );

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('');

    const publishedDate = screen.getByText(defaultProps.publishedDate);
    expect(publishedDate).toBeInTheDocument();
  });

  it('handles empty published date gracefully', () => {
    render(<ArticleHeader title={defaultProps.title} publishedDate="" />);

    const title = screen.getByRole('heading', { level: 1 });
    expect(title).toHaveTextContent('Sample Article Title');

    const publishedDate = screen.getByRole('banner').querySelector('p');
    expect(publishedDate).toBeInTheDocument();
    expect(publishedDate).toHaveTextContent('');
  });

  it('handles special characters in title and date', () => {
    const specialProps = {
      title: 'Article with "Quotes" & Symbols!',
      publishedDate: 'March 15th, 2024',
    };

    render(<ArticleHeader {...specialProps} />);

    expect(
      screen.getByText('Article with "Quotes" & Symbols!'),
    ).toBeInTheDocument();
    expect(screen.getByText('March 15th, 2024')).toBeInTheDocument();
  });
});
