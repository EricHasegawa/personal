import React, { useRef } from 'react';
import { render, screen, fireEvent } from '@/lib/test/test-utils';
import useClickOutside from '@/hooks/useClickOutside';

const TestComponent = ({ onClickOutside }: { onClickOutside: jest.Mock }) => {
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref as React.RefObject<HTMLElement>, onClickOutside);

  return (
    <div data-testid="container">
      <div data-testid="target" ref={ref}>
        Target Element
      </div>
      <div data-testid="outside">Outside Element</div>
    </div>
  );
};

describe('useClickOutside hook', () => {
  let mockHandler: jest.Mock;

  beforeEach(() => {
    mockHandler = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls handler when clicking outside the target element', () => {
    render(<TestComponent onClickOutside={mockHandler} />);

    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it('does not call handler when clicking inside the target element', () => {
    render(<TestComponent onClickOutside={mockHandler} />);

    const targetElement = screen.getByTestId('target');
    fireEvent.mouseDown(targetElement);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('does not call handler when clicking on the target element itself', () => {
    render(<TestComponent onClickOutside={mockHandler} />);

    const targetElement = screen.getByTestId('target');
    fireEvent.mouseDown(targetElement);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('calls handler when clicking on document body', () => {
    render(<TestComponent onClickOutside={mockHandler} />);

    fireEvent.mouseDown(document.body);

    expect(mockHandler).toHaveBeenCalledTimes(1);
  });

  it('handles touchstart events', () => {
    render(<TestComponent onClickOutside={mockHandler} />);

    const outsideElement = screen.getByTestId('outside');
    fireEvent.touchStart(outsideElement);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(expect.any(TouchEvent));
  });

  it('does not call handler on touchstart inside target', () => {
    render(<TestComponent onClickOutside={mockHandler} />);

    const targetElement = screen.getByTestId('target');
    fireEvent.touchStart(targetElement);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('properly cleans up event listeners on unmount', () => {
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

    const { unmount } = render(<TestComponent onClickOutside={mockHandler} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'mousedown',
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'touchstart',
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });

  it('handles null ref gracefully', () => {
    const NullRefComponent = ({
      onClickOutside,
    }: {
      onClickOutside: jest.Mock;
    }) => {
      const ref = useRef<HTMLDivElement>(null);
      useClickOutside(ref as React.RefObject<HTMLElement>, onClickOutside);

      return (
        <div data-testid="container">
          <div data-testid="outside">Outside Element</div>
        </div>
      );
    };

    render(<NullRefComponent onClickOutside={mockHandler} />);

    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it('updates handler when handler function changes', () => {
    const firstHandler = jest.fn();
    const secondHandler = jest.fn();

    const { rerender } = render(
      <TestComponent onClickOutside={firstHandler} />,
    );

    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).not.toHaveBeenCalled();

    rerender(<TestComponent onClickOutside={secondHandler} />);

    fireEvent.mouseDown(outsideElement);

    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledTimes(1);
  });
});
