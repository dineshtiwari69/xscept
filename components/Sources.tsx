import React, { useState } from 'react';
import { Chrome, Globe, Smartphone, Tablet, Settings, Play, Square, CheckCircle, XCircle, Clock, Search, Filter, MoreHorizontal, Shield, Info, Minimize2, Maximize2, X } from 'lucide-react';
import RecentSources from './RecentSources';
import MainPanel from './MainPanel';

interface Source {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'not-connected' | 'connected' | 'intercepting';
  category: 'browser' | 'mobile' | 'custom';
  autoInstallCert: boolean;
  port?: number;
}

const Sources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const [sources, setSources] = useState<Source[]>([
    {
      id: 'chrome',
      name: 'Chrome Browser',
      description: 'Intercept Chrome browser traffic',
      icon: <Chrome className="w-5 h-5 text-blue-400" />,
      status: 'connected',
      category: 'browser',
      autoInstallCert: true,
      port: 8080
    },
    {
      id: 'firefox',
      name: 'Firefox Browser',
      description: 'Intercept Firefox browser traffic',
      icon: <Globe className="w-5 h-5 text-orange-400" />,
      status: 'not-connected',
      category: 'browser',
      autoInstallCert: false,
      port: 8080
    },
    {
      id: 'android',
      name: 'Android Emulator',
      description: 'Intercept Android emulator traffic',
      icon: <Smartphone className="w-5 h-5 text-green-400" />,
      status: 'intercepting',
      category: 'mobile',
      autoInstallCert: true,
      port: 8081
    },
    {
      id: 'ios',
      name: 'iOS Simulator',
      description: 'Intercept iOS simulator traffic',
      icon: <Tablet className="w-5 h-5 text-purple-400" />,
      status: 'not-connected',
      category: 'mobile',
      autoInstallCert: false,
      port: 8082
    },
    {
      id: 'custom',
      name: 'Custom App',
      description: 'Configure custom application or process',
      icon: <Settings className="w-5 h-5 text-gray-400" />,
      status: 'not-connected',
      category: 'custom',
      autoInstallCert: false,
      port: 8083
    }
  ]);

  const getStatusIndicator = (status: Source['status']) => {
    switch (status) {
      case 'connected':
        return <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>;
      case 'intercepting':
        return <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>;
      case 'not-connected':
        return <div className="w-2 h-2 bg-gray-500 rounded-full"></div>;
      default:
        return null;
    }
  };

  const getStatusText = (status: Source['status']) => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'intercepting':
        return 'Intercepting';
      case 'not-connected':
        return 'Not Connected';
      default:
        return '';
    }
  };

  const getActionButton = (source: Source) => {
    const handleAction = () => {
      setSources(prev => prev.map(s => 
        s.id === source.id 
          ? { ...s, status: s.status === 'intercepting' ? 'connected' : 'intercepting' }
          : s
      ));
    };

    if (source.status === 'intercepting') {
      return (
        <button
          onClick={handleAction}
          className="flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded border border-red-500 transition-colors"
        >
          <Square className="w-3 h-3 mr-2" />
          Stop
        </button>
      );
    }

    return (
      <button
        onClick={handleAction}
        className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded border border-blue-500 transition-colors"
      >
        <Play className="w-3 h-3 mr-2" />
        {source.status === 'not-connected' ? 'Setup' : 'Start'}
      </button>
    );
  };

  const toggleCertificate = (sourceId: string) => {
    setSources(prev => prev.map(s => 
      s.id === sourceId 
        ? { ...s, autoInstallCert: !s.autoInstallCert }
        : s
    ));
  };

  const filteredSources = sources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         source.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || source.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'browser', label: 'Browsers' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'custom', label: 'Custom' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium">Network Interceptor</span>
          </div>
          <span className="text-xs text-gray-500">v2.1.0</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
            <Minimize2 className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
            <Maximize2 className="w-4 h-4 text-gray-400" />
          </button>
          <button className="p-1.5 hover:bg-red-600 rounded transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {/* <RecentSources/> */}

        {/* Main Panel */}
        <MainPanel/>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Ready</span>
          <span>•</span>
          <span>{filteredSources.filter(s => s.status === 'intercepting').length} active</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>CPU: 2%</span>
          <span>Memory: 45MB</span>
        </div>
      </div>
    </div>
  );
};

export default Sources;