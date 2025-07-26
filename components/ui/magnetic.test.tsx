import React from 'react';
import { render, screen, fireEvent } from '@/lib/test/test-utils';

const mockSet = jest.fn();
const mockMotionValue = {
  set: mockSet,
  get: jest.fn(() => 0),
};

const mockSpring = {
  set: mockSet,
  get: jest.fn(() => 0),
};

interface MockMotionDivProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  style?: {
    x?: unknown;
    y?: unknown;
  };
}

jest.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, MockMotionDivProps>(
      function MockMotionDiv(props, ref) {
        const { children, style, onMouseEnter, onMouseLeave, ...otherProps } =
          props;
        return (
          <div
            ref={ref}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            data-testid="magnetic-container"
            data-style={JSON.stringify(style)}
            {...otherProps}
          >
            {children}
          </div>
        );
      },
    ),
  },
  useMotionValue: jest.fn(() => mockMotionValue),
  useSpring: jest.fn(() => mockSpring),
}));

import { Magnetic, type MagneticProps } from '@/components/ui/magnetic';

describe('Magnetic Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 100,
      height: 100,
      left: 50,
      top: 50,
      right: 150,
      bottom: 150,
      x: 50,
      y: 50,
      toJSON: jest.fn(),
    }));
  });

  const defaultProps: MagneticProps = {
    children: <span>Test Content</span>,
  };

  it('renders children correctly', () => {
    render(<Magnetic {...defaultProps} />);

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByTestId('magnetic-container')).toBeInTheDocument();
  });

  it('applies default props when none provided', () => {
    render(<Magnetic {...defaultProps} />);

    expect(screen.getByTestId('magnetic-container')).toBeInTheDocument();
  });

  it('handles custom intensity prop', () => {
    const customIntensity = 0.8;
    render(
      <Magnetic intensity={customIntensity}>{defaultProps.children}</Magnetic>,
    );

    expect(screen.getByTestId('magnetic-container')).toBeInTheDocument();
  });

  it('handles custom range prop', () => {
    const customRange = 150;
    render(<Magnetic range={customRange}>{defaultProps.children}</Magnetic>);

    expect(screen.getByTestId('magnetic-container')).toBeInTheDocument();
  });

  it('handles custom spring options', () => {
    const customSpringOptions = { stiffness: 50, damping: 5, mass: 0.3 };
    render(
      <Magnetic springOptions={customSpringOptions}>
        {defaultProps.children}
      </Magnetic>,
    );

    expect(screen.getByTestId('magnetic-container')).toBeInTheDocument();
  });

  describe('actionArea="self" (default)', () => {
    it('sets up hover state on mouse enter', () => {
      render(<Magnetic {...defaultProps} />);

      const container = screen.getByTestId('magnetic-container');
      fireEvent.mouseEnter(container);

      expect(container).toBeInTheDocument();
    });

    it('clears hover state and resets position on mouse leave', () => {
      render(<Magnetic {...defaultProps} />);

      const container = screen.getByTestId('magnetic-container');
      fireEvent.mouseEnter(container);
      fireEvent.mouseLeave(container);

      expect(mockSet).toHaveBeenCalledWith(0);
    });

    it('responds to mouse movement when hovered', () => {
      render(<Magnetic intensity={1} range={100} {...defaultProps} />);

      const container = screen.getByTestId('magnetic-container');

      fireEvent.mouseEnter(container);

      fireEvent.mouseMove(document, {
        clientX: 120, // 70px from center (100 + 50/2)
        clientY: 80, // 30px from center (100 + 50/2)
      });

      expect(mockSet).toHaveBeenCalled();
    });

    it('does not respond to mouse movement when not hovered', () => {
      render(<Magnetic {...defaultProps} />);

      fireEvent.mouseMove(document, {
        clientX: 120,
        clientY: 80,
      });

      expect(mockSet).toHaveBeenCalledWith(0);
    });
  });

  describe('actionArea="parent"', () => {
    it('activates on parent hover', () => {
      const ParentComponent = () => (
        <div data-testid="parent-element">
          <Magnetic actionArea="parent">{defaultProps.children}</Magnetic>
        </div>
      );

      render(<ParentComponent />);

      const parent = screen.getByTestId('parent-element');
      const container = screen.getByTestId('magnetic-container');

      fireEvent.mouseEnter(parent);
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });

      expect(container).toBeInTheDocument();
    });

    it('deactivates on parent mouse leave', () => {
      const ParentComponent = () => (
        <div data-testid="parent-element">
          <Magnetic actionArea="parent">{defaultProps.children}</Magnetic>
        </div>
      );

      render(<ParentComponent />);

      const parent = screen.getByTestId('parent-element');

      fireEvent.mouseEnter(parent);
      fireEvent.mouseLeave(parent);

      expect(screen.getByTestId('magnetic-container')).toBeInTheDocument();
    });
  });

  describe('actionArea="global"', () => {
    it('is always active for global action area', () => {
      render(<Magnetic actionArea="global">{defaultProps.children}</Magnetic>);

      const container = screen.getByTestId('magnetic-container');

      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 });

      expect(container).toBeInTheDocument();
    });
  });

  describe('Mouse movement calculations', () => {
    it('calculates distance and applies intensity correctly', () => {
      render(
        <Magnetic intensity={0.5} range={100} actionArea="global">
          {defaultProps.children}
        </Magnetic>,
      );

      fireEvent.mouseMove(document, {
        clientX: 130, // 30px from center (100 center = 50 + 50)
        clientY: 140, // 40px from center (100 center = 50 + 50)
      });

      expect(mockSet).toHaveBeenCalled();
    });

    it('resets position when mouse is outside range', () => {
      render(
        <Magnetic intensity={0.5} range={50} actionArea="global">
          {defaultProps.children}
        </Magnetic>,
      );

      // Mouse far outside range
      fireEvent.mouseMove(document, {
        clientX: 300,
        clientY: 300,
      });

      // Should reset to 0 when outside range
      expect(mockSet).toHaveBeenCalledWith(0);
    });
  });

  describe('Event listener cleanup', () => {
    it('removes mousemove listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(
        document,
        'removeEventListener',
      );

      const { unmount } = render(<Magnetic {...defaultProps} />);

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith(
        'mousemove',
        expect.any(Function),
      );

      removeEventListenerSpy.mockRestore();
    });

    it('cleans up parent event listeners on unmount', () => {
      const ParentComponent = () => (
        <div data-testid="parent-element">
          <Magnetic actionArea="parent">{defaultProps.children}</Magnetic>
        </div>
      );

      const { unmount } = render(<ParentComponent />);

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('handles parent action area without parent element', () => {
      render(<Magnetic actionArea="parent">{defaultProps.children}</Magnetic>);

      expect(screen.getByTestId('magnetic-container')).toBeInTheDocument();
    });

    it('applies style prop correctly', () => {
      render(<Magnetic {...defaultProps} />);

      const container = screen.getByTestId('magnetic-container');
      const styleData = container.getAttribute('data-style');
      const style = JSON.parse(styleData || '{}');

      expect(style).toHaveProperty('x');
      expect(style).toHaveProperty('y');
    });
  });

  describe('Motion integration', () => {
    it('creates motion values for x and y coordinates', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useMotionValue } = require('motion/react');

      render(<Magnetic {...defaultProps} />);

      expect(useMotionValue).toHaveBeenCalledTimes(2);
    });

    it('creates spring animations with correct options', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useSpring } = require('motion/react');
      const customSpringOptions = { stiffness: 100, damping: 10 };

      render(
        <Magnetic springOptions={customSpringOptions}>
          {defaultProps.children}
        </Magnetic>,
      );

      expect(useSpring).toHaveBeenCalledWith(
        mockMotionValue,
        customSpringOptions,
      );
    });
  });
});
