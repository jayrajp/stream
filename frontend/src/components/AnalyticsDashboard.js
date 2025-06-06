
import React, { useState } from 'react';

const AnalyticsDashboard = ({ channelData }) => {
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('overview');

  const mockViewerData = [
    { id: '1', name: 'Alex Gaming', email: 'alex@example.com', joinedAt: '2024-01-15T10:30:00Z', duration: '45 min' },
    { id: '2', name: 'Sarah_Streamer', email: 'sarah@example.com', joinedAt: '2024-01-15T10:35:00Z', duration: '40 min' },
    { id: '3', name: 'Mike_Viewer', email: 'mike@example.com', joinedAt: '2024-01-15T10:45:00Z', duration: '30 min' },
  ];

  const mockChatLogs = [
    { id: '1', user: 'Alex Gaming', message: 'Great stream!', timestamp: '10:32 AM' },
    { id: '2', user: 'Sarah_Streamer', message: 'Love the new setup!', timestamp: '10:35 AM' },
    { id: '3', user: 'Mike_Viewer', message: 'When will you stream next?', timestamp: '10:40 AM' },
    { id: '4', user: 'Alex Gaming', message: 'This is amazing content', timestamp: '10:45 AM' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Post-Stream Analytics</h3>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveAnalyticsTab('overview')}
            className={`px-4 py-2 rounded-lg ${
              activeAnalyticsTab === 'overview' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveAnalyticsTab('viewers')}
            className={`px-4 py-2 rounded-lg ${
              activeAnalyticsTab === 'viewers' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Viewers
          </button>
          <button
            onClick={() => setActiveAnalyticsTab('chat')}
            className={`px-4 py-2 rounded-lg ${
              activeAnalyticsTab === 'chat' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Chat Logs
          </button>
        </div>

        {activeAnalyticsTab === 'overview' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">
                {channelData.analytics?.totalViewers || 15}
              </div>
              <div className="text-gray-400">Total Viewers</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">
                {channelData.analytics?.peakViewers || 8}
              </div>
              <div className="text-gray-400">Peak Viewers</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">2h 35m</div>
              <div className="text-gray-400">Stream Duration</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">127</div>
              <div className="text-gray-400">Chat Messages</div>
            </div>
          </div>
        )}

        {activeAnalyticsTab === 'viewers' && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-4">Viewer Details</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-gray-300 pb-3">Name</th>
                    <th className="text-gray-300 pb-3">Email</th>
                    <th className="text-gray-300 pb-3">Joined At</th>
                    <th className="text-gray-300 pb-3">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {mockViewerData.map((viewer) => (
                    <tr key={viewer.id} className="border-b border-gray-600">
                      <td className="text-white py-3">{viewer.name}</td>
                      <td className="text-gray-300 py-3">{viewer.email}</td>
                      <td className="text-gray-300 py-3">
                        {new Date(viewer.joinedAt).toLocaleTimeString()}
                      </td>
                      <td className="text-gray-300 py-3">{viewer.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeAnalyticsTab === 'chat' && (
          <div className="bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-4">Chat History</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {mockChatLogs.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm">
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
