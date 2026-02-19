import React, { useEffect, useState } from 'react';
import { searchEquipes } from '../services/api';
import BarreRecherche from '../Components/Recherche/BarreRecherche';
import TeamCard from '../Components/Card/TeamCard';
import Bouton from '../Components/UI/Bouton';

export default function Teams() {
  const [equipes, setEquipes]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    searchEquipes('')
      .then(data => { setEquipes(data); setLoading(false); })
  }, []);

  const equipesFiltrees = equipes.filter((equipe) =>
    equipe.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Affichage chargement
  if (loading) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <p className="text-gray-800 text-xl font-semibold">Chargement...</p>
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
          Équipes
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 font-semibold">
          Découvrez les équipes en compétition
        </p>
      </div>

      {/* Recherche + bouton */}
      <div className="w-full px-4 sm:px-8 py-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1">
            <BarreRecherche
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Rechercher par nom..."
              resultCount={searchTerm ? equipesFiltrees.length : undefined}
            />
          </div>
          <Bouton to="/teams/new">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Créer une équipe
          </Bouton>
        </div>
      </div>

      {/* Grille des équipes */}
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
              <TeamCard key={equipe._id} equipe={equipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}