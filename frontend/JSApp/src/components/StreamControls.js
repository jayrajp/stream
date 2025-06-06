import React, { useState } from 'react';

const StreamControls = ({ onStartStream, onEndStream, isStreaming }) => {
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    // Implement camera toggle logic here
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    // Implement microphone toggle logic here
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h3 className="text-xl font-semibold text-white mb-4">Stream Controls</h3>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300">Camera</span>
        <button
          onClick={toggleCamera}
          className={`px-4 py-2 rounded-lg ${
            cameraEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-400'
          }`}
        >
          {cameraEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-300">Microphone</span>
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded-lg ${
            micEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-gray-400'
          }`}
        >
          {micEnabled ? 'Disable' : 'Enable'}
        </button>
      </div>
      
      <div className="flex justify-center gap-4">
        {!isStreaming ? (
          <button
            onClick={onStartStream}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start Stream
          </button>
        ) : (
          <button
            onClick={onEndStream}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            End Stream
          </button>
        )}
      </div>
    </div>
  );
};

export default StreamControls;
