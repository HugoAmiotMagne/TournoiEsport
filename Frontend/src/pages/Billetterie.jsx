import React, { useEffect, useState } from 'react';
import BilletCard from '../Components/Card/BilletCard';
import BarreRecherche from '../Components/Recherche/BarreRecherche';
import { getBillets } from '../services/api';

export default function Billetterie() {
  const [billets,  setBillets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');

  useEffect(() => {
    getBillets()
      .then(data => { setBillets(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, []);

  const billetsFiltres = billets.filter(b => {
    const q = search.toLowerCase();
    return !search
      || b.tournoi?.Name?.toLowerCase().includes(q)
      || b.salle?.nom?.toLowerCase().includes(q)
      || b.salle?.ville?.toLowerCase().includes(q);
  });

  const stats = {
    total:  billets.length,
    dispo:  billets.filter(b => b.statut === 'disponible').length,
    places: billets
      .filter(b => b.statut === 'disponible')
      .reduce((sum, b) => sum + (b.quantite ?? 0), 0),
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
          Billetterie
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 font-semibold">Réservez vos places</p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {[
            { label: 'Billets disponibles', value: stats.dispo },
            { label: 'Places restantes',    value: stats.places },
            { label: 'Total billets',        value: stats.total },
          ].map(s => (
            <div
              key={s.label}
              className="bg-white/15 backdrop-blur px-5 py-3 text-center min-w-[110px]"
              style={{
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '0',
                borderBottomLeftRadius: '1rem',
                borderBottomRightRadius: '1rem',
              }}
            >
              <p className="text-yellow-300 text-2xl font-bold">{s.value}</p>
              <p className="text-white/80 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recherche ── */}
      <BarreRecherche
        value={search}
        onChange={setSearch}
        placeholder="Rechercher par tournoi, salle, ville..."
        resultCount={search ? billetsFiltres.length : undefined}
      />

      {/* ── Grille ── */}
      <div className="w-full px-4 sm:px-8 pb-12">
        {billetsFiltres.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg sm:text-xl">
              Aucun billet trouvé{search ? ` pour « ${search} »` : ''}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {billetsFiltres.map(billet => (
              <BilletCard key={billet._id} billet={billet} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}