const BASE_URL = '/api';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Mock data for development
const mockStreams = [
  {
    id: '1',
    title: 'Gaming Session: Building the Ultimate City',
    description: 'Join me as I build an amazing city in this city builder game!',
    status: 'live',
    createdAt: '2024-01-15T10:00:00Z',
    startedAt: '2024-01-15T10:00:00Z',
    channel: {
      id: 'ch1',
      name: 'GameMaster Pro',
      owner: {
        firstName: 'Alex',
        lastName: 'Johnson'
      }
    }
  },
  {
    id: '2',
    title: 'Cooking with Sarah: Italian Pasta Night',
    description: 'Learn to make authentic Italian pasta from scratch!',
    status: 'live',
    createdAt: '2024-01-15T14:30:00Z',
    startedAt: '2024-01-15T14:30:00Z',
    channel: {
      id: 'ch2',
      name: 'Sarah\'s Kitchen',
      owner: {
        firstName: 'Sarah',
        lastName: 'Williams'
      }
    }
  },
  {
    id: '3',
    title: 'Tech Talk: Latest Web Development Trends',
    description: 'Discussing the newest trends in web development and React',
    status: 'scheduled',
    createdAt: '2024-01-15T16:00:00Z',
    channel: {
      id: 'ch3',
      name: 'DevTalks',
      owner: {
        firstName: 'Mike',
        lastName: 'Chen'
      }
    }
  },
  {
    id: '4',
    title: 'Art Stream: Digital Painting Tutorial',
    description: 'Creating a fantasy landscape using digital painting techniques',
    status: 'ended',
    createdAt: '2024-01-14T20:00:00Z',
    startedAt: '2024-01-14T20:00:00Z',
    channel: {
      id: 'ch4',
      name: 'ArtisticVisions',
      owner: {
        firstName: 'Emma',
        lastName: 'Davis'
      }
    }
  }
];

const mockChannels = [
  {
    id: 'ch1',
    name: 'GameMaster Pro',
    description: 'Gaming content and tutorials',
    owner: {
      firstName: 'Alex',
      lastName: 'Johnson'
    }
  },
  {
    id: 'ch2',
    name: 'Sarah\'s Kitchen',
    description: 'Cooking shows and recipe tutorials',
    owner: {
      firstName: 'Sarah',
      lastName: 'Williams'
    }
  }
];

class ApiService {
  private async mockRequest<T>(data: T, delay: number = 500): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return {
      success: true,
      data,
      message: 'Success'
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Request failed');
      }

      return response.json();
    } catch (error) {
      // If backend is not available, fall back to mock data for certain endpoints
      if (endpoint === '/streams' && options.method !== 'POST') {
        console.warn('Backend not available, using mock data for streams');
        return this.mockRequest(mockStreams as T);
      }
      if (endpoint === '/channels' && options.method !== 'POST') {
        console.warn('Backend not available, using mock data for channels');
        return this.mockRequest(mockChannels as T);
      }
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    return this.request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Channel endpoints
  async createChannel(channelData: { name: string; description: string }) {
    return this.request<any>('/channels', {
      method: 'POST',
      body: JSON.stringify(channelData),
    });
  }

  async getMyChannels() {
    return this.request<any[]>('/channels/my-channels');
  }

  async getAllChannels() {
    return this.request<any[]>('/channels');
  }

  async getChannelById(id: string) {
    return this.request<any>(`/channels/${id}`);
  }

  async updateChannel(id: string, channelData: { name: string; description: string }) {
    return this.request<any>(`/channels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(channelData),
    });
  }

  async deleteChannel(id: string) {
    return this.request<any>(`/channels/${id}`, {
      method: 'DELETE',
    });
  }

  // Stream endpoints
  async createStream(streamData: {
    title: string;
    description: string;
    channelId: string;
  }) {
    return this.request<any>('/streams', {
      method: 'POST',
      body: JSON.stringify(streamData),
    });
  }

  async startStream(streamId: string) {
    return this.request<any>(`/streams/${streamId}/start`, {
      method: 'PUT',
    });
  }

  async endStream(streamId: string, endData?: {
    recordingPath?: string;
    transcriptPath?: string;
  }) {
    return this.request<any>(`/streams/${streamId}/end`, {
      method: 'PUT',
      body: JSON.stringify(endData || {}),
    });
  }

  async getAllStreams() {
    return this.request<any[]>('/streams');
  }

  async getStreamById(id: string) {
    const stream = mockStreams.find(s => s.id === id);
    if (stream) {
      return this.mockRequest(stream);
    }
    return this.request<any>(`/streams/${id}`);
  }

  async getStreamsByChannel(channelId: string) {
    const channelStreams = mockStreams.filter(s => s.channel.id === channelId);
    return this.mockRequest(channelStreams);
  }

  // Viewer endpoints
  async registerViewer(viewerData: {
    firstName: string;
    lastName: string;
    email: string;
    streamId: string;
  }) {
    return this.request<any>('/viewers', {
      method: 'POST',
      body: JSON.stringify(viewerData),
    });
  }

  async recordViewerDeparture(viewerId: string) {
    return this.request<any>(`/viewers/${viewerId}/leave`, {
      method: 'PUT',
    });
  }

  async getViewersByStream(streamId: string) {
    return this.request<any[]>(`/viewers/stream/${streamId}`);
  }

  async getCurrentViewersCount(streamId: string) {
    return this.request<{ count: number }>(`/viewers/stream/${streamId}/count`);
  }
}

export const authService = new ApiService();
export const channelService = new ApiService();
export const streamService = new ApiService();
export const viewerService = new ApiService();
export default new ApiService();