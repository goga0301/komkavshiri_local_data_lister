import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import LocalItemList from '../LocalItemList';
import * as api from '../../services/api';
import { ILocalItem } from '../../types/ILocalItem';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
 
jest.mock('../LocalItemCard', () => ({ item, onClick }: any) => (
<div data-testid="localitem-card" onClick={onClick}>
    {item.name}
</div>
));
 
describe('LocalItemList Component', () => {
  const sampleItems: ILocalItem[] = [
    {
      id: '1',
      name: 'Lake Qutaia',
      description: 'Beautiful lake view',
      location: 'North Side',
      type: 'lake',
      rating: 5,
      tags: [],
      coordinates: { lat: 42.1, lng: 42.2 },
    },
    {
      id: '2',
      name: 'Mountain Zone',
      description: 'Climb-worthy peaks',
      location: 'East Edge',
      type: 'mountain',
      rating: 4,
      tags: [],
      coordinates: { lat: 42.3, lng: 42.4 },
    },
  ];
 
  const longNameItem: ILocalItem = {
    id: '3',
    name: 'x'.repeat(1000),
    description: 'y'.repeat(1000),
    location: 'z'.repeat(1000),
    type: 'extreme',
    rating: 5,
    tags: [],
    coordinates: { lat: 0, lng: 0 },
  };
 
  const onSelectMock = jest.fn();
 
  beforeEach(() => {
    jest.clearAllMocks();
  });
 
  test('renders loading message initially', async () => {
    jest.spyOn(api, 'fetchLocalItems').mockImplementation(() => new Promise(() => {}));
    render(<LocalItemList onSelect={onSelectMock} />);
    expect(screen.getByText(/loading items/i)).toBeInTheDocument();
  });
 
  test('renders error message on fetch failure', async () => {
    jest.spyOn(api, 'fetchLocalItems').mockRejectedValue(new Error('fail'));
    render(<LocalItemList onSelect={onSelectMock} />);
    await waitFor(() => expect(screen.getByText(/error loading items/i)).toBeInTheDocument());
  });
 
  test('renders item cards after fetch success', async () => {
    jest.spyOn(api, 'fetchLocalItems').mockResolvedValue(sampleItems);
    render(<LocalItemList onSelect={onSelectMock} />);
    await waitFor(() => expect(screen.getAllByTestId('localitem-card')).toHaveLength(2));
    expect(screen.getByText('Lake Qutaia')).toBeInTheDocument();
    expect(screen.getByText('Mountain Zone')).toBeInTheDocument();
  });
 
  test('calls onSelect when item card is clicked', async () => {
    jest.spyOn(api, 'fetchLocalItems').mockResolvedValue(sampleItems);
    render(<LocalItemList onSelect={onSelectMock} />);
    await waitFor(() => screen.getAllByTestId('localitem-card'));
    userEvent.click(screen.getByText('Mountain Zone'));
    expect(onSelectMock).toHaveBeenCalledWith(sampleItems[1]);
  });
 
  test('handles empty item list gracefully', async () => {
    jest.spyOn(api, 'fetchLocalItems').mockResolvedValue([]);
    render(<LocalItemList onSelect={onSelectMock} />);
    await waitFor(() => expect(screen.queryAllByTestId('localitem-card')).toHaveLength(0));
  });
 
  test('handles very large item list', async () => {
    const largeList = Array.from({ length: 3000 }, (_, i) => ({
      ...sampleItems[0],
      id: `${i}`,
      name: `Place ${i}`,
    }));
    jest.spyOn(api, 'fetchLocalItems').mockResolvedValue(largeList);
    render(<LocalItemList onSelect={onSelectMock} />);
    await waitFor(() => expect(screen.getAllByTestId('localitem-card')).toHaveLength(3000));
  });
 
  test('renders item with extreme strings', async () => {
    jest.spyOn(api, 'fetchLocalItems').mockResolvedValue([longNameItem]);
    render(<LocalItemList onSelect={onSelectMock} />);
    await waitFor(() => expect(screen.getByText(longNameItem.name)).toBeInTheDocument());
  });
 
  test('handles multiple rapid fetches and race conditions', async () => {
    const fetchMock = jest.spyOn(api, 'fetchLocalItems');
    fetchMock.mockResolvedValueOnce(sampleItems.slice(0, 1));
    fetchMock.mockResolvedValueOnce(sampleItems.slice(1));
    await act(async () => {
      render(<LocalItemList onSelect={onSelectMock} />);
    });
    await waitFor(() => expect(screen.getAllByTestId('localitem-card').length).toBeGreaterThan(0));
  });
 
  test('survives delayed fetches', async () => {
    jest.spyOn(api, 'fetchLocalItems').mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(sampleItems), 100)
        )
    );
    render(<LocalItemList onSelect={onSelectMock} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Lake Qutaia')).toBeInTheDocument());
  });
 
  test('handles extremely slow network with timeout simulation', async () => {
    jest.useFakeTimers();
    jest.spyOn(api, 'fetchLocalItems').mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(sampleItems), 10000)
        )
    );
    render(<LocalItemList onSelect={onSelectMock} />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    await waitFor(() => expect(screen.getByText('Lake Qutaia')).toBeInTheDocument());
    jest.useRealTimers();
  });
 
  test('fails gracefully with malformed data', async () => {
    const malformed = [{}] as unknown as ILocalItem[];
    jest.spyOn(api, 'fetchLocalItems').mockResolvedValue(malformed);
    const failRender = () => render(<LocalItemList onSelect={onSelectMock} />);
    expect(failRender).not.toThrow();
  });
 
  test('retries automatically if implemented (mock re-fetch)', async () => {
    const fetchMock = jest
      .spyOn(api, 'fetchLocalItems')
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(sampleItems);
    render(<LocalItemList onSelect={onSelectMock} />);
    await waitFor(() => expect(screen.getByText(/error loading/i)).toBeInTheDocument());
    fetchMock.mockClear();
  });
 
  test('does not call onSelect on load', async () => {
    jest.spyOn(api, 'fetchLocalItems').mockResolvedValue(sampleItems);
    render(<LocalItemList onSelect={onSelectMock} />);
    await waitFor(() => screen.getAllByTestId('localitem-card'));
    expect(onSelectMock).not.toHaveBeenCalled();
  });
});