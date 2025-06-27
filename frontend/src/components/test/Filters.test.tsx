import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import Filters from '../Filters'
import '@testing-library/jest-dom'
 
describe('Filters Component', () => {
  const setup = (props = {}) => {
    const defaultProps = {
      searchQuery: '',
      onSearchChange: jest.fn(),
      selectedTag: '',
      onTagChange: jest.fn(),
      minRating: 0,
      onRatingChange: jest.fn(),
      onlyTrending: false,
      onTrendingToggle: jest.fn(),
      allTags: ['food', 'fun', 'nature', 'history', 'urban'],
      onEventsToggle: jest.fn(),
      onlyEvents: false,
      onClose: jest.fn(),
    }
    return render(<Filters {...{ ...defaultProps, ...props }} />)
  }
 
  test('renders all controls', () => {
    setup()
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByLabelText(/min rating/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/events only/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/trending only/i)).toBeInTheDocument()
  })
 
  test('search input reflects value and calls onSearchChange', () => {
    const onSearchChange = jest.fn()
    setup({ searchQuery: 'mountain', onSearchChange })
    const input = screen.getByPlaceholderText(/search by name/i)
    expect(input).toHaveValue('mountain')
    fireEvent.change(input, { target: { value: 'lake' } })
    expect(onSearchChange).toHaveBeenCalledWith('lake')
  })
 
  test('tag dropdown renders options and calls onTagChange', () => {
    const onTagChange = jest.fn()
    setup({ selectedTag: 'fun', onTagChange })
    const select = screen.getByRole('combobox')
    expect(select).toHaveValue('fun')
    fireEvent.change(select, { target: { value: 'nature' } })
    expect(onTagChange).toHaveBeenCalledWith('nature')
  })
 
  test('renders All Tags option', () => {
    setup()
    expect(screen.getByRole('option', { name: 'All Tags' })).toBeInTheDocument()
  })
 
  test('rating slider reflects value and calls onRatingChange', () => {
    const onRatingChange = jest.fn()
    setup({ minRating: 3, onRatingChange })
    const slider = screen.getByRole('slider')
    expect(slider).toHaveValue('3')
    fireEvent.change(slider, { target: { value: '5' } })
    expect(onRatingChange).toHaveBeenCalledWith(5)
  })
 
  test('events only checkbox toggles', () => {
    const onEventsToggle = jest.fn()
    setup({ onlyEvents: true, onEventsToggle })
    const checkbox = screen.getByLabelText(/events only/i)
    expect(checkbox).toBeChecked()
    fireEvent.click(checkbox)
    expect(onEventsToggle).toHaveBeenCalled()
  })
 
  test('trending only checkbox toggles', () => {
    const onTrendingToggle = jest.fn()
    setup({ onlyTrending: true, onTrendingToggle })
    const checkbox = screen.getByLabelText(/trending only/i)
    expect(checkbox).toBeChecked()
    fireEvent.click(checkbox)
    expect(onTrendingToggle).toHaveBeenCalled()
  })
 
  test('handles empty tag list gracefully', () => {
    setup({ allTags: [] })
    expect(screen.getByRole('option', { name: 'All Tags' })).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(1)
  })
 
  test('handles very large tag list', () => {
    const tags = Array.from({ length: 500 }, (_, i) => `tag-${i}`)
    setup({ allTags: tags })
    expect(screen.getAllByRole('option').length).toBe(501)
    expect(screen.getByRole('option', { name: 'tag-499' })).toBeInTheDocument()
  })
 
  test('slider bounds are correct', () => {
    setup()
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '5')
    expect(slider).toHaveAttribute('step', '1')
  })
 
  test('changing everything at once rapidly works', () => {
    const onSearchChange = jest.fn()
    const onTagChange = jest.fn()
    const onRatingChange = jest.fn()
    const onTrendingToggle = jest.fn()
    const onEventsToggle = jest.fn()
 
    setup({
      onSearchChange,
      onTagChange,
      onRatingChange,
      onTrendingToggle,
      onEventsToggle,
      allTags: ['park', 'nightlife'],
      selectedTag: '',
    })
 
    fireEvent.change(screen.getByPlaceholderText(/search/i), { target: { value: 'qutaia' } })
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'nightlife' } })
    fireEvent.change(screen.getByRole('slider'), { target: { value: '4' } })
    fireEvent.click(screen.getByLabelText(/trending only/i))
    fireEvent.click(screen.getByLabelText(/events only/i))
 
    expect(onSearchChange).toHaveBeenCalledWith('qutaia')
    expect(onTagChange).toHaveBeenCalledWith('nightlife')
    expect(onRatingChange).toHaveBeenCalledWith(4)
    expect(onTrendingToggle).toHaveBeenCalled()
    expect(onEventsToggle).toHaveBeenCalled()
  })
 
  test('search handles special characters', () => {
    const onSearchChange = jest.fn()
    setup({ searchQuery: '!@#$%^&*()', onSearchChange })
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: '<script>' } })
    expect(onSearchChange).toHaveBeenCalledWith('<script>')
  })
})