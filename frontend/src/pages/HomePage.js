
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateChannelModal from '../components/CreateChannelModal';
import JoinStreamModal from '../components/JoinStreamModal';

const HomePage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const navigate = useNavigate();

  const handleChannelCreated = (channelData) => {
    // Store channel data in localStorage
    localStorage.setItem(`channel_${channelData.id}`, JSON.stringify(channelData));
    navigate(`/streamer/${channelData.id}`);
  };

  const handleJoinStream = (channelId) => {
    navigate(`/viewer/${channelId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              VibeStream AI
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Next-generation streaming platform powered by AI. Create immersive live experiences with real-time analytics and smart features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-4 px-8 rounded-lg transform transition-all duration-200 hover:scale-105"
            >
              Start Streaming
            </button>
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-all duration-200"
            >
              Join Stream
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-purple-400 text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Features</h3>
            <p className="text-gray-300">Real-time captions, mood detection, and smart analytics powered by advanced AI.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-blue-400 text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-2">Live Analytics</h3>
            <p className="text-gray-300">Track viewer engagement, chat activity, and performance metrics in real-time.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-pink-400 text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-white mb-2">Interactive Chat</h3>
            <p className="text-gray-300">Engage with your audience through intelligent chat features and moderation.</p>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateChannelModal
          onClose={() => setShowCreateModal(false)}
          onChannelCreated={handleChannelCreated}
        />
      )}
      
      {showJoinModal && (
        <JoinStreamModal
          onClose={() => setShowJoinModal(false)}
          onJoinStream={handleJoinStream}
        />
      )}
    </div>
  );
};

export default HomePage;
