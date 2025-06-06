import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import JoinStreamModal from '../components/JoinStreamModal';
import CreateChannelModal from '../components/CreateChannelModal';

const HomePage = () => {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleJoinStream = (channelId) => {
    // Redirect to the viewer page with the channel ID
    window.location.href = `/viewer/${channelId}`;
  };

  const handleCreateChannel = () => {
    // Redirect to the streamer dashboard after creating the channel
    window.location.href = `/streamer/${Date.now()}`; // Temporary channel ID
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to VibeStream</h1>
      <p className="text-gray-400 mb-8">Start streaming or join a live stream now!</p>

      <div className="flex gap-4">
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Start Streaming
        </button>
        <button
          onClick={() => setShowJoinModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
        >
          Join a Stream
        </button>
      </div>

      {showJoinModal && (
        <JoinStreamModal
          onClose={() => setShowJoinModal(false)}
          onJoinStream={handleJoinStream}
        />
      )}

      {showCreateModal && (
        <CreateChannelModal
          onClose={() => setShowCreateModal(false)}
          onCreateChannel={handleCreateChannel}
        />
      )}
    </div>
  );
};

export default HomePage;
