import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatPanel from '../components/ChatPanel';
import JoinStreamModal from '../components/JoinStreamModal';

const ViewerPage = () => {
  const { channelId } = useParams();
  const [messages, setMessages] = useState([]);
  const [showJoinModal, setShowJoinModal] = useState(true);
  const [viewerName, setViewerName] = useState('');

  useEffect(() => {
    // Load chat messages from localStorage based on channelId
    const storedMessages = localStorage.getItem(`chatMessages-${channelId}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }

    // Load viewer info from localStorage
    const viewerData = localStorage.getItem('currentViewer');
    if (viewerData) {
      setViewerName(JSON.parse(viewerData).name);
    }
  }, [channelId]);

  const updateMessages = (updatedData) => {
    const { chatMessages } = updatedData;
    setMessages(chatMessages);
    localStorage.setItem(`chatMessages-${channelId}`, JSON.stringify(chatMessages));
  };

  const handleJoinStream = (channel) => {
    setShowJoinModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-gray-800 p-4">
        <h1 className="text-2xl font-semibold">
          Watching Stream: {channelId}
        </h1>
        <p className="text-gray-400">
          You are connected as: {viewerName || 'Anonymous Viewer'}
        </p>
      </header>

      <main className="flex-grow p-4 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stream Video Placeholder */}
          <div className="lg:col-span-2 bg-gray-700 rounded-xl aspect-video flex items-center justify-center">
            <p className="text-gray-400">
              Stream content will appear here.
            </p>
          </div>

          {/* Chat Panel */}
          <div className="lg:col-span-1">
            <ChatPanel
              channelId={channelId}
              messages={messages}
              onUpdate={updateMessages}
            />
          </div>
        </div>
      </main>

      {showJoinModal && (
        <JoinStreamModal
          onClose={() => setShowJoinModal(false)}
          onJoinStream={handleJoinStream}
        />
      )}
    </div>
  );
};

export default ViewerPage;
