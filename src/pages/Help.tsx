import { useState } from 'react';
import { 
  Search, 
  MessageCircle, 
  Book, 
  HelpCircle, 
  Send, 
  Phone, 
  Mail, 
  Clock,
  ChevronDown,
  ChevronRight,
  Bug,
  FileText,
  Video,
  Scissors,
  Type,
  Volume2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Help = () => {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Hello! I\'m your SnipX assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    description: '',
    priority: 'medium',
    type: 'bug'
  });

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'How do I upload a video to SnipX?',
      answer: 'To upload a video, go to the Editor page and either drag & drop your video file or click the "Select Video" button. We support MP4, MOV, AVI, and MKV formats up to 500MB.',
      category: 'upload'
    },
    {
      id: '2',
      question: 'What video formats are supported?',
      answer: 'SnipX supports MP4, MOV, AVI, MKV, and WMV formats. For best results, we recommend using MP4 format.',
      category: 'upload'
    },
    {
      id: '3',
      question: 'How does the automatic subtitle generation work?',
      answer: 'Our AI analyzes the audio in your video and generates accurate subtitles. You can choose from multiple languages including English, Urdu, Spanish, French, and German.',
      category: 'subtitles'
    },
    {
      id: '4',
      question: 'Can I edit the generated subtitles?',
      answer: 'Yes! After subtitles are generated, you can edit them directly in the editor. You can modify text, timing, and styling.',
      category: 'subtitles'
    },
    {
      id: '5',
      question: 'What is the silence cutting feature?',
      answer: 'The silence cutting feature automatically detects and removes silent parts from your video, making it more engaging and reducing file size.',
      category: 'editing'
    },
    {
      id: '6',
      question: 'How long does video processing take?',
      answer: 'Processing time depends on video length and selected features. Typically, it takes 1-3 minutes per minute of video content.',
      category: 'processing'
    },
    {
      id: '7',
      question: 'Is my video data secure?',
      answer: 'Yes, we use enterprise-grade encryption and secure cloud storage. Your videos are private and only accessible to you.',
      category: 'security'
    },
    {
      id: '8',
      question: 'Can I download my processed videos?',
      answer: 'Absolutely! Once processing is complete, you can download your enhanced video in various quality settings.',
      category: 'download'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'upload', label: 'Upload & Import' },
    { id: 'editing', label: 'Video Editing' },
    { id: 'subtitles', label: 'Subtitles' },
    { id: 'processing', label: 'Processing' },
    { id: 'download', label: 'Export & Download' },
    { id: 'security', label: 'Security' }
  ];

  const tutorials = [
    {
      id: '1',
      title: 'Getting Started with SnipX',
      description: 'Learn the basics of uploading and processing your first video',
      duration: '5 min',
      icon: <Video className="text-blue-500" size={24} />
    },
    {
      id: '2',
      title: 'Advanced Subtitle Editing',
      description: 'Master subtitle generation and customization features',
      duration: '8 min',
      icon: <Type className="text-green-500" size={24} />
    },
    {
      id: '3',
      title: 'Audio Enhancement Techniques',
      description: 'Improve your video audio quality with AI-powered tools',
      duration: '6 min',
      icon: <Volume2 className="text-purple-500" size={24} />
    },
    {
      id: '4',
      title: 'Automated Video Cutting',
      description: 'Use AI to automatically remove silences and improve pacing',
      duration: '7 min',
      icon: <Scissors className="text-red-500" size={24} />
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: getBotResponse(newMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);

    setNewMessage('');
  };

  const getBotResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('upload') || lowerMessage.includes('video')) {
      return 'To upload a video, go to the Editor page and drag & drop your file or click "Select Video". We support MP4, MOV, AVI, and MKV formats up to 500MB.';
    } else if (lowerMessage.includes('subtitle') || lowerMessage.includes('caption')) {
      return 'Our AI can generate subtitles in multiple languages including English, Urdu, Spanish, French, and German. You can also edit them after generation.';
    } else if (lowerMessage.includes('processing') || lowerMessage.includes('time')) {
      return 'Processing time typically takes 1-3 minutes per minute of video content, depending on the features you select.';
    } else if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return 'SnipX offers flexible pricing plans. Please check our pricing page for detailed information about our plans and features.';
    } else {
      return 'I\'d be happy to help! You can ask me about video uploads, subtitle generation, processing times, or any other SnipX features. What would you like to know?';
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Support ticket submitted successfully! We\'ll get back to you within 24 hours.');
    setSupportForm({
      name: '',
      email: '',
      subject: '',
      description: '',
      priority: 'medium',
      type: 'bug'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Help & Support</h1>
          <p className="text-xl text-gray-600">
            Find answers, get help, and learn how to make the most of SnipX
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'faq', label: 'FAQ', icon: HelpCircle },
              { id: 'tutorials', label: 'Tutorials', icon: Book },
              { id: 'chat', label: 'Live Chat', icon: MessageCircle },
              { id: 'support', label: 'Support Ticket', icon: Bug }
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
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                {filteredFAQs.map(faq => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
                    >
                      <span className="font-medium text-gray-900">{faq.question}</span>
                      {expandedFAQ === faq.id ? (
                        <ChevronDown size={20} className="text-gray-500" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 text-gray-600">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-8">
                  <HelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">No FAQs found matching your search.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'tutorials' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Video Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials.map(tutorial => (
                  <div key={tutorial.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        {tutorial.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {tutorial.title}
                        </h3>
                        <p className="text-gray-600 mb-3">{tutorial.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            {tutorial.duration}
                          </span>
                          <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                            Watch Tutorial
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-purple-900 mb-2">Need More Help?</h3>
                <p className="text-purple-700 mb-4">
                  Can't find what you're looking for? Check out our comprehensive documentation or contact our support team.
                </p>
                <div className="flex space-x-4">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors">
                    View Documentation
                  </button>
                  <button className="border border-purple-600 text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors">
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Live Chat Assistant</h2>
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm">Online</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg">
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === 'user'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 p-4">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'How to upload a video?',
                    'Subtitle generation help',
                    'Processing time info',
                    'Pricing information'
                  ].map(action => (
                    <button
                      key={action}
                      onClick={() => setNewMessage(action)}
                      className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Submit Support Ticket</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Mail size={16} className="mr-1" />
                    support@snipx.com
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-1" />
                    +1 (555) 123-4567
                  </div>
                </div>
              </div>

              <form onSubmit={handleSupportSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={supportForm.name}
                      onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={supportForm.email}
                      onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Type
                    </label>
                    <select
                      value={supportForm.type}
                      onChange={(e) => setSupportForm({...supportForm, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="account">Account Issue</option>
                      <option value="billing">Billing Question</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={supportForm.priority}
                      onChange={(e) => setSupportForm({...supportForm, priority: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={supportForm.description}
                    onChange={(e) => setSupportForm({...supportForm, description: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Please provide as much detail as possible about your issue..."
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <FileText size={16} className="mr-2" />
                    Submit Ticket
                  </button>
                </div>
              </form>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Response Times</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-red-600">Urgent:</span>
                    <p className="text-gray-600">2-4 hours</p>
                  </div>
                  <div>
                    <span className="font-medium text-orange-600">High:</span>
                    <p className="text-gray-600">4-8 hours</p>
                  </div>
                  <div>
                    <span className="font-medium text-yellow-600">Medium:</span>
                    <p className="text-gray-600">12-24 hours</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-600">Low:</span>
                    <p className="text-gray-600">24-48 hours</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Help;