import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = ({ channelId }) => {
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    // Simulate fetching analytics data from an API or localStorage
    const fakeAnalyticsData = {
      totalViews: Math.floor(Math.random() * 1000),
      averageWatchTime: Math.floor(Math.random() * 30), // in minutes
      chatMessages: Math.floor(Math.random() * 200),
      newFollowers: Math.floor(Math.random() * 50),
    };

    setAnalyticsData(fakeAnalyticsData);
  }, [channelId]);

  if (!analyticsData) {
    return <div className="text-gray-500">Loading analytics...</div>;
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Analytics Dashboard</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg text-gray-300 mb-2">Total Views</h4>
          <p className="text-3xl font-bold text-white">{analyticsData.totalViews}</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg text-gray-300 mb-2">Avg. Watch Time (minutes)</h4>
          <p className="text-3xl font-bold text-white">{analyticsData.averageWatchTime}</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg text-gray-300 mb-2">Chat Messages</h4>
          <p className="text-3xl font-bold text-white">{analyticsData.chatMessages}</p>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-lg text-gray-300 mb-2">New Followers</h4>
          <p className="text-3xl font-bold text-white">{analyticsData.newFollowers}</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
