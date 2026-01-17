import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventCard } from '../../components/EventCard';
import { EventResponse } from '../../services/eventService';

// Mock the router
const mockNavigate = jest.fn();
jest.mock('../../context/Router', () => ({
  useRouter: () => ({
    navigate: mockNavigate,
  }),
}));

describe('EventCard', () => {
  const mockEvent: EventResponse = {
    _id: 'event-123',
    title: 'Summer Music Festival',
    description: 'An amazing music festival with multiple artists',
    category: {
      _id: 'cat-1',
      name: 'Music',
    },
    date: '2025-07-15T18:00:00.000Z',
    location: 'Central Park, New York',
    price: 75,
    capacity: 5000,
    ticketsAvailable: 3420,
    organizer: {
      _id: 'org-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    },
    bookings: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders event information correctly', () => {
    render(<EventCard event={mockEvent} />);

    expect(screen.getByText('Summer Music Festival')).toBeInTheDocument();
    expect(screen.getByText('Central Park, New York')).toBeInTheDocument();
    expect(screen.getByText('$75')).toBeInTheDocument();
    expect(screen.getByText('Music')).toBeInTheDocument();
  });

  it('displays FREE for zero price events', () => {
    const freeEvent = { ...mockEvent, price: 0 };
    render(<EventCard event={freeEvent} />);

    expect(screen.getByText('FREE')).toBeInTheDocument();
  });

  it('shows selling fast badge when tickets are low', () => {
    const lowTicketsEvent = { ...mockEvent, capacity: 100, ticketsAvailable: 20 }; // 80% sold
    render(<EventCard event={lowTicketsEvent} />);

    expect(screen.getByText('Selling Fast')).toBeInTheDocument();
  });

  it('navigates to event detail page when clicked', async () => {
    const user = userEvent.setup();
    render(<EventCard event={mockEvent} />);

    const card = screen.getByRole('img', { name: /Summer Music Festival/i }).closest('div');
    await user.click(card!);

    expect(mockNavigate).toHaveBeenCalledWith({
      page: 'event-detail',
      id: 'event-123',
    });
  });

  it('displays placeholder image when no image provided', () => {
    const eventWithoutImage = { ...mockEvent, image: undefined };
    render(<EventCard event={eventWithoutImage} />);

    const img = screen.getByRole('img', { name: /Summer Music Festival/i });
    expect(img).toHaveAttribute('src', 'https://via.placeholder.com/400x300?text=Event');
  });

  it('displays custom image when provided', () => {
    const eventWithImage = { ...mockEvent, image: 'custom-image.jpg' };
    render(<EventCard event={eventWithImage} />);

    const img = screen.getByRole('img', { name: /Summer Music Festival/i });
    expect(img).toHaveAttribute('src', 'custom-image.jpg');
  });

  it('truncates long titles appropriately', () => {
    const longTitleEvent = {
      ...mockEvent,
      title: 'This is a very long event title that should be truncated in the UI display',
    };
    render(<EventCard event={longTitleEvent} />);

    // The title should still be displayed (truncation is handled by CSS classes)
    expect(screen.getByText('This is a very long event title that should be truncated in the UI display')).toBeInTheDocument();
  });
});