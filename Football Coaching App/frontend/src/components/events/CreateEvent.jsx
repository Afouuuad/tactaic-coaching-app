import React, { useState } from 'react';
import Navbar from '@/components/shared/Navbar';
import { Label } from '@/components/ui/Label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant'; // 1. Using the correct API endpoint
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * A form component for coaches to create new events like matches or training sessions.
 */
const CreateEvent = () => {
  // 2. Updated state for creating an event
  const [input, setInput] = useState({
    type: "Training", // Default to 'Training'
    title: "",
    description: "",
    date: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useSelector(store => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error("You must be logged in to create an event.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      // 3. Prepare event data for the API
      const eventData = {
        ...input,
        date: new Date(input.date).toISOString(), // Ensure date is in a standard format
      };

      const res = await axios.post(EVENT_API_END_POINT, eventData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 201) {
        toast.success("Event created successfully!");
        navigate("/events"); // 4. Navigate to the events page after creation
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="flex justify-center items-start w-full my-10 px-4">
        <form onSubmit={submitHandler} className="w-full max-w-2xl p-8 bg-gray-800 border border-gray-700 shadow-xl rounded-lg">
          <h1 className="text-3xl font-bold mb-8 text-center">Create a New Event</h1>
          <div className="space-y-6">
            
            {/* Event Type (Match or Training) */}
            <div>
              <Label className="text-lg">Event Type</Label>
              <select
                name="type"
                value={input.type}
                onChange={changeEventHandler}
                className="my-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                <option value="Training">Training</option>
                <option value="Match">Match</option>
              </select>
            </div>
            
            {/* Title */}
            <div>
              <Label className="text-lg">Title</Label>
              <Input
                type="text"
                name="title"
                placeholder={input.type === 'Match' ? 'e.g., vs. Local Rivals FC' : 'e.g., Defensive Drills'}
                value={input.title}
                onChange={changeEventHandler}
                className="my-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-lg">Description / Notes</Label>
              <textarea
                name="description"
                placeholder="Add any details, objectives, or notes for the event..."
                value={input.description}
                onChange={changeEventHandler}
                rows="4"
                className="my-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Date and Time */}
            <div>
              <Label className="text-lg">Date and Time</Label>
              <Input
                type="datetime-local"
                name="date"
                value={input.date}
                onChange={changeEventHandler}
                className="my-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label className="text-lg">Location</Label>
              <Input
                type="text"
                name="location"
                placeholder="e.g., Main Training Pitch"
                value={input.location}
                onChange={changeEventHandler}
                className="my-2 w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              {loading ? (
                <Button className="w-full p-4 bg-blue-700" disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Event...
                </Button>
              ) : (
                <Button type="submit" className="w-full p-4 bg-blue-600 hover:bg-blue-700">Plan Event</Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
