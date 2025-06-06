
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ViewerPage = () => {
  const { channelId } = useParams();
  const [channelData, setChannelData] = useState(null);
  const [viewerData, setViewerData] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const storedChannel = localStorage.getItem(`channel_${channelId}`);
    const storedViewer = localStorage.getItem('currentViewer');
    
    if (storedChannel) {
      setChannelData(JSON.parse(storedChannel));
    }
    
    if (storedViewer) {
      setViewerData(JSON.parse(storedViewer));
    }
  }, [channelId]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && channelData && viewerData) {
      const message = {
        id: Date.now().toString(),
        user: viewerData.name,
        message: newMessage,
        timestamp: new Date().toLocaleTimeString(),
        isStreamer: false
      };
      
      const updatedMessages = [...(channelData.chatMessages || []), message];
      const updatedChannel = { ...channelData, chatMessages: updatedMessages };
      
      setChannelData(updatedChannel);
      localStorage.setItem(`channel_${channelId}`, JSON.stringify(updatedChannel));
      setNewMessage('');
    }
  };

  if (!channelData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Channel not found</div>
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
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="bg-gray-900 rounded-lg p-4 mb-4">
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">📺</div>
                    <p className="text-xl">
                      {channelData.isLive ? 'Watching Live Stream' : 'Stream Offline'}
                    </p>
                    <p className="text-sm mt-2">{channelData.description}</p>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  👍 Like
                </button>
                <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  🔔 Follow
                </button>
                <button className="bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  📤 Share
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">Live Chat</h3>
            
            <div className="h-80 overflow-y-auto space-y-3 mb-4 border border-gray-700 rounded-lg p-3">
              {(channelData.chatMessages || []).map((message) => (
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
              ))}
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
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
