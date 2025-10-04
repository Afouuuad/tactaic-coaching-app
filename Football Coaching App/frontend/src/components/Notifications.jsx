import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Messaging = ({ receiverId, jobId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${token}` },
        params: { receiverId, jobId }
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSend = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/messages', { receiverId, jobId, content: newMessage }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Optionally, set up interval polling or web sockets for real-time updates
  }, [receiverId, jobId]);

  return (
    <div>
      <h2>Messages</h2>
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '300px', overflowY: 'scroll' }}>
        {messages.map(msg => (
          <div key={msg._id} style={{ marginBottom: '0.5rem' }}>
            <strong>{msg.sender === receiverId ? 'Them' : 'You'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ width: '80%', padding: '0.5rem' }}
        />
        <button onClick={handleSend} style={{ padding: '0.5rem 1rem' }}>Send</button>
      </div>
    </div>
  );
};

export default Messaging;
