
import React, { useState } from 'react';

const StreamControls = ({ channelData, onUpdate }) => {
  const [aiFeatures, setAiFeatures] = useState({
    captions: false,
    moodDetection: false,
    autoModeration: false
  });

  const toggleStream = () => {
    const newLiveStatus = !channelData.isLive;
    const updates = { 
      isLive: newLiveStatus,
      lastStreamStart: newLiveStatus ? new Date().toISOString() : channelData.lastStreamStart
    };
    onUpdate(updates);
  };

  const toggleAiFeature = (feature) => {
    setAiFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Stream Controls</h3>
        
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={toggleStream}
            className={`py-3 px-6 rounded-lg font-semibold transition-colors ${
              channelData.isLive
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {channelData.isLive ? 'Stop Stream' : 'Start Stream'}
          </button>
          
          <div className="flex items-center justify-center bg-gray-700 rounded-lg p-3">
            <span className="text-gray-300">Channel ID: </span>
            <span className="text-white font-mono ml-2">{channelData.id}</span>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">📹</div>
              <p>Camera Feed</p>
              <p className="text-sm">
                {channelData.isLive ? 'Broadcasting Live' : 'Stream Offline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">AI Features</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-medium">Real-time Captions</span>
              <p className="text-gray-400 text-sm">AI-generated captions for accessibility</p>
            </div>
            <button
              onClick={() => toggleAiFeature('captions')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aiFeatures.captions ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aiFeatures.captions ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-medium">Mood Detection</span>
              <p className="text-gray-400 text-sm">Analyze audience sentiment in real-time</p>
            </div>
            <button
              onClick={() => toggleAiFeature('moodDetection')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aiFeatures.moodDetection ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aiFeatures.moodDetection ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white font-medium">Auto Moderation</span>
              <p className="text-gray-400 text-sm">AI-powered chat moderation</p>
            </div>
            <button
              onClick={() => toggleAiFeature('autoModeration')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                aiFeatures.autoModeration ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  aiFeatures.autoModeration ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamControls;
