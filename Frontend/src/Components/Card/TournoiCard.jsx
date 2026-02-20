import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const getStatutColor = (statut) => {
  if (statut === 'en cours') return 'text-yellow-300';
  if (statut === 'à venir') return 'text-green-300';
  return 'text-gray-300';
};

export default function TournoiCard({ tournoi }) {
  const inscrits = tournoi.inscriptions?.length ?? 0;
  const plein = inscrits >= tournoi.nombre_equipes_max;
  const navigate = useNavigate();

  return (
    <Link key={tournoi._id} to={`/tournois/${tournoi._id}`} className="block group">
      <div
        className="bg-gradient-to-br from-green-600 to-green-700 shadow-lg p-6 sm:p-8 text-white
                   group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300 h-full flex flex-col"
        style={{
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '0',
          borderBottomLeftRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem',
        }}
      >
        {/* En-tête */}
        <div className="text-center mb-5">
          <h2 className="text-xl sm:text-2xl font-bold leading-tight">{tournoi.Name}</h2>
          <p className="text-green-200 text-sm mt-1">
            {new Date(tournoi.date_debut).toLocaleDateString('fr-FR')}
            {' — '}
            {new Date(tournoi.date_fin).toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Description */}
        <div
          className="bg-green-800 p-4 sm:p-5 mb-5 flex-1"
          style={{
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '0',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
          }}
        >
          <h3 className="text-yellow-300 font-semibold mb-2 text-sm sm:text-base">Description :</h3>
          <p className="text-green-100 text-sm leading-relaxed mb-3 line-clamp-3">
            {tournoi.description}
          </p>
          <p className="text-yellow-300 font-medium text-sm sm:text-base">
            {tournoi.nombre_equipes_max} équipes maximum
          </p>
        </div>

        {/* Infos bas de carte */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-700 p-3 rounded-xl">
            <p className="text-green-200 text-xs mb-1">Prix d&apos;inscription</p>
            <p className="text-lg sm:text-xl font-bold">
              {tournoi.prix_inscription === 0
                ? <span className="text-green-300 text-base">Gratuit</span>
                : `${tournoi.prix_inscription}€`}
            </p>
          </div>
          <div className="bg-green-700 p-3 rounded-xl">
            <p className="text-green-200 text-xs mb-1">Statut</p>
            <p className={`text-base sm:text-lg font-bold ${getStatutColor(tournoi.statut)}`}>
              {tournoi.statut}
            </p>
          </div>
        </div>

        {/* Bouton inscription */}
        {(tournoi.statut === 'à venir' || tournoi.statut === 'en cours') && (
          plein ? (
            <div className="flex items-center justify-center gap-2 bg-red-500/20 border border-red-400 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span className="text-red-300 font-bold text-sm">Tournoi complet</span>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <button
                onClick={(e) => { e.stopPropagation(); navigate(`/inscription/tournois/${tournoi._id}`); }}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300
                           text-green-900 font-bold text-sm rounded-xl text-center
                           transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                           flex items-center justify-center gap-2"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                S&apos;inscrire
              </button>
              <p className="text-green-300 text-xs text-center">
                {tournoi.nombre_equipes_max - inscrits} place{tournoi.nombre_equipes_max - inscrits > 1 ? 's' : ''} restante{tournoi.nombre_equipes_max - inscrits > 1 ? 's' : ''}
              </p>
            </div>
          )
        )}
      </div>
    </Link>
  );
}