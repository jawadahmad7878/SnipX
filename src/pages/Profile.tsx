import { useState, useEffect } from 'react';
import { User, Edit3, Download, Clock, Settings, Shield, Eye, Trash2, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ApiService } from '../services/api';
import toast from 'react-hot-toast';

interface VideoHistory {
  id: string;
  filename: string;
  uploadDate: string;
  status: string;
  size: number;
  duration?: number;
  processedOptions?: string[];
}

interface UserProfile {
  email: string;
  firstName: string;
  lastName: string;
  joinDate: string;
  totalVideos: number;
  totalProcessingTime: number;
  preferences: {
    defaultLanguage: string;
    autoEnhanceAudio: boolean;
    generateThumbnails: boolean;
    emailNotifications: boolean;
  };
}

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [videoHistory, setVideoHistory] = useState<VideoHistory[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
    loadVideoHistory();
  }, []);

  const loadProfileData = async () => {
    try {
      // Mock profile data - replace with actual API call
      const mockProfile: UserProfile = {
        email: user?.email || 'demo@snipx.com',
        firstName: user?.firstName || 'Demo',
        lastName: user?.lastName || 'User',
        joinDate: '2024-01-15',
        totalVideos: 12,
        totalProcessingTime: 145,
        preferences: {
          defaultLanguage: 'en',
          autoEnhanceAudio: true,
          generateThumbnails: true,
          emailNotifications: false
        }
      };
      setProfile(mockProfile);
      setEditForm({
        firstName: mockProfile.firstName,
        lastName: mockProfile.lastName,
        email: mockProfile.email
      });
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const loadVideoHistory = async () => {
    try {
      const videos = await ApiService.getUserVideos();
      setVideoHistory(videos.map((video: any) => ({
        id: video._id || video.id,
        filename: video.filename,
        uploadDate: video.upload_date || video.uploadDate,
        status: video.status,
        size: video.size,
        duration: video.metadata?.duration,
        processedOptions: Object.keys(video.processing_options || {}).filter(key => 
          video.processing_options[key] === true
        )
      })));
    } catch (error) {
      console.error('Failed to load video history:', error);
      // Mock data for demo
      setVideoHistory([
        {
          id: '1',
          filename: 'presentation.mp4',
          uploadDate: '2024-01-20',
          status: 'completed',
          size: 45000000,
          duration: 120,
          processedOptions: ['cut_silence', 'generate_subtitles']
        },
        {
          id: '2',
          filename: 'tutorial.mov',
          uploadDate: '2024-01-18',
          status: 'completed',
          size: 78000000,
          duration: 300,
          processedOptions: ['enhance_audio', 'generate_thumbnail']
        }
      ]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // API call to update profile
      toast.success('Profile updated successfully');
      setIsEditing(false);
      if (profile) {
        setProfile({
          ...profile,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email
        });
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handlePreferenceChange = (key: string, value: boolean | string) => {
    if (profile) {
      setProfile({
        ...profile,
        preferences: {
          ...profile.preferences,
          [key]: value
        }
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-3 mr-4">
                <User className="text-purple-600" size={32} />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <p className="opacity-90">{profile?.email}</p>
                <p className="text-sm opacity-75">
                  Member since {new Date(profile?.joinDate || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'profile', label: 'Profile', icon: User },
                { id: 'history', label: 'Video History', icon: Clock },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    <Edit3 size={16} className="mr-2" />
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.firstName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.lastName}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Account Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Videos Processed</span>
                          <span className="font-medium">{profile?.totalVideos}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Processing Time</span>
                          <span className="font-medium">{profile?.totalProcessingTime} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Member Since</span>
                          <span className="font-medium">
                            {new Date(profile?.joinDate || '').toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Video History</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Video
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Processing
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {videoHistory.map((video) => (
                        <tr key={video.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {video.filename}
                              </div>
                              <div className="text-sm text-gray-500">
                                {formatFileSize(video.size)} • {video.duration ? formatDuration(video.duration) : 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              video.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : video.status === 'processing'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {video.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {video.processedOptions?.map((option) => (
                                <span
                                  key={option}
                                  className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded"
                                >
                                  {option.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(video.uploadDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-purple-600 hover:text-purple-900">
                                <Eye size={16} />
                              </button>
                              <button className="text-green-600 hover:text-green-900">
                                <Download size={16} />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Settings & Preferences</h2>
                
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Default Language</label>
                          <p className="text-sm text-gray-500">Default language for subtitle generation</p>
                        </div>
                        <select
                          value={profile?.preferences.defaultLanguage}
                          onChange={(e) => handlePreferenceChange('defaultLanguage', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="en">English</option>
                          <option value="ur">Urdu</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                        </select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Auto Enhance Audio</label>
                          <p className="text-sm text-gray-500">Automatically enhance audio quality</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile?.preferences.autoEnhanceAudio}
                            onChange={(e) => handlePreferenceChange('autoEnhanceAudio', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Generate Thumbnails</label>
                          <p className="text-sm text-gray-500">Automatically generate video thumbnails</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile?.preferences.generateThumbnails}
                            onChange={(e) => handlePreferenceChange('generateThumbnails', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                          <p className="text-sm text-gray-500">Receive email updates about processing status</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={profile?.preferences.emailNotifications}
                            onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-red-700">Delete Account</label>
                          <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                        </div>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;