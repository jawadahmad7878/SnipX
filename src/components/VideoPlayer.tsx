import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings, Captions as ClosedCaptioning } from 'lucide-react';
import { ApiService } from '../services/api';

interface SubtitleData {
  id: number;
  start: number;
  end: number;
  text: string;
  language: string;
  style: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  videoId?: string;
  subtitles?: SubtitleData[];
  onTimeUpdate?: (currentTime: number) => void;
}

const VideoPlayer = ({ videoUrl, videoId, subtitles, onTimeUpdate }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState<SubtitleData | null>(null);
  const [loadedSubtitles, setLoadedSubtitles] = useState<SubtitleData[]>([]);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  // Load subtitles when videoId changes
  useEffect(() => {
    if (videoId && !subtitles) {
      loadSubtitles();
    } else if (subtitles) {
      setLoadedSubtitles(subtitles);
    }
  }, [videoId, subtitles]);

  // Update current subtitle based on time
  useEffect(() => {
    if (loadedSubtitles.length > 0) {
      const subtitle = loadedSubtitles.find(
        sub => currentTime >= sub.start && currentTime <= sub.end
      );
      setCurrentSubtitle(subtitle || null);
    }
  }, [currentTime, loadedSubtitles]);

  const loadSubtitles = async () => {
    if (!videoId) return;
    
    try {
      const subtitleData = await ApiService.getVideoSubtitles(videoId);
      setLoadedSubtitles(subtitleData);
    } catch (error) {
      console.error('Failed to load subtitles:', error);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  return (
    <div 
      className="relative bg-black rounded-lg overflow-hidden group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Subtitles Overlay */}
      {showSubtitles && currentSubtitle && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-md text-center max-w-md">
            <p className="text-sm md:text-base font-medium leading-relaxed">
              {currentSubtitle.text}
            </p>
          </div>
        </div>
      )}

      {/* Video Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-purple-400 transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            {/* Volume */}
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-purple-400 transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Time Display */}
            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Subtitles Toggle */}
            {loadedSubtitles.length > 0 && (
              <button
                onClick={() => setShowSubtitles(!showSubtitles)}
                className={`transition-colors ${
                  showSubtitles ? 'text-purple-400' : 'text-white hover:text-purple-400'
                }`}
                title="Toggle Subtitles"
              >
                <ClosedCaptioning size={20} />
              </button>
            )}

            {/* Settings */}
            <button className="text-white hover:text-purple-400 transition-colors">
              <Settings size={20} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-purple-400 transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {!duration && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;