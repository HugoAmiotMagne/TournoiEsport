import React from 'react';

export default function BarreRecherche({ value, onChange, placeholder = 'Rechercher...', resultCount }) {
  return (
    <div className="w-full px-4 sm:px-8 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-5 py-3 sm:px-6 sm:py-4 pr-12 rounded-2xl border-2 border-green-600 
                       focus:border-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 
                       text-gray-800 placeholder-gray-500 text-base sm:text-lg shadow-lg bg-white"
          />
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-green-600"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {value && resultCount !== undefined && (
          <p className="text-center mt-3 text-gray-700 font-medium text-sm sm:text-base">
            {resultCount} résultat{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  );
}