
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, Mic, MicOff, Camera, CameraOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LiveStreamProps {
  isLive: boolean;
  aiFeatures: {
    captions: boolean;
    moodDetection: boolean;
    autoRecord: boolean;
  };
}

const LiveStream = ({ isLive, aiFeatures }: LiveStreamProps) => {
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [micEnabled, setMicEnabled] = useState(false);
  const [currentCaption, setCurrentCaption] = useState('');
  const [currentMood, setCurrentMood] = useState('😊 Happy');
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  // Initialize camera and microphone
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: micEnabled 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraEnabled(true);
      
      if (aiFeatures.autoRecord && isLive) {
        setIsRecording(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: "Camera Access Error",
        description: "Unable to access camera. Please check permissions.",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraEnabled(false);
    setIsRecording(false);
  };

  // Speech recognition for captions
  const startSpeechRecognition = () => {
    if (!aiFeatures.captions) return;

    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setCurrentCaption(transcript);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      // Simulate captions for demo
      const demoTexts = [
        "Welcome to my live stream!",
        "Today we'll be exploring AI features",
        "Let me show you how this works",
        "The captions are generated in real-time",
        "This is powered by speech recognition AI"
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        setCurrentCaption(demoTexts[index % demoTexts.length]);
        index++;
      }, 3000);

      recognitionRef.current = { stop: () => clearInterval(interval) };
    }
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setCurrentCaption('');
  };

  // Simulate mood detection
  useEffect(() => {
    if (!aiFeatures.moodDetection || !cameraEnabled) return;

    const moods = ['😊 Happy', '😐 Neutral', '🤔 Thoughtful', '😄 Excited', '😌 Calm'];
    const interval = setInterval(() => {
      setCurrentMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, [aiFeatures.moodDetection, cameraEnabled]);

  // Handle live state changes
  useEffect(() => {
    if (isLive && cameraEnabled && aiFeatures.captions) {
      startSpeechRecognition();
    } else {
      stopSpeechRecognition();
    }

    return () => {
      stopSpeechRecognition();
    };
  }, [isLive, aiFeatures.captions, cameraEnabled]);

  return (
    <div className="space-y-4">
      {/* Video Preview */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        {cameraEnabled ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* AI Overlays */}
            {aiFeatures.moodDetection && currentMood && (
              <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
                <p className="text-sm font-medium">Mood: {currentMood}</p>
              </div>
            )}

            {aiFeatures.captions && currentCaption && (
              <div className="absolute bottom-4 left-4 right-4 bg-black/70 text-white p-3 rounded-lg backdrop-blur-sm">
                <p className="text-sm">{currentCaption}</p>
              </div>
            )}

            {isLive && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg live-indicator">
                🔴 LIVE
              </div>
            )}

            {isRecording && (
              <div className="absolute top-4 left-20 bg-green-500 text-white px-3 py-2 rounded-lg">
                ⚫ REC
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <div className="text-center">
              <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Camera Off</p>
              <p className="text-sm">Click "Start Camera" to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <Button
          variant={cameraEnabled ? "destructive" : "default"}
          size="lg"
          onClick={cameraEnabled ? stopCamera : startCamera}
          className={cameraEnabled ? "" : "bg-green-500 hover:bg-green-600"}
        >
          {cameraEnabled ? (
            <>
              <CameraOff className="w-5 h-5 mr-2" />
              Stop Camera
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Start Camera
            </>
          )}
        </Button>

        <Button
          variant={micEnabled ? "destructive" : "secondary"}
          size="lg"
          onClick={() => setMicEnabled(!micEnabled)}
        >
          {micEnabled ? (
            <>
              <MicOff className="w-5 h-5 mr-2" />
              Mute
            </>
          ) : (
            <>
              <Mic className="w-5 h-5 mr-2" />
              Unmute
            </>
          )}
        </Button>
      </div>

      {/* AI Features Status */}
      <Card className="bg-black/20 border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant={aiFeatures.captions ? "default" : "secondary"} className="bg-blue-500/20 text-blue-300">
              Captions: {aiFeatures.captions ? "ON" : "OFF"}
            </Badge>
            <Badge variant={aiFeatures.moodDetection ? "default" : "secondary"} className="bg-purple-500/20 text-purple-300">
              Mood Detection: {aiFeatures.moodDetection ? "ON" : "OFF"}
            </Badge>
            <Badge variant={aiFeatures.autoRecord ? "default" : "secondary"} className="bg-green-500/20 text-green-300">
              Auto Record: {aiFeatures.autoRecord ? "ON" : "OFF"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveStream;
