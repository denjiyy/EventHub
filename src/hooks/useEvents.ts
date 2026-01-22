import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EventService } from '../services/eventService';

// Query keys
export const eventKeys = {
  all: ['events'],
  lists: () => ['events', 'list'],
  list: (filters) => ['events', 'list', filters],
  details: () => ['events', 'detail'],
  detail: (id) => ['events', 'detail', id],
};

// Fetch all events
export function useEvents(filters) {
  return useQuery({
    queryKey: eventKeys.list(filters),
    queryFn: () => EventService.getAllEvents(filters),
  });
}

// Fetch single event
export function useEvent(eventId) {
  return useQuery({
    queryKey: eventKeys.detail(eventId),
    queryFn: () => EventService.getEventById(eventId),
    enabled: !!eventId,
  });
}

// Create event
export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => EventService.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}

// Update event
export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => EventService.updateEvent(params.eventId, params.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
      queryClient.invalidateQueries({ queryKey: eventKeys.detail(data._id) });
    },
  });
}

// Delete event
export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId) => EventService.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventKeys.lists() });
    },
  });
}