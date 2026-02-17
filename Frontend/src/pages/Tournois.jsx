import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // ← Ajoute cet import

export default function Tournois() {
  const [tournois, setTournois] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3002/api/tournois')
      .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json();
      })
      .then(data => {
        console.log('Données reçues:', data);
        setTournois(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center py-8 text-gray-800">Chargement...</div>;
  if (error) return <div className="text-center py-8 text-red-600">Erreur : {error}</div>;

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full">
      {/* Bannière */}
      <div className="w-full bg-gradient-to-br from-green-600 to-green-700 py-16 px-8 text-center">
        <p className="text-gray-800 text-sm font-medium mb-2">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <h1 className="text-6xl font-bold text-yellow-300 italic mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Tournois
        </h1>
        <p className="text-xl text-gray-900 font-semibold">
          Fan de compétition
        </p>
      </div>

      {/* Liste des tournois */}
      <div className="w-full px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournois.map((tournoi) => (
            <Link 
              key={tournoi._id}
              to={`/tournois/${tournoi._id}`}
              className="block"
            >
              <div 
                className="bg-gradient-to-br from-green-600 to-green-700 shadow-lg p-6 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer"
                style={{ 
                  borderTopLeftRadius: '1rem',
                  borderTopRightRadius: '0',
                  borderBottomLeftRadius: '1rem',
                  borderBottomRightRadius: '1rem'
                }}
              >
                {/* En-tête */}
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold">{tournoi.Name}</h2>
                  <p className="text-green-200 text-sm">
                    {new Date(tournoi.date_debut).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                {/* Description */}
                <div 
                  className="bg-green-800 p-4 mb-4"
                  style={{ 
                    borderTopLeftRadius: '0.75rem',
                    borderTopRightRadius: '0',
                    borderBottomLeftRadius: '0.75rem',
                    borderBottomRightRadius: '0.75rem'
                  }}
                >
                  <h3 className="text-yellow-300 font-semibold mb-2">Description :</h3>
                  <p className="text-green-100 text-sm mb-3">{tournoi.description}</p>
                  <p className="text-yellow-300 font-medium">
                    {tournoi.nombre_equipes_max} équipes max
                  </p>
                </div>

                {/* Informations supplémentaires */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-200">Prix inscription:</span>
                    <span className="font-semibold">{tournoi.prix_inscription}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200">Statut:</span>
                    <span className={`font-semibold ${
                      tournoi.statut === 'en cours' ? 'text-yellow-300' : 
                      tournoi.statut === 'à venir' ? 'text-green-300' : 'text-gray-300'
                    }`}>
                      {tournoi.statut}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-200">Date fin:</span>
                    <span className="font-semibold text-xs">
                      {new Date(tournoi.date_fin).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 