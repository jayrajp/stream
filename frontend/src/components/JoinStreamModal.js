
import React, { useState } from 'react';

const JoinStreamModal = ({ onClose, onJoinStream }) => {
  const [channelId, setChannelId] = useState('');
  const [viewerName, setViewerName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (channelId.trim()) {
      // Store viewer info in localStorage
      const viewerData = {
        name: viewerName || 'Anonymous Viewer',
        joinedAt: new Date().toISOString(),
        id: Date.now().toString()
      };
      localStorage.setItem('currentViewer', JSON.stringify(viewerData));
      onJoinStream(channelId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Join a Stream</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Channel ID
            </label>
            <input
              type="text"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Enter channel ID"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={viewerName}
              onChange={(e) => setViewerName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
              placeholder="Enter your name"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Join Stream
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinStreamModal;
