import React from 'react'
import SourceCard from '../SourceCard'
import { ChromeIcon } from 'lucide-react'
import { FaFirefox } from "react-icons/fa";
import { useBrowsers } from '../../hooks/use-browsers';
import { SUPPORTED_BROWSERS } from '../../constants';


export default function Sources() {
    const { data: browsers } = useBrowsers()


    const availableBrowsers = browsers ? browsers.map((browser)=>browser.browser_type) : [];


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
                {SUPPORTED_BROWSERS?.map((browser, index) => {
                    const isAvailable = availableBrowsers.includes(browser.browser_type)
                    return <SourceCard key={index} title={`Fresh ${browser.display_name}`} description={`Intercept Traffic on a Fresh ${browser.display_name} Instance`} Icon={ChromeIcon} status={isAvailable ? "available": "not-available"} launch_url={`launch-fresh-chromium?browser=${browser.browser_type}`} /> ;
                })}





            </div>

        </div>



    )
}
