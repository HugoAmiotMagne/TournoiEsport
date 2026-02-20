import React, { useEffect, useState } from 'react';
import { getJeux } from '../services/api';
import JeuCard from '../Components/Card/JeuCard';
import BarreRecherche from '../Components/Recherche/BarreRecherche';

export default function Jeux() {
  const [jeux,       setJeux]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    getJeux()
      .then(data => { setJeux(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, []);

  const jeuxFiltres = jeux.filter((j) =>
    j.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">Chargement des jeux…</p>
      </div>
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
          Jeux
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 font-semibold">Découvrez les jeux disponibles</p>
      </div>

      {/* Barre de recherche */}
      <BarreRecherche
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Rechercher un jeu..."
        resultCount={searchTerm ? jeuxFiltres.length : undefined}
      />

      {/* Grille */}
      <div className="w-full px-4 sm:px-8 pb-12">
        {jeuxFiltres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg sm:text-xl">
              Aucun jeu trouvé pour &quot;{searchTerm}&quot;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {jeuxFiltres.map((jeu) => (
              <JeuCard key={jeu._id} jeu={jeu} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}