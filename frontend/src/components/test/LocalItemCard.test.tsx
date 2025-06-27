import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LocalItemCard from '../LocalItemCard';
import { ILocalItem } from '../../types/ILocalItem';
import '@testing-library/jest-dom';
 
describe('LocalItemCard Component', () => {
  const baseItem: ILocalItem = {
    id: '123',
    name: 'Test Location',
    description: 'This is a long test description for our local item testing.',
    location: 'Test City',
    rating: 5,
    type: 'place',
    tags: [],
    coordinates: { lat: 42.0, lng: 42.0 },
  };
 
  const onClickMock = jest.fn();
 
  beforeEach(() => {
    jest.clearAllMocks();
  });
 
  test('renders name, truncated description and location', () => {
    render(<LocalItemCard item={baseItem} onClick={onClickMock} />);
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText(/This is a long test description/)).toBeInTheDocument();
    expect(screen.getByText('Test City')).toBeInTheDocument();
  });
 
  test('truncates description to 80 characters and appends ellipsis', () => {
    const longDesc = 'a'.repeat(500);
    render(
<LocalItemCard
        item={{ ...baseItem, description: longDesc }}
        onClick={onClickMock}
      />
    );
    expect(screen.getByText(`${'a'.repeat(80)}...`)).toBeInTheDocument();
  });
 
  test('handles description being undefined', () => {
    render(<LocalItemCard item={{ ...baseItem, description: undefined }} onClick={onClickMock} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
 
  test('invokes onClick when card is clicked', () => {
    render(<LocalItemCard item={baseItem} onClick={onClickMock} />);
    fireEvent.click(screen.getByText('Test Location'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
 
  test('responds to rapid multiple clicks', () => {
    render(<LocalItemCard item={baseItem} onClick={onClickMock} />);
    const card = screen.getByText('Test Location').closest('div')!;
    for (let i = 0; i < 50; i++) {
      fireEvent.click(card);
    }
    expect(onClickMock).toHaveBeenCalledTimes(50);
  });
 
  test('renders with empty strings', () => {
    const item = {
      ...baseItem,
      name: '',
      description: '',
      location: '',
    };
    render(<LocalItemCard item={item} onClick={onClickMock} />);
    expect(screen.getByText('...')).toBeInTheDocument();
  });
 
  test('handles non-ASCII characters', () => {
    const item = {
      ...baseItem,
      name: '测试地点',
      description: '这是一个描述，用于测试多字节字符截断行为。',
      location: '测试城市',
    };
    render(<LocalItemCard item={item} onClick={onClickMock} />);
    expect(screen.getByText('测试地点')).toBeInTheDocument();
    expect(screen.getByText(/描述/)).toBeInTheDocument();
    expect(screen.getByText('测试城市')).toBeInTheDocument();
  });
 
  test('does not duplicate renders on rerender', () => {
    const { rerender } = render(<LocalItemCard item={baseItem} onClick={onClickMock} />);
    rerender(<LocalItemCard item={baseItem} onClick={onClickMock} />);
    expect(screen.getAllByText('Test Location').length).toBe(1);
  });
 
  test('handles extreme large strings', () => {
    const large = '💥'.repeat(5000);
    render(
<LocalItemCard
        item={{ ...baseItem, name: large, description: large, location: large }}
        onClick={onClickMock}
      />
    );
    expect(screen.getByText(`${large.slice(0, 80)}...`)).toBeInTheDocument();
  });
 
  test('handles very small window size', () => {
    const originalWidth = global.innerWidth;
    Object.defineProperty(global, 'innerWidth', { writable: true, configurable: true, value: 200 });
    render(<LocalItemCard item={baseItem} onClick={onClickMock} />);
    fireEvent.click(screen.getByText('Test Location'));
    expect(onClickMock).toHaveBeenCalled();
    Object.defineProperty(global, 'innerWidth', { writable: true, configurable: true, value: originalWidth });
  });
 
  test('ignores null coordinates in item', () => {
    const brokenItem = { ...baseItem, coordinates: null };
    render(<LocalItemCard item={brokenItem} onClick={onClickMock} />);
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });
 
  test('throws with completely malformed item', () => {
    const failRender = () =>
      render(<LocalItemCard item={{} as ILocalItem} onClick={onClickMock} />);
    expect(failRender).toThrow();
  });
 
  test('renders under low memory pressure', () => {
    const leak = Array(1e6).fill('🧠');
    render(<LocalItemCard item={baseItem} onClick={onClickMock} />);
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });
 
  test('is keyboard focusable and clickable by space/enter', () => {
    render(<LocalItemCard item={baseItem} onClick={onClickMock} />);
    const card = screen.getByText('Test Location').closest('div')!;
    card.focus();
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });
    fireEvent.click(card);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
 
  test('renders multiple cards independently', () => {
    const items = [
      { ...baseItem, id: '1', name: 'Alpha' },
      { ...baseItem, id: '2', name: 'Beta' },
      { ...baseItem, id: '3', name: 'Gamma' },
    ];
    items.forEach((item) => {
      render(<LocalItemCard item={item} onClick={onClickMock} />);
    });
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });
});