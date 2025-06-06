import React, { useState } from 'react';

const ChatPanel = ({ channelId, messages, onUpdate }) => {
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        user: 'Streamer',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        isStreamer: true
      };
      
      const updatedMessages = [...messages, message];
      onUpdate({ chatMessages: updatedMessages });
      setNewMessage('');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 h-96 flex flex-col">
      <h3 className="text-xl font-semibold text-white mb-4">Live Chat</h3>
      
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                message.isStreamer ? 'bg-purple-600' : 'bg-blue-600'
              }`}>
                {message.user[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{message.user}</span>
                  <span className="text-gray-400 text-sm">{message.timestamp}</span>
                </div>
                <p className="text-gray-300">{message.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
