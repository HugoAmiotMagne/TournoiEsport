import React from 'react';

const rStyle = (tl, tr, bl, br) => ({
  borderTopLeftRadius: tl,
  borderTopRightRadius: tr,
  borderBottomLeftRadius: bl,
  borderBottomRightRadius: br,
});
const asymCard  = rStyle('1.5rem', '0', '1.5rem', '1.5rem');
const asymInner = rStyle('1rem',   '0', '1rem',   '1rem');
const asymImg   = rStyle('1.5rem', '0', '0',      '0');

export default function JeuCard({ jeu }) {
  const imgSrc = jeu.image
    ? (jeu.image.startsWith('/uploads') ? `${import.meta.env.VITE_API_URL ?? ''}${jeu.image}` : jeu.image)
    : null;

  return (
    <div
      className="bg-gradient-to-br from-green-600 to-green-700 shadow-lg text-white
                 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col overflow-hidden"
      style={asymCard}
    >
      {/* ── Bannière image + nom en overlay ── */}
      <div className="relative w-full h-40 sm:h-48 flex-shrink-0 bg-green-900" style={asymImg}>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={jeu.Name}
            className="w-full h-full object-cover"
            style={asymImg}
            width="400"
            height="192"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={asymImg}>
            <span className="text-5xl">🎮</span>
          </div>
        )}

        {/* Dégradé + nom */}
        <div
          className="absolute inset-0 flex items-end"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.72) 40%, transparent 100%)',
            ...asymImg,
          }}
        >
          <div className="w-full px-4 pb-3">
            <h2
              className="text-xl sm:text-2xl font-bold leading-tight text-yellow-300 drop-shadow"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {jeu.Name}
            </h2>
            <p className="text-yellow-200 text-xs font-bold uppercase tracking-widest mt-0.5 drop-shadow">
              {jeu.plateforme}
            </p>
          </div>
        </div>
      </div>

      {/* ── Corps de la carte ── */}
      <div className="p-5 sm:p-6 flex flex-col gap-4 flex-1">

        {/* Infos bloc */}
        <div className="bg-green-800 p-4 sm:p-5 flex-1 flex flex-col gap-3" style={asymInner}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-green-300 text-xs uppercase tracking-widest mb-0.5">Mode</p>
              <p className="text-white font-semibold text-sm">{jeu.Mode}</p>
            </div>
            <div>
              <p className="text-green-300 text-xs uppercase tracking-widest mb-0.5">Map</p>
              <p className="text-white font-semibold text-sm">{jeu.Map}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-green-700">
            <svg className="w-4 h-4 text-green-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-green-200 text-sm">
              <span className="text-white font-bold">{jeu.min_joueur}</span>
              <span className="text-green-300 mx-1">–</span>
              <span className="text-white font-bold">{jeu.max_joueur}</span>
              <span className="text-green-300 ml-1">joueurs</span>
            </p>
          </div>
        </div>

        {/* Tournois liés */}
        {Array.isArray(jeu.tournois) && jeu.tournois.length > 0 && (
          <div className="bg-green-700 px-4 py-2.5 rounded-xl flex items-center justify-between">
            <p className="text-green-200 text-xs">Tournois</p>
            <span className="text-white font-bold text-lg">{jeu.tournois.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}