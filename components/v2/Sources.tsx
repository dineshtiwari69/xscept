import React from 'react'
import SourceCard from '../SourceCard'
import { ChromeIcon } from 'lucide-react'
import { FaFirefox } from "react-icons/fa";




export default function Sources() {
    return (
        <div className=''>
            <div className='pb-10'>
                <h1 className='text-2xl '>
                    Sources
                </h1>
                <p className='text-gray-400'>
                    Select one of the sources and start intercepting
                </p>
            </div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
                <SourceCard title='Fresh Chrome' description='Intercept Traffic on a Fresh Chrome Instance' Icon={ChromeIcon} status='available' launch_url='fresh-chromium'/>
                {/* @ts-ignore */}
                <SourceCard title='Firefox' description='Intercept Traffic on a Fresh Firefox Instance' Icon={FaFirefox} status='not-available' launch_url='fresh-chromium'/>
                
            </div>
            
        </div>



    )
}
