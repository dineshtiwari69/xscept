import React, { useState } from 'react'
import { Shield } from 'lucide-react'
import { useLogs } from '../../hooks/use-logs'
import ResponseLog from './ResponseLog'

export default function RequestLogs() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>()
  const { data: logs } = useLogs()

  return (
    <div className="w-full h-screen bg-[#0d0d0d] text-gray-200 font-mono flex">
      {/* Left: Request List */}
      <div className="w-1/2 border-r border-gray-800 overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#1a1a1a] sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left">Method</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Host</th>
              <th className="px-3 py-2 text-left">Path</th>
            </tr>
          </thead>
          <tbody>
            {logs?.map((log, idx) => (
              <tr
                key={idx}
                className={`border-t border-gray-800 hover:bg-[#262626] cursor-pointer ${
                  selectedRequest === log.flow_id ? 'bg-[#1e1e1e]' : ''
                }`}
                onClick={() => setSelectedRequest(log.flow_id)}
              >
                <td className="px-3 py-2">{log.request?.method}</td>
                <td className="px-3 py-2">{log.response?.status_code}</td>
                <td className="px-3 py-2 truncate">{log.request?.host}</td>
                <td className="px-3 py-2 truncate">{log.request?.path}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right: Response Preview */}
      <div className=" h-full bg-[#0d0d0d] overflow-y-auto overflow-x-auto p-4 max-w-1/2">

        {selectedRequest ? (
          <ResponseLog id={selectedRequest} />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-600">
            <Shield className="w-12 h-12 mb-4" />
            <p className="text-md font-semibold">Select a request to inspect</p>
            <p className="text-sm text-gray-500">Click on a row from the list</p>
          </div>
        )}
      </div>
    </div>
  )
}
