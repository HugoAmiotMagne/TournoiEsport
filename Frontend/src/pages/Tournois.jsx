import React, { useEffect, useState } from 'react';
import { getTournois } from '../services/api';
import TournoiCard from '../Components/Card/TournoiCard';
import BarreRecherche from '../Components/Recherche/BarreRecherche';

const STATUT_ORDER = { 'en cours': 0, 'à venir': 1, 'terminé': 2, 'annulé': 3 };

export default function Tournois() {
  const [tournois, setTournois] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getTournois()
      .then(data => { setTournois(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const tournoisFiltres = tournois
    .filter((t) => t.Name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (STATUT_ORDER[a.statut] ?? 99) - (STATUT_ORDER[b.statut] ?? 99));

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
        <h1 className="text-5xl sm:text-6xl font-bold text-yellow-300 italic mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Tournois
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 font-semibold">Fan de compétition</p>
      </div>

      {/* Barre de recherche */}
      <BarreRecherche
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Rechercher un tournoi..."
        resultCount={searchTerm ? tournoisFiltres.length : undefined}
      />

      {/* Grille */}
      <div className="w-full px-4 sm:px-8 pb-12">
        {tournoisFiltres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg sm:text-xl">Aucun tournoi trouvé pour &quot;{searchTerm}&quot;</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {tournoisFiltres.map((tournoi) => (
              <TournoiCard key={tournoi._id} tournoi={tournoi} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}