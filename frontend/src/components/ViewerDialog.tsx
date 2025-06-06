
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Users, User, Mail, Video, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ViewerDialog = ({ open, onOpenChange }: ViewerDialogProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [isJoining, setIsJoining] = useState(false);
  const [showStreams, setShowStreams] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsJoining(true);

    // Simulate viewer registration
    setTimeout(() => {
      const viewerData = {
        ...formData,
        id: Date.now(),
        joinedAt: new Date().toISOString()
      };
      
      // Store viewer data
      const existingViewers = JSON.parse(localStorage.getItem('viewers') || '[]');
      existingViewers.push(viewerData);
      localStorage.setItem('viewers', JSON.stringify(existingViewers));

      toast({
        title: "Welcome to VibeStream AI! 🎉",
        description: `Hello ${formData.firstName}! You're now registered to watch live streams.`,
      });

      setIsJoining(false);
      setShowStreams(true);
    }, 1500);
  };

  const demoStreams = [
    {
      id: 1,
      title: "AI-Powered Cooking Show",
      streamer: "Chef Sarah",
      viewers: 245,
      category: "Cooking",
      isLive: true
    },
    {
      id: 2,
      title: "Tech Talk: Future of AI",
      streamer: "Tech Mike",
      viewers: 189,
      category: "Technology",
      isLive: true
    },
    {
      id: 3,
      title: "Live Music Session",
      streamer: "Melody Jane",
      viewers: 156,
      category: "Music",
      isLive: true
    }
  ];

  if (showStreams) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-400" />
              Live Streams
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Choose a stream to watch with AI-powered captions and features
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {demoStreams.map((stream) => (
              <Card key={stream.id} className="bg-black/20 border-white/20 hover:border-purple-500/50 transition-all cursor-pointer group">
                <div className="aspect-video bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-t-lg relative">
                  <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Video className="w-12 h-12 text-white/50" />
                  </div>
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs live-indicator">
                    🔴 LIVE
                  </div>
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {stream.viewers} viewers
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {stream.category}
                  </div>
                </div>
                <CardContent className="p-3">
                  <h3 className="text-white font-medium text-sm mb-1">{stream.title}</h3>
                  <p className="text-gray-400 text-xs">by {stream.streamer}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center pt-4">
            <Button 
              onClick={() => {
                toast({
                  title: "Stream Player",
                  description: "In a real implementation, this would open the stream player with AI features!",
                });
                onOpenChange(false);
                setShowStreams(false);
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              <Video className="w-4 h-4 mr-2" />
              Watch Demo Stream
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Join Live Stream
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Enter your details to watch live streams with AI-powered features
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-white">
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-black/20 border-white/20 text-white placeholder-gray-400"
              required
            />
          </div>

          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <p className="text-sm font-medium text-purple-300">AI Features Available</p>
            </div>
            <ul className="text-xs text-gray-300 space-y-1">
              <li>• Live speech-to-text captions</li>
              <li>• Real-time mood detection</li>
              <li>• Interactive chat features</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isJoining}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              {isJoining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Joining...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Join Stream
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ViewerDialog;
