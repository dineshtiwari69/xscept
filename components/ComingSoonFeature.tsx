// ComingSoon.tsx
import React from 'react';
import { BubblesIcon } from 'lucide-react';
export default function ComingSoon() {
  return (
    <div className="flex items-center justify-center h-[55vh] text-center p-8 bg-secondary text-white rounded-2xl shadow-lg">
      <div>
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2"><BubblesIcon className='text-accent'/> Coming Soon</h1>
        <p className="text-gray-300">
          This feature is currently under development. Stay tuned!
        </p>
      </div>
    </div>
  );
}
