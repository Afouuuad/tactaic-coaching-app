import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

/**
 * A card component that displays a summary of a single event.
 * It's designed to be shown in a list on the main Events page.
 * @param {object} event - The event object with details like title, type, date, etc.
 */
const EventDetails = ({ event }) => {
    const navigate = useNavigate();

    // Helper function to format the date and time nicely
    const formatEventDate = (isoString) => {
        if (!isoString) return "Date not set";
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Helper to determine the badge color and icon for the event type
    const getEventTypeStyles = (type) => {
        const isMatch = type?.toLowerCase() === 'match';
        return {
            badgeColor: isMatch ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400',
            icon: isMatch ? '⚽' : '🏆' // Simple emoji icons
        };
    };
    
    const { badgeColor, icon } = getEventTypeStyles(event?.type);

    return (
        <div className='p-6 rounded-lg shadow-lg bg-gray-800 border border-gray-700 flex flex-col justify-between h-full transition-all duration-300 hover:border-blue-500 hover:shadow-blue-500/20'>
            <div>
                {/* Event Header with Type and Icon */}
                <div className='flex items-center justify-between mb-4'>
                    <Badge className={`text-sm ${badgeColor}`}>{icon} {event?.type || 'Event'}</Badge>
                </div>

                {/* Event Title and Description */}
                <div>
                    <h1 className='font-bold text-xl text-white truncate'>{event?.title || 'Untitled Event'}</h1>
                    <p className='text-sm text-gray-400 my-2 h-16 overflow-hidden'>{event?.description || 'No description provided.'}</p>
                </div>

                {/* Event Date and Location */}
                <div className='space-y-3 mt-4'>
                    <div className='flex items-center gap-3 text-gray-300'>
                        <Calendar size={18} className="text-blue-400" />
                        <span className='font-medium'>{formatEventDate(event?.date)}</span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-300'>
                        <MapPin size={18} className="text-blue-400" />
                        <span className='font-medium'>{event?.location || 'Location not set'}</span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className='mt-6'>
                <Button 
                    onClick={() => navigate(`/events/${event?._id}`)} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                    View Details
                </Button>
            </div>
        </div>
    );
};

export default EventDetails;
