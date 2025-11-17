import React from 'react';
import { PlayIcon } from './icons';

const FocusMusic: React.FC = () => {
  const searchQuery = "instrumental music for studying";
  const focusMusicUrl = `https://music.youtube.com/search?q=${encodeURIComponent(searchQuery)}`;

  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-center items-center text-center">
      <h2 className="text-lg font-semibold text-gray-800">
        Play Music for Focus
      </h2>
      <a
        href={focusMusicUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center gap-x-2 rounded-md px-4 py-2 text-sm font-semibold shadow-sm bg-brand-primary hover:bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
        aria-label="Search for instrumental study music on YouTube Music in a new tab"
      >
        <PlayIcon className="w-5 h-5" />
        <span>Open YouTube Music</span>
      </a>
      <p className="mt-2 text-xs text-gray-500">
        Searches for instrumental study music in a new tab.
      </p>
    </div>
  );
};

export default FocusMusic;