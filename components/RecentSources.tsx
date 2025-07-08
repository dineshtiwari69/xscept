import React from 'react'
import { Chrome, Globe, Smartphone, Tablet, Settings, Play, Square, CheckCircle, XCircle, Clock, Search, Filter, MoreHorizontal, Shield, Info, Minimize2, Maximize2, X } from 'lucide-react';
import { useState } from 'react';
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
const categories = [
    { id: 'all', label: 'All' },
    { id: 'browser', label: 'Browsers' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'custom', label: 'Custom' }
  ];

export default function RecentSources() {
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

  return (
     <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold mb-3">Sources</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                
                className="w-full pl-9 pr-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="p-4 border-b border-gray-700">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                //   onClick={() => setSelectedCategory(category.id)}
                  className={`px-2 py-1 text-xs rounded transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {sources.map((source) => (
              <div
                key={source.id}
                // onClick={() => setSelectedSource(source.id)}
                className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors bg-gray-750 border-r-2 border-blue-500`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {source.icon}
                    <span className="text-sm font-medium truncate">{source.name}</span>
                  </div>
                  {getStatusIndicator(source.status)}
                </div>
                <p className="text-xs text-gray-400 truncate">{source.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">{getStatusText(source.status)}</span>
                  {source.port && (
                    <span className="text-xs font-mono bg-gray-700 px-1 py-0.5 rounded">
                      :{source.port}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
  )
}
