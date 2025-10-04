import Message from '../models/message.model.js';

// Endpoint to send a message
export const sendMessage = async (req, res) => {
  try {
    // Expecting receiver, job, and content in the request body.
    const { receiver, job, content } = req.body;
    const sender = req.user._id; // Assumes your authentication middleware sets req.user

    if (!receiver || !job || !content) {
      return res.status(400).json({ error: 'Missing required fields: receiver, job, or content' });
    }

    const message = new Message({ sender, receiver, job, content });
    await message.save();

    res.status(201).json({ message: 'Message sent successfully', data: message });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Endpoint to get conversation messages between the logged-in user and another user for a specific job.
// Example request: GET /api/messages?job=<jobId>&with=<userId>
export const getMessages = async (req, res) => {
  try {
    const { job, with: conversationWith } = req.query;
    const userId = req.user._id;

    if (!job || !conversationWith) {
      return res.status(400).json({ error: 'Missing required query parameters: job and with' });
    }

    // Find messages where the sender/receiver pair matches either direction
    const messages = await Message.find({
      job,
      $or: [
        { sender: userId, receiver: conversationWith },
        { sender: conversationWith, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
