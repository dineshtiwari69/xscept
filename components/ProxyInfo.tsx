import React, { useState } from 'react'
import {
  NetworkIcon,
  LockIcon,
  Server,
  InfoIcon,
  MonitorIcon,
  ServerIcon,
  Network,
  ChevronDown,
} from 'lucide-react'
import { useCertificate } from '../hooks/use-logs'

export default function ProxyInfo() {
  const [showCert, setShowCert] = useState(false)

  const {data:certificateText} = useCertificate()

  return (
    <div className="bg-secondary/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-accent/20 rounded-lg">
          <Server className="w-8 h-8 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-medium text-white">Proxy Configuration</h2>
          <p className="text-gray-400">Connection details and certificate information</p>
        </div>
      </div>

      {/* Proxy Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <Network className="w-5 h-5 mr-2 text-accent" />
            Connection Details
          </h3>
          <div className="space-y-3 pl-7">
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <span className="text-gray-300">Proxy URL</span>
              <span className="text-white font-mono">http://localhost</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <span className="text-gray-300">Port</span>
              <span className="text-white font-mono">8080</span>
            </div>
          </div>
        </div>

        {/* Certificate Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center">
            <LockIcon className="w-5 h-5 mr-2 text-accent" />
            Certificate Status
          </h3>
          <div className="space-y-3 pl-7">
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <span className="text-gray-300">Status</span>
              <span className="text-green-400 font-medium flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Installed
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
              <span className="text-gray-300">Type</span>
              <span className="text-white font-mono">SSL/TLS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Text Section */}
      <div className="space-y-3">
        <h3
          className="text-lg font-medium text-white flex items-center cursor-pointer select-none"
          onClick={() => setShowCert(!showCert)}
        >
          <LockIcon className="w-5 h-5 mr-2 text-accent" />
          Certificate Details
          <ChevronDown
            className={`ml-2 transition-transform ${showCert ? 'rotate-180' : ''}`}
          />
        </h3>
        {showCert && (
          <div className="bg-gray-900/50 border border-gray-700/40 rounded-lg p-4 overflow-auto max-h-64">
            <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">
              {certificateText}
            </pre>
          </div>
        )}
      </div>

      {/* Important Note */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <InfoIcon className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-2">
            <h4 className="text-blue-300 font-medium">Usage Note</h4>
            <p className="text-gray-300 leading-relaxed">
              These proxy settings can be used on any device. However, if {"you're"} using
              virtual machines, emulators, or remote devices, you may need to replace{' '}
              <code className="bg-gray-800 px-2 py-1 rounded text-accent">localhost</code> with
              your{" device's"} IP address (e.g.,{' '}
              <code className="bg-gray-800 px-2 py-1 rounded text-accent">192.168.1.100</code>) to
              establish a proper connection.
            </p>
          </div>
        </div>
      </div>

      {/* Device Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3 p-4 bg-gray-800/20 rounded-lg">
          <MonitorIcon className="w-5 h-5 text-accent" />
          <div>
            <div className="text-white font-medium">Local Device</div>
            <div className="text-gray-400 text-sm">Use localhost</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-gray-800/20 rounded-lg">
          <ServerIcon className="w-5 h-5 text-accent" />
          <div>
            <div className="text-white font-medium">Virtual Machine</div>
            <div className="text-gray-400 text-sm">Use host IP</div>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-4 bg-gray-800/20 rounded-lg">
          <NetworkIcon className="w-5 h-5 text-accent" />
          <div>
            <div className="text-white font-medium">Remote Device</div>
            <div className="text-gray-400 text-sm">Use network IP</div>
          </div>
        </div>
      </div>
    </div>
  )
}
