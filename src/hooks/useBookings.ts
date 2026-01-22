import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookingService } from '../services/bookingService';
import { eventKeys } from './useEvents';

// Query keys
export const bookingKeys = {
  all: ['bookings'],
  lists: () => ['bookings', 'list'],
  list: (userId) => ['bookings', 'list', userId],
  details: () => ['bookings', 'detail'],
  detail: (id) => ['bookings', 'detail', id],
};

// Fetch user's bookings
export function useUserBookings(enabled) {
  const isEnabled = enabled !== undefined ? enabled : true;
  
  return useQuery({
    queryKey: bookingKeys.list(),
    queryFn: () => BookingService.getUserBookings(),
    enabled: isEnabled,
  });
}

// Fetch single booking
export function useBooking(bookingId) {
  return useQuery({
    queryKey: bookingKeys.detail(bookingId),
    queryFn: () => BookingService.getBookingById(bookingId),
    enabled: !!bookingId,
  });
}

// Create booking
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => BookingService.createBooking(data),
    onSuccess: () => {
      // Invalidate both bookings and events (to update ticket availability)
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

// Cancel booking
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId) => BookingService.cancelBooking(bookingId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(data._id) });
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}