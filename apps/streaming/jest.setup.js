// Jest setup file for CSN Streaming Platform
import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock next/navigation
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

// Mock Clerk
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: null,
    isLoaded: true,
    isSignedIn: false,
  }),
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: false,
    signOut: jest.fn(),
  }),
  ClerkProvider: ({ children }) => children,
  SignInButton: ({ children }) => children,
  SignUpButton: ({ children }) => children,
  UserButton: () => null,
}));

// Mock Convex
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useConvex: jest.fn(),
  ConvexProvider: ({ children }) => children,
}));

// Global test setup
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};
