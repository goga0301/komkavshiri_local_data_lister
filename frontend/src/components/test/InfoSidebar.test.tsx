import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import InfoSidebar from '../InfoSidebar'
import { ILocalItem } from '../../types/ILocalItem'
import '@testing-library/jest-dom'
 
const baseItem: ILocalItem = {
  id: 'test-id',
  name: 'Test Place',
  description: 'A beautiful area to relax and explore.',
  location: 'Qutaia Central',
  rating: 4,
  tags: ['scenic', 'relax'],
  coordinates: { lat: 42.1, lng: 42.2 },
  imageUrl: 'https://valid-url.com/image.jpg',
  openingHours: { open: '09:00', close: '18:00' },
  mysteryScore: 87,
  featuredReview: {
    author: 'Traveler Joe',
    comment: 'Amazing place! Must visit.',
  },
}
 
jest.spyOn(global.Image.prototype, 'src', 'set').mockImplementation(function (this: any, url: string) {
  if (url.includes('fail')) {
    setTimeout(() => this.onerror && this.onerror(new Event('error')))
  } else {
    setTimeout(() => this.onload && this.onload(new Event('load')))
  }
})
 
describe('InfoSidebar Component', () => {
  const mockEdit = jest.fn()
  const mockDelete = jest.fn()
  const sessionIds = new Set<string>(['test-id'])
 
  beforeEach(() => {
    mockEdit.mockClear()
    mockDelete.mockClear()
  })
 
  test('renders empty sidebar when no item selected', () => {
    render(<InfoSidebar selectedItem={null} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={new Set()} />)
    expect(screen.getByText(/click on a marker/i)).toBeInTheDocument()
  })
 
  test('renders full sidebar when item is selected', async () => {
    render(<InfoSidebar selectedItem={baseItem} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={sessionIds} />)
    expect(await screen.findByText(baseItem.name)).toBeInTheDocument()
    expect(screen.getByText(baseItem.description)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(baseItem.location))).toBeInTheDocument()
    expect(screen.getByText(`${baseItem.rating} ⭐`)).toBeInTheDocument()
    expect(screen.getByText(baseItem.tags.join(', '))).toBeInTheDocument()
    expect(screen.getByText(`${baseItem.openingHours.open} - ${baseItem.openingHours.close}`)).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`${baseItem.mysteryScore}`))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(baseItem.featuredReview.comment))).toBeInTheDocument()
  })
 
  test('image fallback appears when URL is invalid', async () => {
    const itemWithBadImage = { ...baseItem, imageUrl: 'https://fail.com/img.jpg' }
    render(<InfoSidebar selectedItem={itemWithBadImage} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={sessionIds} />)
    await act(async () => {
      await new Promise((res) => setTimeout(res, 10))
    })
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText(itemWithBadImage.name)).toBeInTheDocument()
  })
 
  test('image renders when URL is valid', async () => {
    render(<InfoSidebar selectedItem={baseItem} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={sessionIds} />)
    expect(await screen.findByRole('img')).toHaveAttribute('src', baseItem.imageUrl)
  })
 
  test('edit button works when session allows it', () => {
    render(<InfoSidebar selectedItem={baseItem} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={sessionIds} />)
    fireEvent.click(screen.getByText(/edit/i))
    expect(mockEdit).toHaveBeenCalledWith(baseItem)
  })
 
  test('delete button works when session allows it', () => {
    render(<InfoSidebar selectedItem={baseItem} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={sessionIds} />)
    fireEvent.click(screen.getByText(/delete/i))
    expect(mockDelete).toHaveBeenCalledWith(baseItem.id)
  })
 
  test('edit alert shown when session disallows edit', () => {
    window.alert = jest.fn()
    render(<InfoSidebar selectedItem={baseItem} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={new Set()} />)
    fireEvent.click(screen.getByText(/edit/i))
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('permission'))
    expect(mockEdit).not.toHaveBeenCalled()
  })
 
  test('delete alert shown when session disallows delete', () => {
    window.alert = jest.fn()
    render(<InfoSidebar selectedItem={baseItem} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={new Set()} />)
    fireEvent.click(screen.getByText(/delete/i))
    expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('permission'))
    expect(mockDelete).not.toHaveBeenCalled()
  })
 
  test('handles item with missing fields gracefully', () => {
    const incompleteItem = {
      id: '2',
      name: '',
      description: '',
      location: '',
      rating: 0,
      tags: [],
      coordinates: { lat: 0, lng: 0 },
      imageUrl: '',
      openingHours: { open: '', close: '' },
      mysteryScore: 0,
      featuredReview: { author: '', comment: '' },
    }
    render(<InfoSidebar selectedItem={incompleteItem} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={new Set(['2'])} />)
    expect(screen.getByText(/location:/i)).toBeInTheDocument()
    expect(screen.getByText(/tags:/i)).toBeInTheDocument()
    expect(screen.getByText(/open:/i)).toBeInTheDocument()
    expect(screen.getByText(/mystery score:/i)).toBeInTheDocument()
  })
 
  test('handles extremely long string fields', () => {
    const longTextItem = {
      ...baseItem,
      name: 'a'.repeat(1000),
      description: 'b'.repeat(2000),
      location: 'c'.repeat(1000),
      tags: Array(100).fill('tag'),
      featuredReview: {
        comment: 'z'.repeat(1500),
        author: 'VeryLongName'.repeat(50),
      },
    }
    render(<InfoSidebar selectedItem={longTextItem} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={new Set([longTextItem.id])} />)
    expect(screen.getByText(longTextItem.name)).toBeInTheDocument()
    expect(screen.getByText(longTextItem.description)).toBeInTheDocument()
    expect(screen.getByText(longTextItem.location)).toBeInTheDocument()
    expect(screen.getByText(/tag, tag, tag/)).toBeInTheDocument()
  })
 
  test('gracefully handles null fields in featuredReview', () => {
    const nullReviewItem = {
      ...baseItem,
      featuredReview: {
        comment: '',
        author: '',
      },
    }
    render(<InfoSidebar selectedItem={nullReviewItem} onEdit={mockEdit} onDelete={mockDelete} sessionItemIds={sessionIds} />)
    expect(screen.getByText(/“”/)).toBeInTheDocument()
  })
})