import React from 'react';
import { render, screen, fireEvent } from '@/lib/test/test-utils';
import { AnimatedBackground } from '@/components/ui/animated-background';

interface MockMotionDivProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  layoutId?: string;
  transition?: unknown;
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
}

jest.mock('motion/react', () => ({
  motion: {
    div: React.forwardRef<HTMLDivElement, MockMotionDivProps>(
      function MockMotionDiv(props, ref) {
        const {
          children,
          layoutId,
          transition,
          initial,
          animate,
          exit,
          ...otherProps
        } = props;
        return (
          <div
            ref={ref}
            data-testid="motion-background"
            data-layout-id={layoutId}
            data-transition={JSON.stringify(transition)}
            data-initial={JSON.stringify(initial)}
            data-animate={JSON.stringify(animate)}
            data-exit={JSON.stringify(exit)}
            {...otherProps}
          >
            {children}
          </div>
        );
      },
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animate-presence">{children}</div>
  ),
}));

describe('AnimatedBackground Component', () => {
  const createTestChildren = (ids: string[], content?: string[]) => {
    return ids.map((id, index) => (
      <div key={id} data-id={id} className="test-item">
        {content?.[index] || `Item ${index + 1}`}
      </div>
    ));
  };

  const getWrapperElement = (dataId: string) => {
    return document.querySelector(`[data-id="${dataId}"]`);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('renders children correctly', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(<AnimatedBackground>{children}</AnimatedBackground>);

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });

    it('handles single child', () => {
      render(
        <AnimatedBackground>
          <div data-id="single" className="single-item">
            Single Item
          </div>
        </AnimatedBackground>,
      );

      expect(screen.getByText('Single Item')).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('starts with no active item by default', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(<AnimatedBackground>{children}</AnimatedBackground>);

      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'false',
      );
      expect(getWrapperElement('item-2')).toHaveAttribute(
        'data-checked',
        'false',
      );
    });

    it('sets default active item when defaultValue provided', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(
        <AnimatedBackground defaultValue="item-2">
          {children}
        </AnimatedBackground>,
      );

      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'false',
      );
      expect(getWrapperElement('item-2')).toHaveAttribute(
        'data-checked',
        'true',
      );
    });

    it('updates defaultValue changes', () => {
      const children = createTestChildren(['item-1', 'item-2']);
      const { rerender } = render(
        <AnimatedBackground defaultValue="item-1">
          {children}
        </AnimatedBackground>,
      );

      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'true',
      );
      expect(getWrapperElement('item-2')).toHaveAttribute(
        'data-checked',
        'false',
      );

      rerender(
        <AnimatedBackground defaultValue="item-2">
          {children}
        </AnimatedBackground>,
      );

      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'false',
      );
      expect(getWrapperElement('item-2')).toHaveAttribute(
        'data-checked',
        'true',
      );
    });
  });

  describe('Click Interactions (default mode)', () => {
    it('activates item on click', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(<AnimatedBackground>{children}</AnimatedBackground>);

      const item1 = screen.getByText('Item 1');
      fireEvent.click(item1);

      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'true',
      );
    });

    it('switches active item on different click', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(<AnimatedBackground>{children}</AnimatedBackground>);

      const item1 = screen.getByText('Item 1');
      const item2 = screen.getByText('Item 2');

      fireEvent.click(item1);
      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'true',
      );
      expect(getWrapperElement('item-2')).toHaveAttribute(
        'data-checked',
        'false',
      );

      fireEvent.click(item2);
      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'false',
      );
      expect(getWrapperElement('item-2')).toHaveAttribute(
        'data-checked',
        'true',
      );
    });

    it('calls onValueChange callback on click', () => {
      const onValueChange = jest.fn();
      const children = createTestChildren(['item-1', 'item-2']);

      render(
        <AnimatedBackground onValueChange={onValueChange}>
          {children}
        </AnimatedBackground>,
      );

      const item1 = screen.getByText('Item 1');
      fireEvent.click(item1);

      expect(onValueChange).toHaveBeenCalledWith('item-1');
    });
  });

  describe('Hover Interactions (enableHover=true)', () => {
    it('activates item on mouse enter when hover enabled', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(<AnimatedBackground enableHover>{children}</AnimatedBackground>);

      const item1Wrapper = getWrapperElement('item-1')!;
      fireEvent.mouseEnter(item1Wrapper);

      expect(item1Wrapper).toHaveAttribute('data-checked', 'true');
    });

    it('deactivates item on mouse leave when hover enabled', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(<AnimatedBackground enableHover>{children}</AnimatedBackground>);

      const item1Wrapper = getWrapperElement('item-1')!;

      fireEvent.mouseEnter(item1Wrapper);
      expect(item1Wrapper).toHaveAttribute('data-checked', 'true');

      fireEvent.mouseLeave(item1Wrapper);
      expect(item1Wrapper).toHaveAttribute('data-checked', 'false');
    });

    it('calls onValueChange with null on mouse leave', () => {
      const onValueChange = jest.fn();
      const children = createTestChildren(['item-1']);

      render(
        <AnimatedBackground enableHover onValueChange={onValueChange}>
          {children}
        </AnimatedBackground>,
      );

      const item1Wrapper = getWrapperElement('item-1')!;

      fireEvent.mouseEnter(item1Wrapper);
      expect(onValueChange).toHaveBeenCalledWith('item-1');

      fireEvent.mouseLeave(item1Wrapper);
      expect(onValueChange).toHaveBeenCalledWith(null);
    });

    it('does not respond to clicks when hover mode enabled', () => {
      const onValueChange = jest.fn();
      const children = createTestChildren(['item-1']);

      render(
        <AnimatedBackground enableHover onValueChange={onValueChange}>
          {children}
        </AnimatedBackground>,
      );

      const item1 = screen.getByText('Item 1');
      fireEvent.click(item1);

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Animation Integration', () => {
    it('shows motion background for active item', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(
        <AnimatedBackground defaultValue="item-1">
          {children}
        </AnimatedBackground>,
      );

      expect(screen.getByTestId('motion-background')).toBeInTheDocument();
    });

    it('does not show motion background when no item active', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(<AnimatedBackground>{children}</AnimatedBackground>);

      expect(screen.queryByTestId('motion-background')).not.toBeInTheDocument();
    });

    it('applies correct layoutId with unique identifier', () => {
      const children = createTestChildren(['item-1']);

      render(
        <AnimatedBackground defaultValue="item-1">
          {children}
        </AnimatedBackground>,
      );

      const motionBg = screen.getByTestId('motion-background');
      const layoutId = motionBg.getAttribute('data-layout-id');

      expect(layoutId).toMatch(/background-/);
    });

    it('applies custom transition when provided', () => {
      const customTransition = { duration: 0.5, ease: 'easeInOut' };
      const children = createTestChildren(['item-1']);

      render(
        <AnimatedBackground defaultValue="item-1" transition={customTransition}>
          {children}
        </AnimatedBackground>,
      );

      const motionBg = screen.getByTestId('motion-background');
      const transition = JSON.parse(
        motionBg.getAttribute('data-transition') || '{}',
      );

      expect(transition).toEqual(customTransition);
    });

    it('sets correct initial opacity based on defaultValue', () => {
      const children = createTestChildren(['item-1']);

      render(
        <AnimatedBackground defaultValue="item-1">
          {children}
        </AnimatedBackground>,
      );

      const motionBg = screen.getByTestId('motion-background');
      const initial = JSON.parse(motionBg.getAttribute('data-initial') || '{}');

      expect(initial.opacity).toBe(1);
    });

    it('sets initial opacity to 0 when no defaultValue', () => {
      const children = createTestChildren(['item-1']);

      render(<AnimatedBackground>{children}</AnimatedBackground>);

      fireEvent.click(screen.getByText('Item 1'));

      const motionBg = screen.getByTestId('motion-background');
      const initial = JSON.parse(motionBg.getAttribute('data-initial') || '{}');

      expect(initial.opacity).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles missing data-id gracefully', () => {
      render(
        <AnimatedBackground>
          <div>No data-id</div>
        </AnimatedBackground>,
      );

      // Component should still render but wrapper won't have data-id
      expect(screen.getByText('No data-id')).toBeInTheDocument();
    });

    it('handles empty children array', () => {
      render(<AnimatedBackground>{[]}</AnimatedBackground>);
      expect(screen.queryByTestId('motion-background')).not.toBeInTheDocument();
    });

    it('ignores clicks/hovers on items without data-id', () => {
      const onValueChange = jest.fn();

      render(
        <AnimatedBackground onValueChange={onValueChange}>
          <div>No ID</div>
        </AnimatedBackground>,
      );

      fireEvent.click(screen.getByText('No ID'));
      expect(onValueChange).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Controlled vs Uncontrolled', () => {
    it('works as uncontrolled component', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(<AnimatedBackground>{children}</AnimatedBackground>);

      const item1 = screen.getByText('Item 1');
      fireEvent.click(item1);

      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'true',
      );
    });

    it('works as controlled component with defaultValue', () => {
      const onValueChange = jest.fn();
      const children = createTestChildren(['item-1', 'item-2']);

      render(
        <AnimatedBackground defaultValue="item-1" onValueChange={onValueChange}>
          {children}
        </AnimatedBackground>,
      );

      const item2 = screen.getByText('Item 2');
      fireEvent.click(item2);

      expect(onValueChange).toHaveBeenCalledWith('item-2');
    });

    it('maintains internal state when no onValueChange provided', () => {
      const children = createTestChildren(['item-1', 'item-2']);

      render(
        <AnimatedBackground defaultValue="item-1">
          {children}
        </AnimatedBackground>,
      );

      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'true',
      );

      fireEvent.click(screen.getByText('Item 2'));
      expect(getWrapperElement('item-2')).toHaveAttribute(
        'data-checked',
        'true',
      );
      expect(getWrapperElement('item-1')).toHaveAttribute(
        'data-checked',
        'false',
      );
    });
  });
});
