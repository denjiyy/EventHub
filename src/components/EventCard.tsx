import React from 'react';
import { Calendar, Clock, MapPin, Users, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { EventResponse } from '../services/eventService';
import { useRouter } from '../context/Router';
import { CategoryBadge } from './CategoryBadge';

interface EventCardProps {
  event: EventResponse;
}

export function EventCard({ event }: EventCardProps) {
  const { navigate } = useRouter();
  const ticketPercentage = ((event.capacity - event.ticketsAvailable) / event.capacity) * 100;
  const isPopular = ticketPercentage > 70;
  
  return (
    <div 
      onClick={() => navigate({ page: 'event-detail', id: event._id })}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div className="relative overflow-hidden h-56">
        <img 
          src={event.image || 'https://via.placeholder.com/400x300?text=Event'} 
          alt={event.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
        
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
          <CategoryBadge category={event.category?.name || 'Other'} />
        </div>
        
        {isPopular && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            <TrendingUp className="w-3 h-3" />
            <span>Selling Fast</span>
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="text-white">
            <div className="text-3xl font-bold">
              {event.price === 0 ? 'FREE' : `$${event.price}`}
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-violet-600 flex-shrink-0" />
            <span className="font-medium">
              {new Date(event.date).toLocaleDateString('en-US', { 
                month: 'short', day: 'numeric', year: 'numeric'
              })}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <Clock className="w-4 h-4 mr-2 text-violet-600 flex-shrink-0" />
            <span>
              {new Date(event.date).toLocaleTimeString('en-US', { 
                hour: '2-digit', minute: '2-digit'
              })}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-violet-600 flex-shrink-0" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-sm">
            <Users className="w-4 h-4 mr-1 text-gray-400" />
            <span className="text-gray-600">{event.ticketsAvailable} left</span>
          </div>
          
          <div className="flex items-center text-violet-600 font-semibold group-hover:gap-2 transition-all">
            <span>View Details</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
}
