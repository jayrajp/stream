import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';
import { channelService } from '../../services/api';

interface Channel {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    try {
      const response = await channelService.getMyChannels();
      setChannels(response.data);
    } catch (error) {
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChannel = async (channelId: string) => {
    if (window.confirm('Are you sure you want to delete this channel?')) {
      try {
        await channelService.deleteChannel(channelId);
        setChannels(channels.filter(channel => channel.id !== channelId));
      } catch (error) {
        console.error('Error deleting channel:', error);
      }
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Channels</h1>
          <p className="text-gray-600 mt-2">Manage your broadcasting channels</p>
        </div>
        <Link
          to="/channels/create"
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Create Channel
        </Link>
      </div>

      {/* Channels Grid */}
      {channels.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No channels yet</h3>
          <p className="text-gray-500 mb-6">Create your first channel to start streaming</p>
          <Link
            to="/channels/create"
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Plus className="h-5 w-5" />
            Create Channel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {channels.map((channel) => (
            <div key={channel.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{channel.name}</h3>
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/channels/${channel.id}/edit`}
                      className="p-2 text-gray-400 hover:text-purple-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteChannel(channel.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-2">{channel.description}</p>
                
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  Created {new Date(channel.createdAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Link
                    to={`/streams/create?channelId=${channel.id}`}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    Start Stream
                  </Link>
                  <Link
                    to={`/channels/${channel.id}`}
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Channels;