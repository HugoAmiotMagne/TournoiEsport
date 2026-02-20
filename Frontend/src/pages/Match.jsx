import React, { useEffect, useState } from 'react';
import { getMatchs } from '../services/api';
import BarreRecherche from '../Components/Recherche/BarreRecherche';
import MatchCard from '../Components/Card/MatchCard';

const normalizeStatus = (status) => {
  return (status || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
};

const trieStatut = { en_cours: 0, en_attente: 1, termine: 2, annule: 3 };

export default function Match() {
  const [matchs, setMatchs]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getMatchs()
      .then(data => { setMatchs(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const matchsFiltres = matchs
    .filter((match) =>
      (match.Name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const orderA = trieStatut[normalizeStatus(a.status)] ?? 99;
      const orderB = trieStatut[normalizeStatus(b.status)] ?? 99;
      return orderA - orderB;
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

      {/* Bannière */}
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

      {/* Barre de recherche */}
      <BarreRecherche
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Rechercher un match..."
        resultCount={searchTerm ? matchsFiltres.length : undefined}
      />

      {/* Grille des matchs */}
      <div className="w-full px-4 sm:px-8 pb-12">
        {matchsFiltres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg sm:text-xl">Aucun match trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {matchsFiltres.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}