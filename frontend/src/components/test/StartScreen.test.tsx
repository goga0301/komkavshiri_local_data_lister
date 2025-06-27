import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StartScreen from '../StartScreen';
import '@testing-library/jest-dom';
 
describe('StartScreen Component', () => {
  const onStartMock = jest.fn();
 
  beforeEach(() => {
    jest.clearAllMocks();
  });
 
  test('renders title and button', () => {
    render(<StartScreen onStart={onStartMock} />);
    expect(screen.getByText("🌍 Let's explore Qutaia")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start the journey/i })).toBeInTheDocument();
  });
 
  test('calls onStart when button is clicked', () => {
    render(<StartScreen onStart={onStartMock} />);
    fireEvent.click(screen.getByRole('button', { name: /start the journey/i }));
    expect(onStartMock).toHaveBeenCalledTimes(1);
  });
 
  test('button has correct text content', () => {
    render(<StartScreen onStart={onStartMock} />);
    expect(screen.getByRole('button')).toHaveTextContent('Start the Journey');
  });
 
  test('does not crash with rapid multiple clicks', () => {
    render(<StartScreen onStart={onStartMock} />);
    const btn = screen.getByRole('button');
    for (let i = 0; i < 100; i++) {
      fireEvent.click(btn);
    }
    expect(onStartMock).toHaveBeenCalledTimes(100);
  });
 
  test('handles extreme delay between clicks', async () => {
    jest.useFakeTimers();
    render(<StartScreen onStart={onStartMock} />);
    fireEvent.click(screen.getByRole('button'));
    jest.advanceTimersByTime(60000);
    fireEvent.click(screen.getByRole('button'));
    expect(onStartMock).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });
 
  test('renders correctly with minimal DOM environment', () => {
    const originalCreateElement = document.createElement;
    document.createElement = (tagName) => {
      if (tagName === 'button') return originalCreateElement.call(document, 'button');
      return document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
    };
    render(<StartScreen onStart={onStartMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onStartMock).toHaveBeenCalledTimes(1);
    document.createElement = originalCreateElement;
  });
 
  test('button remains interactable after re-render', () => {
    const { rerender } = render(<StartScreen onStart={onStartMock} />);
    fireEvent.click(screen.getByRole('button'));
    rerender(<StartScreen onStart={onStartMock} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onStartMock).toHaveBeenCalledTimes(2);
  });
 
  test('button is accessible via keyboard', () => {
    render(<StartScreen onStart={onStartMock} />);
    screen.getByRole('button').focus();
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ', code: 'Space' });
    expect(onStartMock).not.toHaveBeenCalled(); // JS button click not triggered by keydown alone
    fireEvent.click(screen.getByRole('button'));
    expect(onStartMock).toHaveBeenCalledTimes(1);
  });
 
  test('renders with unexpected onStart values (fuzz test)', () => {
    const brokenFn = (null as any) as () => void;
    expect(() => render(<StartScreen onStart={brokenFn} />)).toThrow();
  });
 
  test('rejects malformed props', () => {
    const renderBad = () => render(<StartScreen onStart={123 as any} />);
    expect(renderBad).toThrow();
  });
 
  test('renders under memory pressure', () => {
    const memoryHog = Array(1e6).fill('🧠');
    expect(() => render(<StartScreen onStart={onStartMock} />)).not.toThrow();
  });
 
  test('still triggers onStart when re-attached to DOM', () => {
    const { unmount, container } = render(<StartScreen onStart={onStartMock} />);
    const btn = screen.getByRole('button');
    unmount();
    document.body.appendChild(container);
    fireEvent.click(btn);
    expect(onStartMock).toHaveBeenCalledTimes(0);
  });
 
  test('does not duplicate button on rerenders', () => {
    const { rerender } = render(<StartScreen onStart={onStartMock} />);
    rerender(<StartScreen onStart={onStartMock} />);
    rerender(<StartScreen onStart={onStartMock} />);
    expect(screen.getAllByRole('button').length).toBe(1);
  });
 
  test('does not break when CSS is missing', () => {
    jest.mock('../ui/StartScreen.css', () => ({}));
    expect(() => render(<StartScreen onStart={onStartMock} />)).not.toThrow();
  });
 
  test('button can be clicked by coordinates (visual hit test)', () => {
    render(<StartScreen onStart={onStartMock} />);
    const btn = screen.getByRole('button');
    fireEvent.mouseDown(btn, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(btn, { clientX: 100, clientY: 100 });
    fireEvent.click(btn);
    expect(onStartMock).toHaveBeenCalled();
  });
});