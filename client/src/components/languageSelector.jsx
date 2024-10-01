import React, { useState } from 'react';
import { LANGUAGE_VERSIONS } from '../utilities/constants'

const languages = Object.entries(LANGUAGE_VERSIONS);
const ACTIVE_COLOR = 'text-blue-400';

export default function LanguageSelector({ language, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative z-10">
      <div className="relative inline-block text-left">
        <div className='flex flex-row gap-2'>
          <div className='flex items-center'>Language Selector : </div>
          <button
            type="button"
            onClick={toggleDropdown}
            className="bg-gray-900 text-white px-4 py-2 rounded-md border border-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {language}
          </button>
        </div>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
            <div className="py-1">
              {languages.map(([lang, version]) => (
                <button
                  key={lang}
                  className={`block w-full px-4 py-2 text-left text-sm ${lang === language ? ACTIVE_COLOR : 'text-white'} ${lang === language ? 'bg-gray-800' : 'hover:bg-gray-800'}`}
                  onClick={() => {
                    onSelect(lang);
                    setIsOpen(false); // Close dropdown after selection
                  }}
                >
                  {lang}
                  <span className="text-gray-600 text-xs ml-2">({version})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
