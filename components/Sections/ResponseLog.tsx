import React from 'react'
import { useLog } from '../../hooks/use-logs'
import Editor from '@monaco-editor/react'

export default function ResponseLog({ id }: { id: string }) {
  const { data: responseData, isLoading, error } = useLog(id)

  if (isLoading) return <div className="text-gray-500">Loading...</div>
  if (error || !responseData) return <div className="text-red-500">Failed to load log</div>

  const { request, response } = responseData

  return (
    <div className="space-y-8 font-mono ">
      {/* Request */}
      <div>
        <h2 className="text-lg font-bold border-b border-gray-700 mb-2 pb-1">🔍 Request</h2>
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 space-y-2">
          <div><span className="text-green-400 truncate">Method:</span> {request?.method}</div>
          <div><span className="text-green-400 truncate">URL:</span> {request?.url}</div>
          <div><span className="text-green-400 truncate">Host:</span> {request?.host}</div>
          <div><span className="text-green-400 truncate">Path:</span> {request?.path}</div>
          <div><span className="text-green-400 truncate">Timestamp:</span> {new Date(request?.timestamp || 0 * 1000 ).toLocaleString()}</div>
          <div>
            <div className="text-green-400">Headers:</div>
            <Editor
              height="180px"
              defaultLanguage="json"
              value={JSON.stringify(request?.headers, null, 2)}
              theme="vs-dark"
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
            />
          </div>
          <div>
            <div className="text-green-400">Body:</div>
            <Editor
              height="180px"
              defaultLanguage="json"
              value={request?.body || '(empty body)'}
              theme="vs-dark"
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
            />
          </div>
        </div>
      </div>

      {/* Response */}
      <div>
        <h2 className="text-lg font-bold border-b border-gray-700 mb-2 pb-1">📦 Response</h2>
        <div className="bg-[#1a1a1a] p-4 rounded-lg border border-gray-800 space-y-2">
          <div><span className="text-blue-400">Status:</span> {response?.status_code}</div>
          <div><span className="text-blue-400">Timestamp:</span> {new Date(response?.timestamp  || 0 * 1000).toLocaleString()}</div>
          <div>
            <div className="text-blue-400">Headers:</div>
            <Editor
              height="180px"
              defaultLanguage="json"
              value={JSON.stringify(response?.headers, null, 2)}
              theme="vs-dark"
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
            />
          </div>
          <div>
            <div className="text-blue-400">Body:</div>
            <Editor
              height="180px"
              defaultLanguage="json"
              value={response?.body || '(empty body)'}
              theme="vs-dark"
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
