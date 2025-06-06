import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Play, Users, Calendar, TrendingUp } from 'lucide-react';
import { channelService, streamService } from '../../services/api';

interface Channel {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

interface Stream {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  channel: {
    name: string;
  };
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [recentStreams, setRecentStreams] = useState<Stream[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [channelsResponse, streamsResponse] = await Promise.all([
        channelService.getMyChannels(),
        streamService.getAllStreams()
      ]);
      
      setChannels(channelsResponse.data);
      setRecentStreams(streamsResponse.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white p-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-purple-100 mb-6">
          Ready to create amazing content and connect with your audience?
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/channels/create"
            className="bg-white text-purple-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors text-center flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Channel
          </Link>
          <Link
            to="/streams/create"
            className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-6 py-3 rounded-lg font-semibold transition-colors text-center flex items-center justify-center gap-2"
          >
            <Play className="h-5 w-5" />
            Start Stream
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Channels</p>
              <p className="text-2xl font-bold text-gray-900">{channels.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <Play className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Streams</p>
              <p className="text-2xl font-bold text-gray-900">{recentStreams.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Live Streams</p>
              <p className="text-2xl font-bold text-gray-900">
                {recentStreams.filter(s => s.status === 'live').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {recentStreams.filter(s => {
                  const streamDate = new Date(s.createdAt);
                  const currentDate = new Date();
                  return streamDate.getMonth() === currentDate.getMonth();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Channels */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Channels</h2>
              <Link
                to="/channels"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {channels.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No channels created yet</p>
                <Link
                  to="/channels/create"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  Create your first channel
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {channels.slice(0, 3).map((channel) => (
                  <div key={channel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{channel.name}</h3>
                      <p className="text-sm text-gray-500">{channel.description}</p>
                    </div>
                    <Link
                      to={`/channels/${channel.id}`}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      Manage
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Streams */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Streams</h2>
              <Link
                to="/streams"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {recentStreams.length === 0 ? (
              <div className="text-center py-8">
                <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No streams yet</p>
                <Link
                  to="/streams/create"
                  className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                >
                  <Play className="h-4 w-4" />
                  Start your first stream
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentStreams.map((stream) => (
                  <div key={stream.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{stream?.title}</h3>
                      <p className="text-sm text-gray-500">{stream?.channel?.name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        stream.status === 'live' ? 'bg-red-100 text-red-800' :
                        stream.status === 'ended' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {stream.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;