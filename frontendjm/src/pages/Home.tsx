import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Users, Clock, Eye } from 'lucide-react';
import { streamService } from '../services/api';

interface Stream {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  startedAt?: string;
  channel: {
    id: string;
    name: string;
    owner: {
      firstName: string;
      lastName: string;
    };
  };
}

const Home: React.FC = () => {
  const [streams, setStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStreams();
  }, []);

  const fetchStreams = async () => {
    try {
      const response = await streamService.getAllStreams();
      setStreams(response.data);
    } catch (error) {
      console.error('Error fetching streams:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'live':
        return 'bg-red-500';
      case 'scheduled':
        return 'bg-yellow-500';
      case 'ended':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white p-8 md:p-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to StreamHub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Broadcast your passion, connect with your audience, and build your community
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Start Streaming
            </Link>
            <Link
              to="/viewer"
              className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 rounded-lg font-semibold transition-colors text-center"
            >
              Watch Streams
            </Link>
          </div>
        </div>
      </div>

      {/* Live Streams Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Live Streams</h2>
          <Link
            to="/viewer"
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            View all streams →
          </Link>
        </div>

        {streams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No streams available</h3>
            <p className="text-gray-500">Be the first to start streaming!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.slice(0, 6).map((stream) => (
              <div key={stream.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-r from-purple-400 to-blue-400 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(stream.status)}`}>
                      {stream.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {stream.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {stream?.channel?.name} • {stream?.channel?.owner?.firstName} {stream?.channel?.owner?.lastName}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(stream.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/watch/${stream.id}`}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Watch</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6">
          <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Play className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Easy Broadcasting</h3>
          <p className="text-gray-600">
            Start streaming in minutes with our intuitive broadcasting tools
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Build Community</h3>
          <p className="text-gray-600">
            Connect with your audience and build a loyal following
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Eye className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">High Quality</h3>
          <p className="text-gray-600">
            Deliver crystal clear streams with our reliable infrastructure
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;