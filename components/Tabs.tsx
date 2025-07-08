import React, { useState } from 'react';
import { Clock, Play, Settings } from 'lucide-react';
import RequestLogs from './Sections/RequestLogs';

const tabs = [
  { id: 'traffic', label: 'Traffic', icon: <Clock className="w-4 h-4 mr-1" /> },
  { id: 'repeater', label: 'Repeater', icon: <Play className="w-4 h-4 mr-1" /> },
  { id: 'proxyinfo', label: 'Proxy Info', icon: <Settings className="w-4 h-4 mr-1" /> },
  { id: 'sources', label: 'Sources', icon: <Play className="w-4 h-4 mr-1" /> },
];

const Tabs = () => {
  const [activeTab, setActiveTab] = useState('traffic');

  return (
    <div className="font-sans p-4 bg-gray-900 text-gray-100 flex flex-col min-h-screen">
      
      {/* Tab Header */}
      <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-700 mb-4">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`
              flex items-center w-full sm:w-auto justify-center sm:justify-start
              px-3 py-2 rounded-t-md border-b-4
              focus:outline-none transition-colors duration-300
              ${
                activeTab === id
                  ? 'border-blue-500 bg-gray-800 text-blue-400 font-semibold shadow'
                  : 'border-transparent hover:border-blue-600 hover:text-blue-400'
              }
            `}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-gray-800 rounded-md p-4 shadow-inner text-gray-300 overflow-auto max-w-full">
        {activeTab === 'traffic' && <RequestLogs />}
        {activeTab === 'repeater' && <div>Repeater Content</div>}
        {activeTab === 'proxyinfo' && <div>Proxy Info Content</div>}
        {activeTab === 'sources' && <div>Sources Content</div>}
      </div>
    </div>
  );
};

export default Tabs;
