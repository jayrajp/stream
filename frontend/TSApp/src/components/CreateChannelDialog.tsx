import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Video, User, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateChannelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChannelCreated: () => void;
}

const CreateChannelDialog = ({ open, onOpenChange, onChannelCreated }: CreateChannelDialogProps) => {
  const [formData, setFormData] = useState({
    channelName: '',
    streamerName: '',
    description: '',
    category: 'General'
  });
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    // Simulate channel creation
    setTimeout(() => {
      localStorage.setItem('streamerChannel', JSON.stringify({
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isLive: false,
        viewerCount: 0
      }));

      toast({
        title: "Channel Created Successfully! 🎉",
        description: `Welcome to VibeStream AI, ${formData.streamerName}! Your channel "${formData.channelName}" is ready for streaming.`,
      });

      setIsCreating(false);
      onChannelCreated();
    }, 2000);
  };

  const categories = ['General', 'Gaming', 'Music', 'Education', 'Technology', 'Art', 'Cooking', 'Fitness'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-slate-900 to-purple-900 border-purple-500/30 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            Create Your Streaming Channel
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Set up your channel to start streaming with AI-powered features
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="channelName" className="text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Channel Name
              </Label>
              <Input
                id="channelName"
                placeholder="My Awesome Channel"
                value={formData.channelName}
                onChange={(e) => setFormData(prev => ({ ...prev, channelName: e.target.value }))}
                className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="streamerName" className="text-white flex items-center gap-2">
                <User className="w-4 h-4" />
                Your Name
              </Label>
              <Input
                id="streamerName"
                placeholder="John Doe"
                value={formData.streamerName}
                onChange={(e) => setFormData(prev => ({ ...prev, streamerName: e.target.value }))}
                className="bg-black/20 border-white/20 text-white placeholder-gray-400"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Channel Description
            </Label>
            <Textarea
              id="description"
              placeholder="Tell viewers about your content..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-black/20 border-white/20 text-white placeholder-gray-400 min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-white">Category</Label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((category) => (
                <Card 
                  key={category}
                  className={`cursor-pointer transition-all ${
                    formData.category === category 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-white/20 bg-black/20 hover:border-purple-500/50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, category }))}
                >
                  <CardContent className="p-3 text-center">
                    <p className="text-sm text-white">{category}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
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
              disabled={isCreating}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating Channel...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4 mr-2" />
                  Create Channel
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelDialog;
