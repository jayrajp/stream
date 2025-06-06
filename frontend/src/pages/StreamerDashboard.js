
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import StreamControls from '../components/StreamControls';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ChatPanel from '../components/ChatPanel';

const StreamerDashboard = () => {
  const { channelId } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [activeTab, setActiveTab] = useState('stream');

  useEffect(() => {
    const storedChannel = localStorage.getItem(`channel_${channelId}`);
    if (storedChannel) {
      setChannelData(JSON.parse(storedChannel));
    }
  }, [channelId]);

  const updateChannelData = (updates) => {
    const updatedChannel = { ...channelData, ...updates };
    setChannelData(updatedChannel);
    localStorage.setItem(`channel_${channelId}`, JSON.stringify(updatedChannel));
  };

  if (!channelData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading channel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">{channelData.title}</h1>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm ${
                channelData.isLive ? 'bg-red-600 text-white' : 'bg-gray-600 text-gray-200'
              }`}>
                {channelData.isLive ? '🔴 LIVE' : '⭕ OFFLINE'}
              </span>
              <span className="text-gray-300">
                👥 {channelData.viewers} viewers
              </span>
            </div>
          </div>
          
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab('stream')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'stream' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Stream
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'analytics' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'settings' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {activeTab === 'stream' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StreamControls 
                channelData={channelData}
                onUpdate={updateChannelData}
              />
            </div>
            <div>
              <ChatPanel 
                channelId={channelId}
                messages={channelData.chatMessages || []}
                onUpdate={updateChannelData}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <AnalyticsDashboard channelData={channelData} />
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Stream Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Stream Title</label>
                <input
                  type="text"
                  value={channelData.title}
                  onChange={(e) => updateChannelData({ title: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={channelData.description}
                  onChange={(e) => updateChannelData({ description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  rows="3"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamerDashboard;
