import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MapView from '../MapView';
import { ILocalItem } from '../../types/ILocalItem';
import '@testing-library/jest-dom';
import 'leaflet/dist/leaflet.css';
 
jest.mock('react-leaflet', () => {
  const original = jest.requireActual('react-leaflet');
  return {
    ...original,
    MapContainer: ({ children }: any) => <div data-testid="map">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Marker: ({ children, position }: any) => (
<div data-testid="marker" data-position={JSON.stringify(position)}>{children}</div>
    ),
    Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
    Polygon: () => <div data-testid="polygon" />,
    useMapEvents: () => {},
  };
});
 
const items: ILocalItem[] = [
  {
    id: '1',
    name: 'Point A',
    description: 'Desc A',
    type: 'park',
    location: 'Loc A',
    rating: 4,
    coordinates: { lat: 42.25, lng: 42.64 },
    tags: [],
  },
  {
    id: '2',
    name: 'Point B',
    description: 'Desc B',
    type: 'cafe',
    location: 'Loc B',
    rating: 2,
    coordinates: { lat: 42.26, lng: 42.65 },
    tags: [],
  },
  {
    id: '3',
    name: 'No Coords',
    description: 'Should not appear',
    type: 'invalid',
    location: 'Nowhere',
    rating: 0,
    coordinates: null,
    tags: [],
  },
];
 
describe('MapView Component', () => {
  const selectMock = jest.fn();
  const requestAddMock = jest.fn();
 
  beforeEach(() => {
    jest.clearAllMocks();
  });
 
  test('renders core map structure', () => {
    render(<MapView items={[]} onSelectItem={selectMock} onRequestAddItem={requestAddMock} />);
    expect(screen.getByTestId('map')).toBeInTheDocument();
    expect(screen.getByTestId('tile-layer')).toBeInTheDocument();
    expect(screen.getAllByTestId('polygon').length).toBe(2);
  });
 
  test('renders only valid coordinate markers', () => {
    render(<MapView items={items} onSelectItem={selectMock} onRequestAddItem={requestAddMock} />);
    const markers = screen.getAllByTestId('marker');
    expect(markers.length).toBe(2);
    expect(screen.queryByText('No Coords')).not.toBeInTheDocument();
  });
 
  test('shows popup content on valid marker', () => {
    render(<MapView items={items} onSelectItem={selectMock} onRequestAddItem={requestAddMock} />);
    expect(screen.getByText('Point A')).toBeInTheDocument();
    expect(screen.getByText('Desc A')).toBeInTheDocument();
  });
 
  test('calls onSelectItem when marker clicked', () => {
    render(<MapView items={items} onSelectItem={selectMock} onRequestAddItem={requestAddMock} />);
    fireEvent.click(screen.getByText('Point A'));
    expect(selectMock).toHaveBeenCalledWith(items[0]);
  });
 
  test('temp marker popup behaves correctly', async () => {
    const { rerender } = render(<MapView items={[]} onSelectItem={selectMock} onRequestAddItem={requestAddMock} />);
    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Yes';
    document.body.appendChild(yesBtn);
    fireEvent.click(yesBtn);
    await waitFor(() => expect(requestAddMock).toHaveBeenCalled());
    const noBtn = document.createElement('button');
    noBtn.textContent = 'No';
    document.body.appendChild(noBtn);
    fireEvent.click(noBtn);
    await waitFor(() => expect(requestAddMock).toHaveBeenCalledTimes(1));
  });
 
  test('handles boundary point correctly', () => {
    const point = [42.246640288470296, 42.636893729879944];
    const polygon = require('../MapView').kutaisiBoundary;
    const fn = require('../MapView').isPointInsidePolygon;
    expect(fn(point, polygon)).toBe(true);
  });
 
  test('rejects invalid click outside polygon', () => {
    window.alert = jest.fn();
    const point = [0, 0];
    const polygon = require('../MapView').kutaisiBoundary;
    const fn = require('../MapView').isPointInsidePolygon;
    if (!fn(point, polygon)) window.alert('Selected location is outside of Kutaisi boundary.');
    expect(window.alert).toHaveBeenCalled();
  });
 
  test('stress test with 10000 markers', () => {
    const bigData: ILocalItem[] = Array.from({ length: 10000 }, (_, i) => ({
      id: `id-${i}`,
      name: `Item ${i}`,
      description: `Desc ${i}`,
      type: 'random',
      location: 'X',
      rating: 3,
      coordinates: { lat: 42.2 + Math.random() * 0.1, lng: 42.6 + Math.random() * 0.1 },
      tags: [],
    }));
    render(<MapView items={bigData} onSelectItem={selectMock} onRequestAddItem={requestAddMock} />);
    expect(screen.getAllByTestId('marker').length).toBeGreaterThan(5000);
  });
 
  test('handles corrupted data gracefully', () => {
    const badData: any = [
      { id: 'a', coordinates: null },
      { id: 'b' },
      { id: 'c', coordinates: { lat: 42.2, lng: 42.6 } },
    ];
    render(<MapView items={badData} onSelectItem={selectMock} onRequestAddItem={requestAddMock} />);
    expect(screen.getAllByTestId('marker').length).toBe(1);
  });
 
  test('polygon logic with edge and concave cases', () => {
    const fn = require('../MapView').isPointInsidePolygon;
    const square = [
      [0, 0],
      [0, 10],
      [10, 10],
      [10, 0],
    ];
    expect(fn([5, 5], square)).toBe(true);
    expect(fn([15, 5], square)).toBe(false);
    expect(fn([0, 0], square)).toBe(true);
    const concave = [
      [0, 0],
      [0, 10],
      [5, 5],
      [10, 10],
      [10, 0],
    ];
    expect(fn([5, 3], concave)).toBe(true);
    expect(fn([5, 8], concave)).toBe(false);
  });
 
  test('mass interaction simulation', async () => {
    render(<MapView items={items} onSelectItem={selectMock} onRequestAddItem={requestAddMock} />);
    for (let i = 0; i < 10; i++) {
      const yesBtn = document.createElement('button');
      yesBtn.textContent = 'Yes';
      document.body.appendChild(yesBtn);
      fireEvent.click(yesBtn);
    }
    await waitFor(() => expect(requestAddMock).toHaveBeenCalledTimes(10));
  });
});