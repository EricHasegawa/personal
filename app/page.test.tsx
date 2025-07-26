import React from 'react';
import { render, screen } from '@/lib/test/test-utils';
import Personal from '@/app/page';
import { BLOG_POSTS, EMAIL, SOCIAL_LINKS } from '@/app/data';

jest.mock('@/components/ui/magnetic', () => ({
  Magnetic: function MockMagnetic({
    children,
    springOptions,
    intensity,
  }: {
    children: React.ReactNode;
    springOptions?: unknown;
    intensity?: number;
  }) {
    return (
      <div
        data-testid="magnetic"
        data-spring-options={JSON.stringify(springOptions)}
        data-intensity={intensity}
      >
        {children}
      </div>
    );
  },
}));

jest.mock('@/components/ui/animated-background', () => ({
  AnimatedBackground: function MockAnimatedBackground({
    children,
    enableHover,
    className,
    transition,
  }: {
    children: React.ReactNode;
    enableHover?: boolean;
    className?: string;
    transition?: unknown;
  }) {
    return (
      <div
        data-testid="animated-background"
        data-enable-hover={enableHover}
        data-transition={JSON.stringify(transition)}
        className={className}
      >
        {children}
      </div>
    );
  },
}));

describe('Personal Page Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders all three main sections', () => {
      render(<Personal />);

      const introductionSection = screen.getByTestId('introduction-section');
      const writingSection = screen.getByTestId('writing-section');
      const connectSection = screen.getByTestId('connect-section');

      expect(introductionSection).toBeInTheDocument();
      expect(writingSection).toBeInTheDocument();
      expect(connectSection).toBeInTheDocument();
    });
  });

  describe('Introduction Section', () => {
    it('renders introduction text content', () => {
      render(<Personal />);

      expect(
        screen.getByText(
          /I'm a founder and engineer currently working at Stripe/i,
        ),
      ).toBeInTheDocument();
    });

    it('renders Streamline Climate link', () => {
      render(<Personal />);

      const streamlineLink = screen.getByRole('link', {
        name: /Streamline Climate/i,
      });
      expect(streamlineLink).toBeInTheDocument();
      expect(streamlineLink).toHaveAttribute(
        'href',
        'https://streamlineclimate.com/',
      );
      expect(streamlineLink).toHaveAttribute('target', '_blank');
      expect(streamlineLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Writing Section', () => {
    it('renders writing section heading', () => {
      render(<Personal />);

      expect(screen.getByText('Writing')).toBeInTheDocument();
    });

    it('renders all blog posts from data', () => {
      render(<Personal />);

      BLOG_POSTS.forEach((post) => {
        expect(screen.getByText(post.title)).toBeInTheDocument();
        expect(screen.getByText(post.description)).toBeInTheDocument();
      });
    });

    it('renders blog post links with correct attributes', () => {
      render(<Personal />);

      BLOG_POSTS.forEach((post) => {
        const postLink = screen.getByRole('link', {
          name: new RegExp(post.title, 'i'),
        });
        expect(postLink).toHaveAttribute('href', post.link);
        expect(postLink).toHaveAttribute('data-id', post.uid);
      });
    });

    it('renders EmailSignup component', () => {
      render(<Personal />);

      const emailInput = screen.getByPlaceholderText('you@example.com');
      const subscribeButton = emailInput.nextElementSibling;

      expect(subscribeButton).toBeInTheDocument();
      expect(subscribeButton).toHaveTextContent('Subscribe');
    });
  });

  describe('Connect Section', () => {
    it('renders connect section heading', () => {
      render(<Personal />);

      expect(screen.getByText('Connect')).toBeInTheDocument();
    });

    it('renders contact email text and link', () => {
      render(<Personal />);

      expect(
        screen.getByText(/Feel free to contact me at/i),
      ).toBeInTheDocument();

      const emailLink = screen.getByRole('link', { name: EMAIL });
      expect(emailLink).toBeInTheDocument();
    });
  });

  describe('Social Link Component (MagneticSocialLink)', () => {
    it('renders social link anchor elements', () => {
      render(<Personal />);

      SOCIAL_LINKS.forEach((link) => {
        const anchorElement = screen.getByRole('link', {
          name: new RegExp(link.label, 'i'),
        });
        expect(anchorElement).toHaveAttribute('href', link.link);
      });
    });
  });

  describe('Accessibility', () => {
    it('provides proper link accessibility', () => {
      render(<Personal />);

      const externalLinks = screen.getAllByRole('link');
      const externalLinkElements = externalLinks.filter(
        (link) => link.getAttribute('target') === '_blank',
      );

      externalLinkElements.forEach((link) => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('provides email link accessibility', () => {
      render(<Personal />);

      const emailLink = screen.getByRole('link', { name: EMAIL });
      expect(emailLink).toHaveAttribute('href', `mailto:${EMAIL}`);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty blog posts gracefully', () => {
      const originalBlogPosts = BLOG_POSTS.slice();
      BLOG_POSTS.length = 0;

      expect(() => {
        render(<Personal />);
      }).not.toThrow();

      BLOG_POSTS.push(...originalBlogPosts);
    });
  });
});
