import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import App from '../renderer/App';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('dark'),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });

  (window as any).electron = {
    ipcRenderer: {
      on: jest.fn(),
      off: jest.fn(),
      once: jest.fn(),
      sendMessage: jest.fn(),
      removeAllListeners: jest.fn(),
      listenerCount: jest.fn(),
      invoke: jest.fn(),
    },
  };
});

describe('App', () => {
  it('should render a page title', () => {
    render(<App />);
    expect(screen.getByText('GitBrowser Store')).toBeInTheDocument();
  });
});
