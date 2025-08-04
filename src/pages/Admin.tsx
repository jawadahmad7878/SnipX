import { useState, useEffect } from 'react';
import { 
  Users, 
  Video, 
  BarChart3, 
  Settings, 
  Shield, 
  Activity,
  TrendingUp,
  Download,
  Eye,
  Trash2,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalVideos: number;
  totalProcessingTime: number;
  activeUsers: number;
  storageUsed: number;
  monthlyGrowth: number;
}

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  joinDate: string;
  lastActive: string;
  videosProcessed: number;
  status: 'active' | 'inactive' | 'suspended';
}

interface VideoData {
  id: string;
  filename: string;
  userId: string;
  userEmail: string;
  uploadDate: string;
  status: string;
  size: number;
  processingOptions: string[];
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Mock data - replace with actual API calls
      setStats({
        totalUsers: 1247,
        totalVideos: 5832,
        totalProcessingTime: 12450,
        activeUsers: 342,
        storageUsed: 2.4, // TB
        monthlyGrowth: 15.3
      });

      setUsers([
        {
          id: '1',
          email: 'john.doe@example.com',
          firstName: 'John',
          lastName: 'Doe',
          joinDate: '2024-01-15',
          lastActive: '2024-01-25',
          videosProcessed: 23,
          status: 'active'
        },
        {
          id: '2',
          email: 'jane.smith@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          joinDate: '2024-01-10',
          lastActive: '2024-01-24',
          videosProcessed: 45,
          status: 'active'
        },
        {
          id: '3',
          email: 'bob.wilson@example.com',
          firstName: 'Bob',
          lastName: 'Wilson',
          joinDate: '2023-12-20',
          lastActive: '2024-01-20',
          videosProcessed: 12,
          status: 'inactive'
        }
      ]);

      setVideos([
        {
          id: '1',
          filename: 'presentation.mp4',
          userId: '1',
          userEmail: 'john.doe@example.com',
          uploadDate: '2024-01-25',
          status: 'completed',
          size: 45000000,
          processingOptions: ['cut_silence', 'generate_subtitles']
        },
        {
          id: '2',
          filename: 'tutorial.mov',
          userId: '2',
          userEmail: 'jane.smith@example.com',
          uploadDate: '2024-01-24',
          status: 'processing',
          size: 78000000,
          processingOptions: ['enhance_audio', 'generate_thumbnail']
        }
      ]);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserAction = (userId: string, action: 'suspend' | 'activate' | 'delete') => {
    // Handle user actions
    toast.success(`User ${action}d successfully`);
  };

  const handleVideoAction = (videoId: string, action: 'view' | 'download' | 'delete') => {
    // Handle video actions
    toast.success(`Video ${action} action completed`);
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || video.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="text-purple-600 mr-3" size={24} />
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={loadAdminData}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                { id: 'users', label: 'User Management', icon: Users },
                { id: 'videos', label: 'Video Management', icon: Video },
                { id: 'analytics', label: 'Analytics', icon: Activity },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={16} className="mr-3" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-lg p-3">
                        <Users className="text-blue-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="bg-green-100 rounded-lg p-3">
                        <Video className="text-green-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Total Videos</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalVideos.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="bg-purple-100 rounded-lg p-3">
                        <Activity className="text-purple-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Active Users</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.activeUsers}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="bg-yellow-100 rounded-lg p-3">
                        <TrendingUp className="text-yellow-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Monthly Growth</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.monthlyGrowth}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="bg-red-100 rounded-lg p-3">
                        <BarChart3 className="text-red-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Storage Used</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.storageUsed} TB</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className="bg-indigo-100 rounded-lg p-3">
                        <Activity className="text-indigo-600" size={24} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Processing Time</p>
                        <p className="text-2xl font-bold text-gray-900">{stats?.totalProcessingTime.toLocaleString()} min</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="bg-green-100 rounded-full p-2 mr-3">
                          <Video className="text-green-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Video processed successfully</p>
                          <p className="text-xs text-gray-500">presentation.mp4 by john.doe@example.com</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <Users className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">New user registered</p>
                          <p className="text-xs text-gray-500">alice.johnson@example.com</p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">5 min ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-gray-400" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Videos
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Join Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Active
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.status === 'active' 
                                  ? 'bg-green-100 text-green-800'
                                  : user.status === 'inactive'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {user.videosProcessed}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.joinDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.lastActive).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleUserAction(user.id, user.status === 'active' ? 'suspend' : 'activate')}
                                  className={`px-3 py-1 rounded text-xs font-medium ${
                                    user.status === 'active'
                                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                                  }`}
                                >
                                  {user.status === 'active' ? 'Suspend' : 'Activate'}
                                </button>
                                <button
                                  onClick={() => handleUserAction(user.id, 'delete')}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded text-xs font-medium hover:bg-red-200"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Video Management</h2>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search videos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter size={16} className="text-gray-400" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Videos Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Video
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Processing
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Upload Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredVideos.map((video) => (
                          <tr key={video.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {video.filename}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {formatFileSize(video.size)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {video.userEmail}
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
                                {video.processingOptions.map((option) => (
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
                                <button
                                  onClick={() => handleVideoAction(video.id, 'view')}
                                  className="text-purple-600 hover:text-purple-900"
                                >
                                  <Eye size={16} />
                                </button>
                                <button
                                  onClick={() => handleVideoAction(video.id, 'download')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Download size={16} />
                                </button>
                                <button
                                  onClick={() => handleVideoAction(video.id, 'delete')}
                                  className="text-red-600 hover:text-red-900"
                                >
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
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      <p className="text-gray-500">Chart placeholder - User growth over time</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Video Processing</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      <p className="text-gray-500">Chart placeholder - Video processing statistics</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Features</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      <p className="text-gray-500">Chart placeholder - Most used features</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h3>
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
                      <p className="text-gray-500">Chart placeholder - Storage usage trends</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Configuration</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Maintenance Mode</label>
                        <p className="text-sm text-gray-500">Enable maintenance mode for system updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Auto Backup</label>
                        <p className="text-sm text-gray-500">Automatically backup system data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max File Size (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="500"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Default Processing Language
                      </label>
                      <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option value="en">English</option>
                        <option value="ur">Urdu</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                      </select>
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

export default Admin;