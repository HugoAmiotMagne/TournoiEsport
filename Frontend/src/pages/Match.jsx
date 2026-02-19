import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMatchs } from '../services/api';

// ── Helpers ──
// Normaliser les statuts pour la comparaison
const normalizeStatus = (status) => {
  return (status || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlever les accents
    .replace(/\s+/g, '_'); // Remplacer les espaces par des underscores
};

const statusLabel = {
  en_attente: 'En attente',
  en_cours:   'En cours',
  termine:    'Terminé',
  annule:     'Annulé',
};

const statusColor = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'en_cours')   return 'text-yellow-300';
  if (normalized === 'en_attente') return 'text-green-300';
  if (normalized === 'termine')    return 'text-gray-300';
  if (normalized === 'annule')     return 'text-red-400';
  return 'text-gray-300';
};

const statusBadgeBg = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'en_cours')   return 'bg-yellow-400/20 border border-yellow-400 text-yellow-300';
  if (normalized === 'en_attente') return 'bg-green-400/20 border border-green-400 text-green-300';
  if (normalized === 'termine')    return 'bg-gray-400/20 border border-gray-400 text-gray-300';
  if (normalized === 'annule')     return 'bg-red-400/20 border border-red-400 text-red-400';
  return '';
};

export default function Match() {
  const [matchs, setMatchs]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('tous');

  useEffect(() => {
    getMatchs()
      .then(data => {
        setMatchs(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const matchsFiltres = matchs.filter((match) => {
    const equipe1 = match.participant1?.nom?.toLowerCase() ?? '';
    const equipe2 = match.participant2?.nom?.toLowerCase() ?? '';
    const tournoi = match.tournoi?.Name?.toLowerCase() ?? '';
    const term    = searchTerm.toLowerCase();

    const matchesSearch =
      equipe1.includes(term) ||
      equipe2.includes(term) ||
      tournoi.includes(term) ||
      statusLabel[normalizeStatus(match.status)]?.toLowerCase().includes(term);

    const matchesStatus =
      filterStatus === 'tous' || normalizeStatus(match.status) === filterStatus;

    return matchesSearch && matchesStatus;
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
          Matchs
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 font-semibold">
          Suivez les affrontements en direct
        </p>
      </div>

      {/* ── Recherche + Filtres ── */}
      <div className="w-full px-4 sm:px-8 py-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">

          {/* Barre de recherche */}
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une équipe, un tournoi..."
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

          {/* Filtres statut */}
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: 'tous',       label: 'Tous' },
              { key: 'en_attente', label: 'En attente' },
              { key: 'en_cours',   label: 'En cours' },
              { key: 'termine',    label: 'Terminés' },
              { key: 'annule',     label: 'Annulés' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                className={`px-4 py-1.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 ${
                  filterStatus === key
                    ? 'bg-green-700 border-green-700 text-white shadow'
                    : 'bg-white border-green-600 text-green-700 hover:bg-green-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Compteur */}
          {(searchTerm || filterStatus !== 'tous') && (
            <p className="text-center text-gray-700 font-medium text-sm sm:text-base">
              {matchsFiltres.length} match{matchsFiltres.length !== 1 ? 's' : ''} trouvé{matchsFiltres.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

      {/* ── Grille des matchs ── */}
      <div className="w-full px-4 sm:px-8 pb-12">
        {matchsFiltres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg sm:text-xl">
              Aucun match trouvé.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {matchsFiltres.map((match) => (
              <Link
                key={match._id}
                to={`/matchs/${match._id}`}
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
                  {/* Badge statut */}
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusBadgeBg(match.status)}`}>
                      {statusLabel[normalizeStatus(match.status)] ?? match.status}
                    </span>
                    <span className="text-green-200 text-xs">
                      📅 {new Date(match.date_debut).toLocaleDateString('fr-FR', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                  </div>

                  {/* Affrontement */}
                  <div
                    className="bg-green-800 p-4 sm:p-5 mb-5 flex-1"
                    style={{
                      borderTopLeftRadius: '1rem',
                      borderTopRightRadius: '0',
                      borderBottomLeftRadius: '1rem',
                      borderBottomRightRadius: '1rem',
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      {/* Équipe 1 */}
                      <div className="flex-1 text-center">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
                          {match.participant1?.nom?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <p className="font-bold text-sm sm:text-base leading-tight">
                          {match.participant1?.nom ?? 'Équipe 1'}
                        </p>
                      </div>

                      {/* VS */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <span className="text-yellow-300 font-black text-xl sm:text-2xl">VS</span>
                        {match.status === 'termine' && match.score && (
                          <span className="text-white font-bold text-sm mt-1">
                            {match.score}
                          </span>
                        )}
                      </div>

                      {/* Équipe 2 */}
                      <div className="flex-1 text-center">
                        <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
                          {match.participant2?.nom?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <p className="font-bold text-sm sm:text-base leading-tight">
                          {match.participant2?.nom ?? 'Équipe 2'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Infos bas */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-700 p-3 rounded-xl">
                      <p className="text-green-200 text-xs mb-1">Tournoi</p>
                      <p className="text-sm font-semibold leading-tight line-clamp-1">
                        {match.tournoi?.Name ?? '—'}
                      </p>
                    </div>
                    <div className="bg-green-700 p-3 rounded-xl">
                      <p className="text-green-200 text-xs mb-1">Parties</p>
                      <p className="text-lg font-bold">
                        {match.parties?.length ?? 0}
                        <span className="text-green-300 text-xs font-normal ml-1">joué{match.parties?.length > 1 ? 'es' : 'e'}</span>
                      </p>
                    </div>
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