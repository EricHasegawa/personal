import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      enableSystem={true}
      attribute="class"
      storageKey="theme"
      defaultTheme="system"
    >
      {children}
    </ThemeProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export const mockFetch = (
  mockResponse: Record<string, unknown>,
  ok: boolean = true,
) => {
  global.fetch = jest.fn(() => createMockFetchResponse(mockResponse, ok));
};

const createMockFetchResponse = (
  data: Record<string, unknown>,
  ok: boolean = true,
) =>
  Promise.resolve({
    ok,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response);

export * from '@testing-library/react';
export { customRender as render };
