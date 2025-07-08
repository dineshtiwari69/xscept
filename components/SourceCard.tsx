import React, { useState } from 'react'
import { ChromeIcon, BubblesIcon } from 'lucide-react'
import { API_SERVER } from '../constants'
import { IconType } from 'react-icons'

interface SourceType {
  title: string
  description: string
  status: 'available' | 'coming-soon' | 'not-available'
  launch_url?: string
  Icon: React.ComponentType<any>

}
export default function SourceCard({ title, description, status, Icon, launch_url }: SourceType) {
  const [loading, setLoading] = useState(false)

  const handleLaunch = async () => {
    if (!launch_url) return
    setLoading(true)
    try {
      await fetch(`${API_SERVER}/${launch_url}`)
    } catch (error) {
      console.error('Launch failed', error)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || status === 'not-available'

  return (
    <div className='bg-secondary p-6 rounded-lg border border-gray-700 max-w-sm relative shadow-md transition hover:shadow-lg'>
      {/* ...other code unchanged */}
   {/* Top-right icon */}
      <div className='absolute top-4 right-4'>
        <BubblesIcon className='w-5 h-5 text-accent' />
      </div>

      {/* Main icon */}
      <div className='mb-4'>
        <Icon className='w-10 h-10 text-white' />
      </div>

      {/* Title */}
      <h3 className='text-white text-xl font-medium mb-2'>
        {title}
      </h3>

      {/* Description */}
      <p className='text-gray-400 text-sm leading-relaxed mb-4'>
        {description}
      </p>


      {launch_url && (
        <button
          onClick={handleLaunch}
          disabled={isDisabled}
          className={`w-full inline-flex justify-center items-center px-4 py-2 rounded-md
            ${status === 'not-available' ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-accent text-black hover:bg-accent/90'}
            font-semibold text-sm transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {loading && (
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {loading ? 'Launching...' : (status === 'not-available' ? 'Unavailable' : 'Launch')}
        </button>
      )}
    </div>
  )
}