import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Users, Eye } from 'lucide-react';
import { streamService } from '../../services/api';

interface Stream {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  channel: {
    id: string;
    name: string;
    owner: {
      firstName: string;
      lastName: string;
    };
  };
}

const ViewerJoin: React.FC = () => {
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

  const liveStreams = streams.filter(stream => stream.status === 'live');
  const otherStreams = streams.filter(stream => stream.status !== 'live');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Watch Live Streams
        </h1>
        <p className="text-xl text-gray-600">
          Discover amazing content from creators around the world
        </p>
      </div>

      {/* Live Streams Section */}
      {liveStreams.length > 0 && (
        <div>
          <div className="flex items-center mb-6">
            <div className="bg-red-500 w-3 h-3 rounded-full mr-3 animate-pulse"></div>
            <h2 className="text-2xl font-bold text-gray-900">Live Now</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {liveStreams.map((stream) => (
              <div key={stream.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium text-white bg-red-500 animate-pulse">
                      🔴 LIVE
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {stream.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {stream?.channel?.name} • {stream?.channel?.owner?.firstName} {stream?.channel?.owner?.lastName}
                  </p>
                  {stream.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {stream.description}
                    </p>
                  )}
                  <Link
                    to={`/watch/${stream.id}`}
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Watch Live
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Streams Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">All Streams</h2>
        
        {streams.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No streams available</h3>
            <p className="text-gray-500 mb-6">Check back later for new content</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              Explore StreamHub
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <div key={stream.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="relative">
                  <div className={`aspect-video bg-gradient-to-r ${
                    stream.status === 'live' ? 'from-red-500 to-pink-500' : 'from-purple-400 to-blue-400'
                  } flex items-center justify-center`}>
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(stream.status)}`}>
                      {stream.status === 'live' ? '🔴 LIVE' : stream.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {stream.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {stream?.channel?.name} • {stream?.channel?.owner?.firstName} {stream?.channel?.owner?.lastName}
                  </p>
                  {stream.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                      {stream.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(stream.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={`/watch/${stream.id}`}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                        stream.status === 'live' 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      <Eye className="h-4 w-4" />
                      {stream.status === 'live' ? 'Watch' : 'View'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewerJoin;