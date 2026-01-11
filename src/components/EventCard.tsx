import { Calendar, MapPin, DollarSign, Tag } from 'lucide-react';
import type { Database } from '../lib/database.types';

type Event = Database['public']['Tables']['events']['Row'];

interface EventCardProps {
  event: Event;
  onGetTickets: (event: Event) => void;
}

export function EventCard({ event, onGetTickets }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateRange = (startDate: string, endDate: string | null) => {
    if (!endDate) return formatDate(startDate);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start.toDateString() === end.toDateString()) {
      return formatDate(startDate);
    }

    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      'Music': 'bg-pink-100 text-pink-700',
      'Festival': 'bg-purple-100 text-purple-700',
      'Food & Wine': 'bg-orange-100 text-orange-700',
      'Comedy': 'bg-yellow-100 text-yellow-700',
      'Markets': 'bg-green-100 text-green-700',
      'Adventure': 'bg-red-100 text-red-700',
      'Art': 'bg-blue-100 text-blue-700',
      'Opera': 'bg-indigo-100 text-indigo-700',
      'Entertainment': 'bg-teal-100 text-teal-700',
      'Sports': 'bg-emerald-100 text-emerald-700',
    };

    return category ? colors[category] || 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="relative h-56 overflow-hidden">
        <img
          src={event.image_url || 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {event.category && (
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getCategoryColor(event.category)}`}>
            <Tag className="w-4 h-4" />
            {event.category}
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {event.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {event.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
            <span>{formatDateRange(event.event_date, event.event_end_date)}</span>
          </div>

          <div className="flex items-start gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
            <span className="line-clamp-2">{event.venue}</span>
          </div>

          {event.price && (
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <DollarSign className="w-4 h-4 flex-shrink-0 text-blue-600" />
              <span className="font-semibold">{event.price}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => onGetTickets(event)}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          GET TICKETS
        </button>
      </div>
    </div>
  );
}
