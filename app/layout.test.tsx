import { render, screen } from '@testing-library/react';
import RootLayout, { metadata } from '@/app/layout';
import React from 'react';

describe('RootLayout Component', () => {
  const mockChildren = <div data-testid="page-content">Test Page Content</div>;

  describe('Metadata Exports', () => {
    it('exports correct metadata configuration', () => {
      expect(metadata).toEqual({
        metadataBase: new URL('https://nim-fawn.vercel.app/'),
        alternates: {
          canonical: '/',
        },
        title: {
          default: 'Rootfn',
          template: '%s | Rootfn',
        },
        description: "Rootfn is Eric Hasegawa's personal website.",
      });
    });

    it('has correct metadata base URL', () => {
      expect(metadata.metadataBase?.toString()).toBe(
        'https://nim-fawn.vercel.app/',
      );
    });

    it('has correct title template format', () => {
      const title = metadata.title as { template: string; default: string };
      expect(title?.template).toBe('%s | Rootfn');
      expect(title?.default).toBe('Rootfn');
    });
  });

  describe('Component Structure', () => {
    it('renders with html and body elements', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const htmlElement = document.querySelector('html');
      expect(htmlElement).toBeInTheDocument();
      expect(htmlElement).toHaveAttribute('lang', 'en');
    });

    it('includes RSS feed link in head', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const rssLink = document.querySelector(
        'link[type="application/rss+xml"]',
      );
      expect(rssLink).toBeInTheDocument();
      expect(rssLink?.getAttribute('title')).toBe('Root Fn RSS Feed');
      expect(rssLink?.getAttribute('href')).toBe('api/rss.xml');
    });

    it('renders Header component', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('renders Footer component', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('renders children content', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      expect(screen.getByTestId('page-content')).toBeInTheDocument();
      expect(screen.getByText('Test Page Content')).toBeInTheDocument();
    });
  });

  describe('Layout Structure', () => {
    it('maintains correct component order', () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const contentWrapper = document.querySelector(
        '.relative.mx-auto.w-full.max-w-screen-md',
      )!;
      const children = Array.from(contentWrapper.children);

      expect(children[0]).toHaveAttribute('data-testid', 'header');
      expect(children[1]).toHaveAttribute('data-testid', 'page-content');
      expect(children[2]).toHaveAttribute('data-testid', 'footer');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty children gracefully', () => {
      expect(() => {
        render(<RootLayout>{null}</RootLayout>);
      }).not.toThrow();
    });

    it('handles multiple children', () => {
      const multipleChildren = (
        <>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </>
      );

      render(<RootLayout>{multipleChildren}</RootLayout>);

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });
});
