import React from 'react';
import { Link } from 'react-router-dom';

export default function Bouton({ to, onClick, children, className = '' }) {
  const style = {
    borderTopLeftRadius: '1rem',
    borderTopRightRadius: '0',
    borderBottomLeftRadius: '1rem',
    borderBottomRightRadius: '1rem',
  };

  const base = `flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800
                text-white font-bold text-sm sm:text-base px-6 py-3 sm:py-4
                shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                whitespace-nowrap border-2 border-green-700 hover:border-green-800 ${className}`;

  if (to) {
    return (
      <Link to={to} style={style} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} style={style} className={base}>
      {children}
    </button>
  );
}