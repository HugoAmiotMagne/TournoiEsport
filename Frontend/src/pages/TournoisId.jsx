import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function TournoiId() {
  const { id } = useParams();
  const [tournoi, setTournoi] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3002/api/tournois/${id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Tournoi introuvable');
        }
        return res.json();
      })
      .then(data => setTournoi(data))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  if (!tournoi) {
    return (
      <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
        <p className="text-gray-800 text-xl">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full py-12 px-8">
      <div 
        className="max-w-4xl mx-auto bg-gradient-to-br from-green-600 to-green-700 shadow-2xl p-8 text-white"
        style={{ 
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '0',
          borderBottomLeftRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem'
        }}
      >
        {/* Titre */}
        <h1 className="text-4xl font-bold text-center mb-2">{tournoi.Name}</h1>

        {/* Dates */}
        <p className="text-center text-green-200 mb-6">
          {new Date(tournoi.date_debut).toLocaleDateString('fr-FR')} — {new Date(tournoi.date_fin).toLocaleDateString('fr-FR')}
        </p>

        {/* Description */}
        <div 
          className="bg-green-800 p-6 mb-6"
          style={{ 
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '0',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem'
          }}
        >
          <h3 className="text-yellow-300 font-semibold text-xl mb-3">Description :</h3>
          <p className="text-green-100 mb-4">{tournoi.description}</p>
          <p className="text-yellow-300 font-medium text-lg">
            {tournoi.nombre_equipes_max} équipes maximum
          </p>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-700 p-4 rounded-lg">
            <p className="text-green-200 text-sm">Prix d'inscription</p>
            <p className="text-2xl font-bold">{tournoi.prix_inscription}€</p>
          </div>
          <div className="bg-green-700 p-4 rounded-lg">
            <p className="text-green-200 text-sm">Statut</p>
            <p className={`text-2xl font-bold ${
              tournoi.statut === 'en cours' ? 'text-yellow-300' : 
              tournoi.statut === 'à venir' ? 'text-green-300' : 'text-gray-300'
            }`}>
              {tournoi.statut}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}