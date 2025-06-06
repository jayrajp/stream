import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Video, Mic, Users, TrendingUp, Zap, Brain } from "lucide-react";
import CreateChannelDialog from "@/components/CreateChannelDialog";
import ViewerDialog from "@/components/ViewerDialog";
import StreamerDashboard from "@/components/StreamerDashboard";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'streamer' | 'viewer'>('landing');
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showViewerDialog, setShowViewerDialog] = useState(false);

  const features = [
    {
      icon: Video,
      title: "Live Streaming",
      description: "Stream directly from your browser using WebRTC technology"
    },
    {
      icon: Brain,
      title: "AI-Powered Captions",
      description: "Real-time speech-to-text transcription with live subtitles"
    },
    {
      icon: Zap,
      title: "Mood Detection",
      description: "AI analyzes facial expressions and displays live mood indicators"
    },
    {
      icon: Users,
      title: "Viewer Analytics",
      description: "Track viewer engagement and collect audience insights"
    },
    {
      icon: TrendingUp,
      title: "Stream Statistics",
      description: "Comprehensive analytics dashboard for content creators"
    },
    {
      icon: Mic,
      title: "Interactive Features",
      description: "Chat logs and real-time audience interaction tools"
    }
  ];

  if (currentView === 'streamer') {
    return <StreamerDashboard onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-md bg-black/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold text-white">VibeStream</span>
                <span className="text-sm text-purple-300 block -mt-1">AI-Powered Platform</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10 border border-white/20"
                onClick={() => setShowViewerDialog(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Join Stream
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg"
                onClick={() => setShowCreateChannel(true)}
              >
                <Video className="w-4 h-4 mr-2" />
                Start Streaming
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Badge className="bg-white/20 text-white border-white/30 px-6 py-3 text-base font-medium backdrop-blur-sm">
                <Zap className="w-5 h-5 mr-2" />
                Next-Gen AI Streaming Platform
              </Badge>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
              Stream with
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"> AI Power</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Create your own streaming channel with cutting-edge AI features including live captions, 
              mood detection, and comprehensive viewer analytics. Start broadcasting in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 px-10 py-6 text-xl font-semibold live-indicator shadow-2xl"
                onClick={() => setShowCreateChannel(true)}
              >
                <Video className="w-6 h-6 mr-3" />
                Create Your Channel
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-10 py-6 text-xl font-semibold backdrop-blur-sm"
                onClick={() => setShowViewerDialog(true)}
              >
                <Users className="w-6 h-6 mr-3" />
                Watch Live Streams
              </Button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-24 h-24 bg-purple-500/20 rounded-full blur-2xl float-animation"></div>
        <div className="absolute top-40 right-20 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl float-animation" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl float-animation" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Powered by Advanced AI
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Experience the future of live streaming with cutting-edge AI features
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="streaming-card border-white/20 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl group">
                  <CardHeader className="pb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-all duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-2xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-300 text-lg leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Live Streams Preview Section */}
      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Live Streams
            </h2>
            <p className="text-xl md:text-2xl text-gray-300">
              Join thousands of viewers watching amazing AI-powered content
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="streaming-card border-white/20 hover:border-purple-500/50 transition-all duration-500 cursor-pointer group hover:scale-105">
                <div className="aspect-video bg-gradient-to-br from-purple-900/60 to-pink-900/60 rounded-t-lg relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Video className="w-16 h-16 text-white/60 mx-auto mb-4" />
                      <p className="text-white/80 text-lg font-medium">Demo Stream {i}</p>
                    </div>
                  </div>
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white live-indicator px-3 py-1 text-sm font-bold">
                    🔴 LIVE
                  </Badge>
                  <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm">
                    {Math.floor(Math.random() * 500) + 100} viewers
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 text-white px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
                      AI: Happy 😊 | Captions: ON
                    </div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-white font-bold text-xl mb-3">AI-Enhanced Stream {i}</h3>
                  <p className="text-gray-400 text-base">Live captions and mood detection powered by AI</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Built with AI-powered streaming technology for the future of content creation
          </p>
        </div>
      </footer>

      {/* Dialogs */}
      <CreateChannelDialog 
        open={showCreateChannel} 
        onOpenChange={setShowCreateChannel}
        onChannelCreated={() => {
          setShowCreateChannel(false);
          setCurrentView('streamer');
        }}
      />
      
      <ViewerDialog 
        open={showViewerDialog} 
        onOpenChange={setShowViewerDialog}
      />
    </div>
  );
};

export default Index;
