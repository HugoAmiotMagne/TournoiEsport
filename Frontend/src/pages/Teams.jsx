import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchEquipes } from '../services/api';

export default function Teams() {
  const [equipes, setEquipes]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Chargement initial
  useEffect(() => {
    searchEquipes('')
      .then(data => {
        setEquipes(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filtrage côté client
  const equipesFiltrees = equipes.filter((equipe) => {
    const term = searchTerm.toLowerCase();
    return (
      equipe.Name?.toLowerCase().includes(term) ||
      equipe.description?.toLowerCase().includes(term) ||
      equipe.jeu_principal?.nom?.toLowerCase().includes(term)
    );
  });

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
          Équipes
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 font-semibold">
          Découvrez les équipes en compétition
        </p>
      </div>

      {/* ── Barre de recherche + bouton créer ── */}
      <div className="w-full px-4 sm:px-8 py-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">

          {/* Recherche */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Rechercher par nom, description ou jeu..."
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

          {/* Bouton créer une équipe */}
          <Link
            to="/teams/new"
            className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800
                       text-white font-bold text-sm sm:text-base px-6 py-3 sm:py-4 rounded-2xl
                       shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                       whitespace-nowrap border-2 border-green-700 hover:border-green-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 4v16m8-8H4" />
            </svg>
            Créer une équipe
          </Link>

        </div>

        {searchTerm && (
          <p className="text-center mt-3 text-gray-700 font-medium text-sm sm:text-base">
            {equipesFiltrees.length} équipe{equipesFiltrees.length !== 1 ? 's' : ''} trouvée{equipesFiltrees.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* ── Grille des équipes ── */}
      <div className="w-full px-4 sm:px-8 pb-12">
        {equipesFiltrees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg sm:text-xl">
              Aucune équipe trouvée{searchTerm ? ` pour "${searchTerm}"` : ''}.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {equipesFiltrees.map((equipe) => (
              <Link
                key={equipe._id}
                to={`/equipes/${equipe._id}`}
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
                  {/* En-tête : logo + nom */}
                  <div className="flex items-center gap-4 mb-5">
                    {equipe.logo ? (
                      <img
                        src={equipe.logo}
                        alt={`Logo ${equipe.Name}`}
                        className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-yellow-400"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-green-800 border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-300 font-black text-xl">
                          {equipe.Name?.[0]?.toUpperCase() ?? '?'}
                        </span>
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold leading-tight">{equipe.Name}</h2>
                      <p className="text-green-200 text-xs mt-0.5">
                        Créée le {new Date(equipe.date_creation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
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
                    {equipe.description ? (
                      <>
                        <h3 className="text-yellow-300 font-semibold mb-2 text-sm sm:text-base">Description :</h3>
                        <p className="text-green-100 text-sm leading-relaxed line-clamp-3">
                          {equipe.description}
                        </p>
                      </>
                    ) : (
                      <p className="text-green-400 text-sm italic">Aucune description.</p>
                    )}
                  </div>

                  {/* Infos bas de carte */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Capitaine */}
                    <div className="bg-green-700 p-3 rounded-xl">
                      <p className="text-green-200 text-xs mb-1">Capitaine</p>
                      <p className="text-sm font-semibold leading-tight truncate">
                        {equipe.capitaine?.username ?? equipe.capitaine?.email ?? '—'}
                      </p>
                    </div>

                    {/* Membres */}
                    <div className="bg-green-700 p-3 rounded-xl">
                      <p className="text-green-200 text-xs mb-1">Membres</p>
                      <p className="text-lg font-bold">
                        {equipe.membres?.length ?? 0}
                        <span className="text-green-300 text-xs font-normal ml-1">joueur{equipe.membres?.length > 1 ? 's' : ''}</span>
                      </p>
                    </div>

                    {/* Jeu principal — pleine largeur si présent */}
                    {equipe.jeu_principal && (
                      <div className="col-span-2 bg-green-700 p-3 rounded-xl flex items-center gap-2">
                        <span className="text-yellow-300 text-sm">🎮</span>
                        <div>
                          <p className="text-green-200 text-xs">Jeu principal</p>
                          <p className="text-sm font-semibold">{equipe.jeu_principal.nom ?? equipe.jeu_principal.Name ?? '—'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}