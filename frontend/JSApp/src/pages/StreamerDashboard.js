import React, { useState, useEffect } from 'react';

const StreamerDashboard = ({ channelId }) => {
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [streamTitle, setStreamTitle] = useState('My Awesome Stream');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    // Simulate viewer count changes
    let intervalId;
    if (isLive) {
      intervalId = setInterval(() => {
        // Generate a random number between -5 and 10 to simulate viewer count changes
        const change = Math.floor(Math.random() * 16) - 5;
        setViewerCount((prevCount) => Math.max(0, prevCount + change)); // Ensure count doesn't go below 0
      }, 5000);
    } else {
      setViewerCount(0);
    }

    return () => clearInterval(intervalId);
  }, [isLive]);

  const handleGoLive = () => {
    setIsLive(!isLive);
  };

  const updateStreamData = (newData) => {
    if (newData.streamTitle) {
      setStreamTitle(newData.streamTitle);
    }
    if (newData.chatMessages) {
      setChatMessages(newData.chatMessages);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-semibold">{streamTitle}</h1>
        <div className="flex items-center space-x-4 mt-2">
          <button
            onClick={handleGoLive}
            className={`px-4 py-2 rounded-lg ${
              isLive ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-700'
            } transition-colors`}
          >
            {isLive ? 'End Stream' : 'Go Live'}
          </button>
          <span className="text-gray-400">Viewers: {viewerCount}</span>
        </div>
      </header>

      <main className="p-6 grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <div className="bg-gray-800 rounded-xl p-6 h-96">
            {/* Placeholder for Stream Display */}
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              {isLive ? 'Live Stream Content Here' : 'Stream is Offline'}
            </div>
          </div>
        </div>

        <div>
          {/* Chat Panel */}
          <ChatPanel channelId={channelId} messages={chatMessages} onUpdate={updateStreamData} />
        </div>
      </main>

      <footer className="bg-gray-800 p-4 text-center">
        <p className="text-gray-500">© 2023 Streaming Platform</p>
      </footer>
    </div>
  );
};

export default StreamerDashboard;
