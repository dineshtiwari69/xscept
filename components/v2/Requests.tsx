import { Unplug, ArrowLeft, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Chrome, Smartphone, HelpCircle } from 'lucide-react';

type RequestLog = {
  type: "request";
  flow_id: string;
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
};

type ResponseLog = {
  type: "response";
  flow_id: string;
  status_code: number;
  url: string;
  headers: Record<string, string>;
  body: string | null;
};

export type MitmLog = RequestLog | ResponseLog;

type CombinedLog = {
  flow_id: string;
  request?: RequestLog;
  response?: ResponseLog;
};

export default function Requests() {
  const [logs, setLogs] = useState<CombinedLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    logData: any;
  }>({ show: false, x: 0, y: 0, logData: null });
  
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // WebSocket connection and log handling
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/ws');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const logData: MitmLog = JSON.parse(event.data);
          
          setLogs(prevLogs => {
            const existingLogIndex = prevLogs.findIndex(log => log.flow_id === logData.flow_id);
            
            if (existingLogIndex !== -1) {
              // Update existing log
              const updatedLogs = [...prevLogs];
              if (logData.type === 'request') {
                updatedLogs[existingLogIndex] = {
                  ...updatedLogs[existingLogIndex],
                  request: logData
                };
              } else {
                updatedLogs[existingLogIndex] = {
                  ...updatedLogs[existingLogIndex],
                  response: logData
                };
              }
              return updatedLogs;
            } else {
              // Create new log entry
              const newLog: CombinedLog = {
                flow_id: logData.flow_id,
                ...(logData.type === 'request' ? { request: logData } : { response: logData })
              };
              return [...prevLogs, newLog];
            }
          });
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected, attempting to reconnect...');
        setTimeout(connectWebSocket, 3000);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const selectedLogData = logs?.find(log => log.flow_id === selectedLog);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleContextMenu = (e: React.MouseEvent, log: any) => {
    e.preventDefault();
    
    // Get the position relative to the component container
    const rect = e.currentTarget.getBoundingClientRect();
    const containerRect = (e.currentTarget.closest('.flex.h-\\[75vh\\]') as HTMLElement)?.getBoundingClientRect();
    
    if (containerRect) {
      setContextMenu({
        show: true,
        x: e.clientX - containerRect.left,
        y: e.clientY - containerRect.top,
        logData: log
      });
    }
  };

  const handleClick = (log: any) => {
    setSelectedLog(log.flow_id);
    setContextMenu({ show: false, x: 0, y: 0, logData: null });
  };

  const copyAsCurl = () => {
    const log = contextMenu.logData;
    if (!log?.request) return;

    const request = log.request;
    let curl = `curl -X ${request.method}`;
    
    // Add URL
    curl += ` "${request.url}"`;
    
    // Add headers
    if (request.headers) {
      Object.entries(request.headers).forEach(([key, value]) => {
        curl += ` -H "${key}: ${value}"`;
      });
    }
    
    // Add body if it exists (for POST, PUT, etc.)
    if (request.body) {
      curl += ` -d '${request.body}'`;
    }

    navigator.clipboard.writeText(curl).then(() => {
      console.log('Copied to clipboard:', curl);
      // You might want to show a toast notification here
    });
    
    setContextMenu({ show: false, x: 0, y: 0, logData: null });
  };

  const sendToRepeater = () => {
    const log = contextMenu.logData;
    if (!log?.request) return;

    // This would typically send the request to a repeater tab/component
    console.log('Sending to repeater:', log);
    // You would implement the actual repeater functionality here
    
    setContextMenu({ show: false, x: 0, y: 0, logData: null });
  };

  const getSourceIcon = (userAgent: string) => {
    if (/chrome/i.test(userAgent)) {
      return <Chrome className="w-4 h-4" />;
    }

    if (/android/i.test(userAgent)) {
      return <Smartphone className="w-4 h-4" />;
    }

    return <HelpCircle className="w-4 h-4" />;
  };

  const getHostFromUrl = (url: string): string => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  const getPathFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname + urlObj.search;
    } catch {
      return url;
    }
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenu({ show: false, x: 0, y: 0, logData: null });
      }
    };

    if (contextMenu.show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu.show]);

  const renderHeaders = (headers: Record<string, string>) => {
    if (!headers) return null;
    
    return Object.entries(headers).map(([key, value]) => (
      <div key={key} className="flex items-start text-sm mb-2">
        <Plus className="w-3 h-3 mt-0.5 mr-2 text-gray-500" />
        <span className="text-gray-300 min-w-0 flex-shrink-0 mr-2">{key}:</span>
        <span className="text-gray-400 break-all">{value}</span>
      </div>
    ));
  };

  return (
    <div className="flex h-[75vh] bg-secondary text-gray-300 rounded-lg overflow-hidden relative">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-gray-700">
        {/* Header */}
        <div className="bg-secondary px-4 py-3 border-b border-gray-700">
          <div className="flex text-sm font-medium">
            <span className="w-20">Method</span>
            <span className="w-20">Status</span>
            <span className="w-28">Source</span>
            <span className="w-40 truncate">Host</span>
            <span className="flex-1 text-right truncate">Path and query</span>
          </div>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto">
          {logs?.map((log, index) => (
            <div
              onClick={() => handleClick(log)}
              onContextMenu={(e) => handleContextMenu(e, log)}
              key={index}
              className={`flex px-4 py-2 border-b border-gray-800 text-sm hover:bg-gray-800 transition cursor-pointer ${
                selectedLog === log.flow_id ? 'bg-gray-800' : ''
              }`}
            >
              <span className="w-20 truncate">{log.request?.method || '-'}</span>
              <span className="w-20 truncate">{log.response?.status_code || '-'}</span>
              <span className="w-6 h-6 text-accent">
                {getSourceIcon(log.request?.headers["User-Agent"] || "")}
              </span>
              <span className="w-40 truncate">
                {log.request?.url ? getHostFromUrl(log.request.url) : '-'}
              </span>
              <span className="flex-1 text-right truncate">
                {log.request?.url ? getPathFromUrl(log.request.url) : '-'}
              </span>
            </div>
          )) || (
            <div className="flex flex-col items-center justify-center h-full px-8">
              <Unplug className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-lg text-gray-400 text-center leading-relaxed">
                Connect a client and intercept some requests, and {"they'll"} appear here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col">
        {selectedLogData ? (
          <div className="flex-1 overflow-y-auto">
            {/* Request Section */}
            {selectedLogData.request && (
              <div className="border-b border-gray-700">
                <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded">
                      HTTP/1.1
                    </span>
                    <span className="inline-block px-2 py-1 bg-purple-600 text-white text-xs rounded">
                      {selectedLogData.request.method}
                    </span>
                    <span className="text-gray-300 text-sm truncate">
                      {getHostFromUrl(selectedLogData.request.url)}
                    </span>
                    <span className="text-gray-400 text-sm">REQUEST</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                  </div>
                </div>

                <div className="px-4 py-3">
                  <div className="mb-4">
                    <div className="flex items-center text-sm mb-2">
                      <span className="text-gray-300 font-medium">METHOD:</span>
                      <span className="text-gray-400 ml-2">{selectedLogData.request.method}</span>
                      <Plus className="w-3 h-3 ml-2 text-gray-500" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-300 font-medium mb-2">URL</div>
                    <div className="flex items-start text-sm">
                      <Plus className="w-3 h-3 mt-0.5 mr-2 text-gray-500" />
                      <span className="text-gray-400 break-all">
                        {selectedLogData.request.url}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-300 font-medium mb-2">HEADERS</div>
                    {renderHeaders(selectedLogData.request.headers)}
                  </div>

                  {selectedLogData.request.body && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-300 font-medium mb-2">BODY</div>
                      <div className="flex items-start text-sm">
                        <Plus className="w-3 h-3 mt-0.5 mr-2 text-gray-500" />
                        <pre className="text-gray-400 break-all whitespace-pre-wrap">
                          {selectedLogData.request.body}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Response Section */}
            {selectedLogData.response && (
              <div className="border-b border-gray-700">
                <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block px-2 py-1 bg-green-600 text-white text-xs rounded">
                      {selectedLogData.response.status_code}
                    </span>
                    <span className="text-gray-300 text-sm">RESPONSE</span>
                    <ChevronDown className="w-4 h-4 text-gray-400 ml-auto" />
                  </div>
                </div>

                <div className="px-4 py-3">
                  <div className="mb-4">
                    <div className="flex items-center text-sm mb-2">
                      <span className="text-gray-300 font-medium">STATUS:</span>
                      <span className="text-gray-400 ml-2">{selectedLogData.response.status_code}</span>
                      <Plus className="w-3 h-3 ml-2 text-gray-500" />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-gray-300 font-medium mb-2">HEADERS</div>
                    {renderHeaders(selectedLogData.response.headers)}
                  </div>

                  {selectedLogData.response.body && (
                    <div className="mb-4">
                      <div className="text-sm text-gray-300 font-medium mb-2">BODY</div>
                      <div className="flex items-start text-sm">
                        <Plus className="w-3 h-3 mt-0.5 mr-2 text-gray-500" />
                        <pre className="text-gray-400 break-all whitespace-pre-wrap">
                          {selectedLogData.response.body}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center px-8">
            <ArrowLeft className="w-16 h-16 text-gray-600 mb-4" />
            <p className="text-lg text-gray-400 text-center leading-relaxed">
              Select an exchange to see the full details.
            </p>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu.show && (
        <div
          ref={contextMenuRef}
          className="absolute bg-gray-800 border border-gray-600 rounded-md shadow-lg py-1 z-50 min-w-[160px]"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
          }}
        >
          <button
            onClick={copyAsCurl}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Copy as Curl
          </button>
          <button
            onClick={sendToRepeater}
            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Send To Repeater
          </button>
        </div>
      )}
    </div>
  );
}