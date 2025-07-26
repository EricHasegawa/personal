import React, { useRef } from 'react';
import { render, screen } from '@/lib/test/test-utils';

interface MockMotionDivProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  style?: {
    scaleX?: unknown;
  };
}

const mockScrollYProgress = { get: () => 0, set: jest.fn() };
const mockScaleX = { get: () => 0, set: jest.fn() };

jest.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, MockMotionDivProps>(
      function MockMotionDiv(props, ref) {
        const { children, style, ...otherProps } = props;
        return (
          <div
            ref={ref}
            data-testid="scroll-progress"
            data-style={JSON.stringify(style)}
            {...otherProps}
          >
            {children}
          </div>
        );
      },
    ),
  },
  useScroll: jest.fn(() => ({
    scrollYProgress: mockScrollYProgress,
  })),
  useSpring: jest.fn(() => mockScaleX),
}));

import { ScrollProgress } from '@/components/ui/scroll-progress';
import { useScroll, useSpring } from 'motion/react';

const mockUseScroll = useScroll as jest.MockedFunction<typeof useScroll>;
const mockUseSpring = useSpring as jest.MockedFunction<typeof useSpring>;

describe('ScrollProgress Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<ScrollProgress />);

    const progressBar = screen.getByTestId('scroll-progress');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveClass('inset-x-0', 'top-0', 'h-1', 'origin-left');
  });

  it('applies custom className', () => {
    const customClass = 'bg-blue-500 h-2';
    render(<ScrollProgress className={customClass} />);

    const progressBar = screen.getByTestId('scroll-progress');
    expect(progressBar).toHaveClass('bg-blue-500', 'h-2');
    // Should also have default classes
    expect(progressBar).toHaveClass('inset-x-0', 'top-0', 'origin-left');
  });

  it('calls useScroll with default options when no containerRef provided', () => {
    render(<ScrollProgress />);

    expect(mockUseScroll).toHaveBeenCalledWith({
      container: undefined,
      layoutEffect: false,
    });
  });

  it('calls useScroll with containerRef when provided', () => {
    const TestComponent = () => {
      const containerRef = useRef<HTMLDivElement>(null);
      return (
        <ScrollProgress
          containerRef={containerRef as React.RefObject<HTMLDivElement>}
        />
      );
    };

    render(<TestComponent />);

    expect(mockUseScroll).toHaveBeenCalledWith({
      container: expect.any(Object),
      layoutEffect: false,
    });
  });

  it('enables layoutEffect when containerRef has current value', () => {
    const TestComponent = () => {
      const containerRef = useRef<HTMLDivElement>(
        document.createElement('div'),
      );
      return <ScrollProgress containerRef={containerRef} />;
    };

    render(<TestComponent />);

    expect(mockUseScroll).toHaveBeenCalledWith({
      container: expect.any(Object),
      layoutEffect: true,
    });
  });

  it('calls useSpring with default options', () => {
    render(<ScrollProgress />);

    expect(mockUseSpring).toHaveBeenCalledWith(mockScrollYProgress, {
      stiffness: 200,
      damping: 50,
      restDelta: 0.001,
    });
  });

  it('merges custom spring options with defaults', () => {
    const customSpringOptions = {
      stiffness: 300,
      damping: 30,
    };

    render(<ScrollProgress springOptions={customSpringOptions} />);

    expect(mockUseSpring).toHaveBeenCalledWith(mockScrollYProgress, {
      stiffness: 300, // Overridden
      damping: 30, // Overridden
      restDelta: 0.001, // Default preserved
    });
  });

  it('completely replaces spring options when all are provided', () => {
    const customSpringOptions = {
      stiffness: 100,
      damping: 20,
      restDelta: 0.01,
      mass: 1.5,
    };

    render(<ScrollProgress springOptions={customSpringOptions} />);

    expect(mockUseSpring).toHaveBeenCalledWith(mockScrollYProgress, {
      stiffness: 100,
      damping: 20,
      restDelta: 0.01,
      mass: 1.5,
    });
  });

  it('applies scaleX style from useSpring', () => {
    render(<ScrollProgress />);

    const progressBar = screen.getByTestId('scroll-progress');
    const styleData = progressBar.getAttribute('data-style');
    const style = JSON.parse(styleData || '{}');

    expect(style).toHaveProperty('scaleX');
  });

  it('handles empty spring options', () => {
    render(<ScrollProgress springOptions={{}} />);

    expect(mockUseSpring).toHaveBeenCalledWith(mockScrollYProgress, {
      stiffness: 200,
      damping: 50,
      restDelta: 0.001,
    });
  });

  describe('Integration with scroll tracking', () => {
    it('connects scrollYProgress to scaleX animation', () => {
      render(<ScrollProgress />);

      expect(mockUseSpring).toHaveBeenCalledWith(
        mockScrollYProgress,
        expect.any(Object),
      );

      const progressBar = screen.getByTestId('scroll-progress');
      const styleData = progressBar.getAttribute('data-style');
      const style = JSON.parse(styleData || '{}');

      expect(style).toHaveProperty('scaleX');
    });
  });

  describe('Container scroll tracking', () => {
    it('works with document scroll when no containerRef', () => {
      render(<ScrollProgress />);

      expect(mockUseScroll).toHaveBeenCalledWith({
        container: undefined,
        layoutEffect: false,
      });
    });

    it('tracks specific container scroll when containerRef provided', () => {
      const TestWithContainer = () => {
        const containerRef = useRef<HTMLDivElement>(null);

        return (
          <div>
            <div ref={containerRef} data-testid="scroll-container">
              <div style={{ height: '200vh' }}>Long content</div>
            </div>
            <ScrollProgress
              containerRef={containerRef as React.RefObject<HTMLDivElement>}
            />
          </div>
        );
      };

      render(<TestWithContainer />);

      expect(mockUseScroll).toHaveBeenCalledWith({
        container: expect.any(Object),
        layoutEffect: false,
      });

      expect(screen.getByTestId('scroll-progress')).toBeInTheDocument();
      expect(screen.getByTestId('scroll-container')).toBeInTheDocument();
    });
  });

  describe('Animation behavior', () => {
    it('creates smooth spring animation from scroll progress', () => {
      render(<ScrollProgress />);

      expect(mockUseSpring).toHaveBeenCalledWith(
        mockScrollYProgress,
        expect.objectContaining({
          stiffness: expect.any(Number),
          damping: expect.any(Number),
          restDelta: expect.any(Number),
        }),
      );
    });

    it('allows fine-tuning animation through spring options', () => {
      const stiffSpringOptions = {
        stiffness: 500,
        damping: 100,
        restDelta: 0.0001,
      };

      render(<ScrollProgress springOptions={stiffSpringOptions} />);

      expect(mockUseSpring).toHaveBeenCalledWith(
        mockScrollYProgress,
        stiffSpringOptions,
      );
    });
  });
});
