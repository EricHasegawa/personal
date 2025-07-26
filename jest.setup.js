import '@testing-library/jest-dom';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    };
  },
  useSearchParams() {
    return new URLSearchParams();
  },
  usePathname() {
    return '/';
  },
}));

jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    resolvedTheme: 'light',
    themes: ['light', 'dark', 'system'],
  }),
  ThemeProvider: ({ children }) => children,
}));

jest.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => (
      <section {...props}>{children}</section>
    ),
    main: ({ children, ...props }) => <main {...props}>{children}</main>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
  useMotionValue: () => ({ set: jest.fn() }),
  useSpring: () => ({ set: jest.fn() }),
}));

jest.mock('motion/react-client', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
}));

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

global.Request = class Request {
  constructor(input, init = {}) {
    this.url = typeof input === 'string' ? input : input.url;
    this.method = init.method || 'GET';
    this.headers = new Headers(init.headers);
    this.body = init.body;
    this._bodyUsed = false;
  }

  async json() {
    if (this._bodyUsed) {
      throw new Error('Body has already been read');
    }
    this._bodyUsed = true;
    return JSON.parse(this.body);
  }

  async text() {
    if (this._bodyUsed) {
      throw new Error('Body has already been read');
    }
    this._bodyUsed = true;
    return this.body;
  }
};

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || 'OK';
    this.headers = new Headers(init.headers);
    this._bodyUsed = false;
  }

  async json() {
    if (this._bodyUsed) {
      throw new Error('Body has already been read');
    }
    this._bodyUsed = true;
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
  }

  async text() {
    if (this._bodyUsed) {
      throw new Error('Body has already been read');
    }
    this._bodyUsed = true;
    return typeof this.body === 'string'
      ? this.body
      : JSON.stringify(this.body);
  }
};

global.Headers = class Headers {
  constructor(init = {}) {
    this.map = new Map();
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.map.set(key.toLowerCase(), value);
      });
    }
  }

  get(name) {
    return this.map.get(name.toLowerCase());
  }

  set(name, value) {
    this.map.set(name.toLowerCase(), value);
  }

  has(name) {
    return this.map.has(name.toLowerCase());
  }
};

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init = {}) => {
      const response = new Response(JSON.stringify(body), {
        status: init.status || 200,
        statusText: init.statusText || 'OK',
        headers: {
          'content-type': 'application/json',
          ...init.headers,
        },
      });
      return response;
    },
  },
}));
