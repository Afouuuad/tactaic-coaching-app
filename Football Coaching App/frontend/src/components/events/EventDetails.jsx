import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, Trophy, Target } from 'lucide-react';

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
            badgeColor: isMatch ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-cyan-50 text-cyan-600 border border-cyan-100',
            Icon: isMatch ? Trophy : Target
        };
    };

    const { badgeColor, Icon } = getEventTypeStyles(event?.eventType || event?.type);

    return (
        <div className='bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-cyan-300 transition-all duration-300 flex flex-col h-full group'>
            {/* Top Accent Line */}
            <div className={`h-1.5 w-full ${(event?.eventType || event?.type)?.toLowerCase() === 'match' ? 'bg-rose-500' : 'bg-cyan-500'}`} />

            <div className="p-6 flex flex-col flex-1">
                {/* Event Header with Type and Icon */}
                <div className='flex items-center justify-between mb-4'>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${badgeColor}`}>
                        <Icon size={12} />
                        {event?.eventType || event?.type || 'Event'}
                    </div>
                </div>

                {/* Event Title and Description */}
                <div className="flex-1">
                    <h1 className='font-black text-xl text-slate-800 tracking-tight leading-tight line-clamp-2'>{event?.title || 'Untitled Event'}</h1>
                    <p className='text-sm text-slate-500 mt-2 font-medium line-clamp-2'>{event?.description || 'No description provided.'}</p>
                </div>

                {/* Event Date and Location */}
                <div className='space-y-2 mt-6 pt-4 border-t border-slate-100'>
                    <div className='flex items-center gap-3 text-slate-600'>
                        <div className="p-1.5 bg-slate-50 rounded-md border border-slate-200 text-slate-400">
                            <Calendar size={14} />
                        </div>
                        <span className='text-sm font-semibold'>{formatEventDate(event?.date)}</span>
                    </div>
                    <div className='flex items-center gap-3 text-slate-600'>
                        <div className="p-1.5 bg-slate-50 rounded-md border border-slate-200 text-slate-400">
                            <MapPin size={14} />
                        </div>
                        <span className='text-sm font-semibold truncate'>{event?.location || 'Location not set'}</span>
                    </div>
                </div>

                {/* Action Button */}
                <div className='mt-6 pt-2'>
                    <Button
                        onClick={() => navigate(`/events/${event?._id}`)}
                        variant="outline"
                        className="w-full justify-between border-slate-200 text-slate-700 bg-slate-50 hover:bg-white hover:border-cyan-300 hover:text-cyan-700 transition-all duration-200 font-bold tracking-tight shadow-sm"
                    >
                        View Details
                        <ChevronRight size={16} className="text-slate-400 group-hover:text-cyan-500 transition-colors" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
