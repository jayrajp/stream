import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Users, Clock, MessageCircle, TrendingUp, Mail, Calendar } from "lucide-react";

const StreamAnalytics = () => {
  const [viewerData, setViewerData] = useState<any[]>([]);
  const [chatLogs, setChatLogs] = useState<any[]>([]);

  useEffect(() => {
    // Load viewer data from localStorage
    const viewers = JSON.parse(localStorage.getItem('viewers') || '[]');
    setViewerData(viewers);

    // Generate demo chat logs
    const demoChatLogs = [
      { user: "TechFan", message: "Great stream! Love the AI features", timestamp: new Date().toISOString() },
      { user: "StreamLover", message: "How does the mood detection work?", timestamp: new Date().toISOString() },
      { user: "Viewer123", message: "Amazing quality! 🔥", timestamp: new Date().toISOString() },
      { user: "AIEnthusiast", message: "The captions are so accurate!", timestamp: new Date().toISOString() },
      { user: "CodeNinja", message: "This is the future of streaming", timestamp: new Date().toISOString() }
    ];
    setChatLogs(demoChatLogs);
  }, []);

  // Demo analytics data
  const viewerStats = [
    { time: '10:00', viewers: 12 },
    { time: '10:15', viewers: 25 },
    { time: '10:30', viewers: 48 },
    { time: '10:45', viewers: 62 },
    { time: '11:00', viewers: 89 },
    { time: '11:15', viewers: 156 },
    { time: '11:30', viewers: 203 }
  ];

  const engagementData = [
    { name: 'Chat Messages', value: 45, color: '#8b5cf6' },
    { name: 'Reactions', value: 78, color: '#06b6d4' },
    { name: 'Shares', value: 23, color: '#ec4899' }
  ];

  const aiInsights = [
    { feature: 'Caption Accuracy', value: '94%', trend: '+2%' },
    { feature: 'Mood Detection', value: '87%', trend: '+5%' },
    { feature: 'Engagement Score', value: '8.4/10', trend: '+0.3' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="streaming-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Viewers</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{viewerData.length}</div>
            <p className="text-xs text-green-400">+12% from last stream</p>
          </CardContent>
        </Card>

        <Card className="streaming-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Peak Viewers</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">203</div>
            <p className="text-xs text-green-400">Best performance yet!</p>
          </CardContent>
        </Card>

        <Card className="streaming-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Stream Duration</CardTitle>
            <Clock className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2h 15m</div>
            <p className="text-xs text-blue-400">Average: 1h 45m</p>
          </CardContent>
        </Card>

        <Card className="streaming-card border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Chat Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-pink-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{chatLogs.length}</div>
            <p className="text-xs text-purple-400">High engagement</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-black/20 border-white/20">
          <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500">
            Overview
          </TabsTrigger>
          <TabsTrigger value="viewers" className="data-[state=active]:bg-purple-500">
            Viewers
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-purple-500">
            Chat Logs
          </TabsTrigger>
          <TabsTrigger value="ai" className="data-[state=active]:bg-purple-500">
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="streaming-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Viewer Growth</CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time viewer count during stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={viewerStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="viewers" 
                      stroke="#8b5cf6" 
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="streaming-card border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Engagement Breakdown</CardTitle>
                <CardDescription className="text-gray-300">
                  How viewers interacted with your stream
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {engagementData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {engagementData.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-300">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="viewers" className="space-y-6">
          <Card className="streaming-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users className="w-5 h-5" />
                Viewer Information
              </CardTitle>
              <CardDescription className="text-gray-300">
                Details about viewers who joined your stream
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewerData.length > 0 ? (
                <div className="space-y-4">
                  {viewerData.map((viewer, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {viewer.firstName[0]}{viewer.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {viewer.firstName} {viewer.lastName}
                          </p>
                          <p className="text-gray-400 text-sm flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {viewer.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-300 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(viewer.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No viewers have joined yet</p>
                  <p className="text-gray-500 text-sm">Start streaming to see viewer data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <Card className="streaming-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat History
              </CardTitle>
              <CardDescription className="text-gray-300">
                Messages from your live stream chat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {chatLogs.map((log, index) => (
                  <div key={index} className="p-3 bg-black/20 rounded-lg border border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-purple-400 font-medium text-sm">{log.user}</p>
                        <p className="text-white mt-1">{log.message}</p>
                      </div>
                      <span className="text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6">
          <Card className="streaming-card border-white/10">
            <CardHeader>
              <CardTitle className="text-white">AI Performance Metrics</CardTitle>
              <CardDescription className="text-gray-300">
                How well your AI features performed during the stream
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {aiInsights.map((insight, index) => (
                  <div key={index} className="text-center p-6 bg-black/20 rounded-lg border border-white/10">
                    <h3 className="text-gray-300 text-sm mb-2">{insight.feature}</h3>
                    <p className="text-2xl font-bold text-white mb-1">{insight.value}</p>
                    <Badge className="bg-green-500/20 text-green-400 text-xs">
                      {insight.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StreamAnalytics;
