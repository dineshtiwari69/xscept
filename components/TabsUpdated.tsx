import React, { useState } from 'react'
import Sources from './v2/Sources'
import Requests from './v2/Requests'
import ComingSoon from './ComingSoonFeature'
import ProxyInfo from './ProxyInfo'
export default function TabsUpdated() {
    const [activeTab, setActiveTab] = useState('Sources')

    const tabs = ['Sources', 'Requests', 'Repeater', 'Proxy']

    return (
        <div className=' px-10 py-4'>

            <div className='flex space-x-8 pb-5 border-b border-secondary'>
                <h1 className='text-2xl pr-4 border-accent border-r font-bold italic text-white'>
                    xscept
                </h1>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`relative pb-2 text-sm font-medium transition-colors ${activeTab === tab
                            ? 'text-white'
                            : 'text-gray-400 hover:text-gray-300'
                            }`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-[#E3E332]' />
                        )}
                    </button>
                ))}
            </div>

            <div className='py-10'>

                {activeTab == "Sources" && <Sources />}
                {activeTab == "Requests" && <Requests />}
                {activeTab == "Repeater" && <ComingSoon/>}
                {activeTab == "Proxy" && <ProxyInfo/>}
            </div>
        </div>
    )
}