import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Video, VideoOff, Mic, MicOff, Users, BarChart3, MessageCircle, Settings, ArrowLeft, Radio, Brain, Captions } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import LiveStream from "@/components/LiveStream";
import StreamAnalytics from "@/components/StreamAnalytics";

interface StreamerDashboardProps {
  onBack: () => void;
}

const StreamerDashboard = ({ onBack }: StreamerDashboardProps) => {
  const [isLive, setIsLive] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [aiFeatures, setAiFeatures] = useState({
    captions: true,
    moodDetection: true,
    autoRecord: false
  });
  const [channelData, setChannelData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const channel = localStorage.getItem('streamerChannel');
    if (channel) {
      setChannelData(JSON.parse(channel));
    }
  }, []);

  useEffect(() => {
    // Simulate viewer count changes when live
    if (isLive) {
      const interval = setInterval(() => {
        setViewerCount(prev => {
          const change = Math.floor(Math.random() * 10) - 5;
          return Math.max(0, prev + change);
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleGoLive = () => {
    if (!isLive) {
      setIsLive(true);
      setViewerCount(1);
      toast({
        title: "🔴 You're Now Live!",
        description: "Your stream is broadcasting with AI features enabled.",
      });
    } else {
      setIsLive(false);
      setViewerCount(0);
      toast({
        title: "Stream Ended",
        description: "Your broadcast has ended. Check analytics for insights!",
      });
    }
  };

  if (!channelData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-4">Loading your channel...</p>
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-md bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onBack}
                className="text-white hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-white">{channelData.channelName}</h1>
                <p className="text-sm text-gray-300">by {channelData.streamerName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isLive && (
                <Badge className="bg-red-500 text-white live-indicator">
                  <Radio className="w-3 h-3 mr-1" />
                  LIVE - {viewerCount} viewers
                </Badge>
              )}
              <Button 
                onClick={handleGoLive}
                className={isLive 
                  ? "bg-red-500 hover:bg-red-600 text-white" 
                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0"
                }
              >
                {isLive ? (
                  <>
                    <VideoOff className="w-4 h-4 mr-2" />
                    End Stream
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Go Live
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="stream" className="space-y-6">
          <TabsList className="bg-black/20 border-white/20">
            <TabsTrigger value="stream" className="data-[state=active]:bg-purple-500">
              <Video className="w-4 h-4 mr-2" />
              Stream
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-purple-500">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stream" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Stream Area */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="streaming-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Video className="w-5 h-5" />
                      Live Stream Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LiveStream isLive={isLive} aiFeatures={aiFeatures} />
                  </CardContent>
                </Card>

                {/* AI Features Control */}
                <Card className="streaming-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-purple-400" />
                      AI Features
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Control AI-powered streaming enhancements
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Captions className="w-4 h-4 text-blue-400" />
                        <Label htmlFor="captions" className="text-white">Live Captions</Label>
                      </div>
                      <Switch
                        id="captions"
                        checked={aiFeatures.captions}
                        onCheckedChange={(checked) => 
                          setAiFeatures(prev => ({ ...prev, captions: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-400" />
                        <Label htmlFor="mood" className="text-white">Mood Detection</Label>
                      </div>
                      <Switch
                        id="mood"
                        checked={aiFeatures.moodDetection}
                        onCheckedChange={(checked) => 
                          setAiFeatures(prev => ({ ...prev, moodDetection: checked }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-green-400" />
                        <Label htmlFor="record" className="text-white">Auto Record</Label>
                      </div>
                      <Switch
                        id="record"
                        checked={aiFeatures.autoRecord}
                        onCheckedChange={(checked) => 
                          setAiFeatures(prev => ({ ...prev, autoRecord: checked }))
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stream Stats */}
                <Card className="streaming-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Stream Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Status</span>
                      <Badge className={isLive ? "bg-red-500" : "bg-gray-500"}>
                        {isLive ? "LIVE" : "OFFLINE"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Viewers</span>
                      <span className="text-white font-medium">{viewerCount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Duration</span>
                      <span className="text-white font-medium">
                        {isLive ? "00:00:00" : "--:--:--"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Chat Preview */}
                <Card className="streaming-card border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      Live Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 h-48 overflow-y-auto">
                      {isLive ? (
                        <>
                          <div className="text-sm">
                            <span className="text-purple-400 font-medium">Viewer1:</span>
                            <span className="text-gray-300 ml-2">Great stream! 🎉</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-blue-400 font-medium">TechFan:</span>
                            <span className="text-gray-300 ml-2">Love the AI features!</span>
                          </div>
                          <div className="text-sm">
                            <span className="text-green-400 font-medium">StreamLover:</span>
                            <span className="text-gray-300 ml-2">How does mood detection work?</span>
                          </div>
                        </>
                      ) : (
                        <p className="text-gray-400 text-sm">Start streaming to see live chat</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <StreamAnalytics />
          </TabsContent>

          <TabsContent value="settings">
            <Card className="streaming-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Stream Settings</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure your streaming preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StreamerDashboard;
