import React from 'react';

const TYPE_CONFIG = {
  Standard: {
    bg: 'from-green-700 to-green-800',
    badge: 'bg-green-500 text-white',
    icon: '🎟️',
  },
  VIP: {
    bg: 'from-yellow-600 to-yellow-700',
    badge: 'bg-yellow-300 text-green-900',
    icon: '⭐',
  },
  PRESSE: {
    bg: 'from-blue-700 to-blue-800',
    badge: 'bg-blue-400 text-white',
    icon: '📰',
  },
};

const STATUT_CONFIG = {
  disponible: { label: 'Disponible', color: 'text-green-300', dot: 'bg-green-400' },
  vendu:      { label: 'Complet',    color: 'text-red-300',   dot: 'bg-red-400' },
  utilisé:    { label: 'Utilisé',    color: 'text-gray-400',  dot: 'bg-gray-400' },
  annulé:     { label: 'Annulé',     color: 'text-orange-300',dot: 'bg-orange-400' },
};

export default function BilletCard({ billet, onEdit }) {
  const cfg  = TYPE_CONFIG[billet.type]   ?? TYPE_CONFIG.Standard;
  const st   = STATUT_CONFIG[billet.statut] ?? STATUT_CONFIG.disponible;
  const dispo = billet.statut === 'disponible';

  return (
    <div
      className={`bg-gradient-to-br ${cfg.bg} shadow-lg p-6 text-white flex flex-col gap-4
                  transition-all duration-300
                  ${dispo ? 'hover:shadow-2xl hover:scale-[1.02]' : 'opacity-75'}`}
      style={{
        borderTopLeftRadius: '1.5rem',
        borderTopRightRadius: '0',
        borderBottomLeftRadius: '1.5rem',
        borderBottomRightRadius: '1.5rem',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-2xl">{cfg.icon}</span>
          <h3 className="text-xl font-bold mt-1">{billet.type}</h3>
          {billet.tournoi && (
            <p className="text-white/70 text-sm mt-0.5">{billet.tournoi.Name}</p>
          )}
        </div>
        <span className={`${cfg.badge} text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 mt-1`}>
          {billet.quantite} place{billet.quantite > 1 ? 's' : ''}
        </span>
      </div>

      {/* Infos */}
      <div
        className="bg-black/20 p-4 flex flex-col gap-2 text-sm flex-1"
        style={{
          borderTopLeftRadius: '1rem',
          borderTopRightRadius: '0',
          borderBottomLeftRadius: '1rem',
          borderBottomRightRadius: '1rem',
        }}
      >
        {/* Salle */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="text-white/80">
            {billet.salle?.nom ?? 'Salle inconnue'}
            {billet.salle?.ville ? ` — ${billet.salle.ville}` : ''}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 opacity-60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span className="text-white/80">
            {billet.date_evenement
              ? new Date(billet.date_evenement).toLocaleDateString('fr-FR', {
                  day: 'numeric', month: 'long', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })
              : 'Date non définie'}
          </span>
        </div>

        {/* Statut */}
        <div className="flex items-center gap-2 mt-1">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dot}`} />
          <span className={`font-medium ${st.color}`}>{st.label}</span>
        </div>
      </div>

      {/* Prix + CTA */}
      <div className="flex items-center justify-between gap-3 mt-auto">
        <p className="text-2xl font-bold">
          {billet.prix === 0
            ? <span className="text-green-300 text-lg font-bold">Gratuit</span>
            : `${billet.prix} €`}
        </p>

        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(billet)}
              className="bg-white/20 hover:bg-white/30 text-white font-bold text-sm
                         px-4 py-2.5 rounded-xl transition-all duration-200
                         hover:scale-105 active:scale-95 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Modifier
            </button>
          )}
          {dispo ? (
            <button
              type="button"
              className="bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold text-sm
                         px-5 py-2.5 rounded-xl transition-all duration-200
                         hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 9M5 21h14M10 17h4"/>
              </svg>
              Acheter
            </button>
          ) : (
            <span className="text-white/50 text-sm font-medium italic">Indisponible</span>
          )}
        </div>
      </div>
    </div>
  );
}