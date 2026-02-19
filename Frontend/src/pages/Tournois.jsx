import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTournois } from '../services/api';

export default function Tournois() {
  const [tournois, setTournois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getTournois()
      .then(data => {
        setTournois(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const tournoisFiltres = tournois.filter((tournoi) =>
    tournoi.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournoi.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tournoi.statut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatutColor = (statut) => {
    if (statut === 'en cours') return 'text-yellow-300';
    if (statut === 'à venir') return 'text-green-300';
    return 'text-gray-300';
  };

  if (loading) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <p className="text-gray-800 text-xl font-semibold">Chargement...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <p className="text-red-600 text-xl">Erreur : {error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full">

      {/* ── Bannière ── */}
      <div className="w-full bg-gradient-to-br from-green-600 to-green-700 py-12 sm:py-16 px-4 sm:px-8 text-center">
        <p className="text-gray-800 text-sm font-medium mb-2">
          {new Date().toLocaleDateString('fr-FR', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <h1
          className="text-5xl sm:text-6xl font-bold text-yellow-300 italic mb-3"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Tournois
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 font-semibold">
          Fan de compétition
        </p>
      </div>

      {/* ── Barre de recherche ── */}
      <div className="w-full px-4 sm:px-8 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher par nom, description ou statut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 sm:px-6 sm:py-4 pr-12 rounded-2xl border-2 border-green-600 focus:border-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 text-gray-800 placeholder-gray-500 text-base sm:text-lg shadow-lg bg-white"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-green-600"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {searchTerm && (
            <p className="text-center mt-3 text-gray-700 font-medium text-sm sm:text-base">
              {tournoisFiltres.length} tournoi{tournoisFiltres.length !== 1 ? 's' : ''} trouvé{tournoisFiltres.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* ── Grille des tournois ── */}
      <div className="w-full px-4 sm:px-8 pb-12">
        {tournoisFiltres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg sm:text-xl">
              Aucun tournoi trouvé pour &quot;{searchTerm}&quot;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {tournoisFiltres.map((tournoi) => (
              <Link
                key={tournoi._id}
                to={`/tournois/${tournoi._id}`}
                className="block group"
              >
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
                        {tournoi.prix_inscription === 0 ? <span className="text-green-300 text-base">Gratuit</span> : `${tournoi.prix_inscription}€`}
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
                  {(tournoi.statut === 'à venir' || tournoi.statut === 'en cours') && (() => {
                    const inscrits = tournoi.inscriptions?.length ?? 0;
                    const plein    = inscrits >= tournoi.nombre_equipes_max;

                    if (plein) return (
                      <div className="flex items-center justify-center gap-2 bg-red-500/20 border border-red-400 rounded-xl px-4 py-3">
                        <svg className="w-4 h-4 text-red-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <span className="text-red-300 font-bold text-sm">Tournoi complet</span>
                      </div>
                    );

                    return (
                      <div className="flex flex-col gap-1">
                        <Link
                          to={`/inscription/tournois/${tournoi._id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-full py-3 bg-yellow-400 hover:bg-yellow-300
                                     text-green-900 font-bold text-sm rounded-xl text-center
                                     transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                                     flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                          S&apos;inscrire
                        </Link>
                        <p className="text-green-300 text-xs text-center">
                          {tournoi.nombre_equipes_max - inscrits} place{tournoi.nombre_equipes_max - inscrits > 1 ? 's' : ''} restante{tournoi.nombre_equipes_max - inscrits > 1 ? 's' : ''}
                        </p>
                      </div>
                    );
                  })()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}