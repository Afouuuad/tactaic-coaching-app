import Event from '../models/event.model.js';
import Team from '../models/team.model.js';
import Player from '../models/player.model.js';

// @desc    Create a new event for a team
// @route   POST /api/events
export const createEvent = async (req, res) => {
  try {
    const { teamId, type, title, date, location, description, opponent } = req.body;
    const coachId = req.user._id;

    // Validate input
    if (!teamId || !type || !title || !date) {
      return res.status(400).json({ message: 'Team ID, type, title, and date are required.' });
    }

    // Verify the coach owns the team
    const team = await Team.findOne({ _id: teamId, coach: coachId });
    if (!team) {
      return res.status(404).json({ message: 'Team not found or you are not authorized to manage it.' });
    }

    // Create the new event
    const event = new Event({
      team: teamId,
      eventType: type, // Corrected field name from 'type' to 'eventType'
      title,
      date,
      location,
      notes: description, // Corrected field name from 'description' to 'notes'
      opponent: type === 'Match' ? opponent : undefined,
      // Initialize attendance for all players on the team
      attendance: team.players.map(playerId => ({ player: playerId, status: 'Maybe' })) // 'Pending' is not in the enum, 'Maybe' is the default
    });

    await event.save();
    res.status(201).json({ message: 'Event created successfully.', event });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not create event.', error: error.message });
  }
};

// @desc    Get all events for a specific team
// @route   GET /api/events/team/:teamId
export const getEventsByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user._id;

    // Authorization: Ensure the user is the coach or a player on the team
    const team = await Team.findById(teamId).lean();
    const player = await Player.findOne({ user: userId, team: teamId }).lean();

    if (team.coach.toString() !== userId.toString() && !player) {
      return res.status(403).json({ message: 'User not authorized to view these events.' });
    }

    const events = await Event.find({ team: teamId }).sort({ date: 'asc' }); // Sort by upcoming
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch events.', error: error.message });
  }
};

// @desc    Get a single event by its ID, populating player details
// @route   GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('attendance.player', 'firstName lastName position');
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Authorization: Ensure the user is part of the team for this event
    const userId = req.user._id;
    const team = await Team.findById(event.team).lean();
    const player = await Player.findOne({ user: userId, team: event.team }).lean();

    if (team.coach.toString() !== userId.toString() && !player) {
      return res.status(403).json({ message: 'User not authorized to view this event.' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not fetch event.', error: error.message });
  }
};

// @desc    Update an event's details
// @route   PUT /api/events/:id
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const coachId = req.user._id;

  try {
    const eventToUpdate = await Event.findById(id);
    if (!eventToUpdate) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Verify the coach owns the team associated with the event
    const team = await Team.findOne({ _id: eventToUpdate.team, coach: coachId });
    if (!team) {
      return res.status(403).json({ message: 'User not authorized to update this event.' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'Event updated successfully.', event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not update event.', error: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  const coachId = req.user._id;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Verify the coach owns the team associated with the event
    const team = await Team.findOne({ _id: event.team, coach: coachId });
    if (!team) {
      return res.status(403).json({ message: 'User not authorized to delete this event.' });
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error: Could not delete event.', error: error.message });
  }
};

// @desc    Allow a player to update their attendance for an event
// @route   PUT /api/events/:id/attendance
export const updateAttendance = async (req, res) => {
    try {
        const { id } = req.params; // eventId
        const { status } = req.body; // Expecting status: 'Attending', 'Absent', 'Maybe'
        const userId = req.user._id; // This is the User ID from the token

        if (!status) {
            return res.status(400).json({ message: 'Attendance status is required.' });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found.' });
        }

        // Find the Player document associated with the logged-in User
        const playerProfile = await Player.findOne({ user: userId, team: event.team });
        if (!playerProfile) {
            return res.status(404).json({ message: 'Player profile not found for this user and team.' });
        }

        // Find the player in the attendance list and update their status
        const attendanceIndex = event.attendance.findIndex(att => att.player.toString() === playerProfile._id.toString());

        if (attendanceIndex === -1) {
            return res.status(404).json({ message: 'Player is not on the roster for this event.' });
        }

        event.attendance[attendanceIndex].status = status;
        await event.save();

        res.status(200).json({ message: 'Attendance updated successfully.', event });
    } catch (error) {
        res.status(500).json({ message: 'Server Error: Could not update attendance.', error: error.message });
    }
};
