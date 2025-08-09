import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, VolumeX, Volume2, Upload, Video, X, UploadCloud as CloudUpload, Smile, Scissors, Trash2, Undo2, Music, Type, Save, Expand, Magnet as Magic, Brain, Share2 } from 'lucide-react';
import SubtitleEditor from './SubtitleEditor';

interface VideoEditorProps {
  videoUrl?: string;
}

const VideoEditor = ({ videoUrl }: VideoEditorProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [activeTab, setActiveTab] = useState('cutting');
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showSubtitleEditor, setShowSubtitleEditor] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Simulate upload progress
      simulateUpload();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Simulate upload progress
      simulateUpload();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup object URL when component unmounts or when previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Video Editor</h2>
        <p className="text-gray-600 mt-1">Upload your video and let AI do the magic</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Left Panel - Upload & Settings */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upload Area */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex justify-center">
              <CloudUpload className="text-purple-600" size={40} />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Drag & Drop Video</h3>
            <p className="mt-1 text-sm text-gray-600">or click to browse files</p>
            <input 
              type="file" 
              className="hidden" 
              id="video-upload" 
              accept="video/*"
              onChange={handleFileChange}
            />
            <button 
              onClick={() => document.getElementById('video-upload')?.click()}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Select Video
            </button>
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Video className="text-purple-600 mr-3" size={20} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <X size={20} />
                </button>
              </div>
              <div className="mt-3 bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-purple-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-xs text-gray-500 text-right">{uploadProgress}% uploaded</p>
            </div>
          )}

          {/* AI Tools Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">AI Editing Tools</h3>

            {/* Video Summarization */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Brain className="text-purple-600 mr-3" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Video Summarization</h4>
                    <p className="text-xs text-gray-500">Extract key moments automatically</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Summary Length</span>
                  <span className="text-xs font-medium text-purple-600">30% of original</span>
                </div>
                <input 
                  type="range" 
                  min="10" 
                  max="50" 
                  defaultValue="30"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Auto Subtitles */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Type className="text-purple-600 mr-3" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Auto Subtitles</h4>
                    <p className="text-xs text-gray-500">Generate captions in multiple languages</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="mt-3 space-y-2">
                <label className="block text-xs text-gray-600">Language</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm">
                  <option>English</option>
                  <option>Urdu (اردو)</option>
                  <option>Roman Urdu</option>
                  <option>Arabic (العربية)</option>
                  <option>Hindi (हिंदी)</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese (中文)</option>
                  <option>Japanese</option>
                  <option>Korean (한국어)</option>
                  <option>Portuguese</option>
                  <option>Russian (Русский)</option>
                  <option>Italian</option>
                  <option>Turkish</option>
                  <option>Dutch</option>
                </select>
                <label className="block text-xs text-gray-600 mt-2">Style</label>
                <select className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-sm">
                  <option value="clean">Clean</option>
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
            </div>

            {/* Audio Enhancement */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Volume2 className="text-purple-600 mr-3" size={20} />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Audio Enhancement</h4>
                    <p className="text-xs text-gray-500">Remove noise and balance levels</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    onChange={(e) => setShowAudioSettings(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              {showAudioSettings && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Noise Reduction</span>
                    <span className="text-xs font-medium text-purple-600">Medium</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    defaultValue="1"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">Volume Boost</span>
                    <span className="text-xs font-medium text-purple-600">20%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    defaultValue="20"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Process Button */}
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors">
            <Magic className="mr-2" size={20} />
            Process Video
          </button>
        </div>

        {/* Center Panel - Video Preview */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 aspect-video rounded-lg overflow-hidden flex items-center justify-center relative">
            {!previewUrl ? (
              <div className="text-center text-gray-400">
                <Video className="mx-auto mb-3" size={48} />
                <p>Video preview will appear here</p>
              </div>
            ) : (
              <video 
                ref={videoRef}
                src={previewUrl}
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onClick={togglePlay}
              />
            )}

            {/* Video Controls */}
            {previewUrl && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-white text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <div className="flex-grow h-1.5 bg-gray-600 rounded-full">
                      <div 
                        className="h-full bg-purple-600 rounded-full"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      ></div>
                    </div>
                    <span>{formatTime(duration)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="text-white hover:text-purple-400 transition-colors">
                        <SkipBack size={20} />
                      </button>
                      <button 
                        className="bg-white text-purple-900 rounded-full p-2 hover:bg-purple-100 transition-colors"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <button className="text-white hover:text-purple-400 transition-colors">
                        <SkipForward size={20} />
                      </button>
                      <button 
                        className="text-white hover:text-purple-400 transition-colors"
                        onClick={toggleMute}
                      >
                        {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                      </button>
                    </div>

                    <div className="flex items-center gap-4">
                      <button className="text-white hover:text-purple-400 transition-colors">
                        <Expand size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline Editor */}
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900">Timeline Editor</h3>
              <div className="flex space-x-2">
                <button className="p-1 text-gray-500 hover:text-purple-600">
                  <Scissors size={20} />
                </button>
                <button className="p-1 text-gray-500 hover:text-purple-600">
                  <Trash2 size={20} />
                </button>
                <button className="p-1 text-gray-500 hover:text-purple-600">
                  <Undo2 size={20} />
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-md p-2 h-20 overflow-x-auto">
              <div className="flex items-center h-full min-w-max">
                <div className="bg-purple-100 h-12 w-24 rounded-sm mx-1 border border-purple-200"></div>
                <div className="bg-purple-100 h-12 w-16 rounded-sm mx-1 border border-purple-200"></div>
                <div className="bg-purple-100 h-12 w-32 rounded-sm mx-1 border border-purple-200"></div>
                <div className="bg-purple-100 h-12 w-20 rounded-sm mx-1 border border-purple-200"></div>
                <div className="bg-purple-100 h-12 w-28 rounded-sm mx-1 border border-purple-200"></div>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm flex items-center">
                  <Music className="mr-1" size={16} />
                  Add Music
                </button>
                <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md text-sm flex items-center">
                  <Type className="mr-1" size={16} />
                  Add Text
                </button>
              </div>
              <button className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm flex items-center">
                <Save className="mr-1" size={16} />
                Save Project
              </button>
              <button 
                onClick={() => setShowSubtitleEditor(true)}
                className="px-3 py-1 bg-purple-200 hover:bg-purple-300 text-purple-700 rounded-md text-sm flex items-center"
              >
                <Type className="mr-1" size={16} />
                Edit Subtitles
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtitle Editor Modal */}
      {showSubtitleEditor && videoId && (
        <SubtitleEditor
          videoId={videoId}
          onClose={() => setShowSubtitleEditor(false)}
          onSubtitlesUpdate={(subtitles) => {
            console.log('Subtitles updated:', subtitles);
          }}
        />
      )}
    </div>
  );
};

export default VideoEditor;