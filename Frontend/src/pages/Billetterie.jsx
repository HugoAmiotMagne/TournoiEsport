import React, { useEffect, useState } from 'react';
import BilletCard from '../Components/Card/BilletCard';
import BarreRecherche from '../Components/Recherche/BarreRecherche';
import { getBillets, adminUpdateBillet, getSalles, getTournois } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TYPES = ['Standard', 'VIP', 'PRESSE'];
const STATUTS = ['disponible', 'vendu', 'utilisé', 'annulé'];

export default function Billetterie() {
  const { isAdmin, token } = useAuth();
  const [billets,  setBillets]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [search,   setSearch]   = useState('');

  // Edition admin
  const [editBillet,  setEditBillet]  = useState(null);
  const [editForm,    setEditForm]    = useState({});
  const [salles,      setSalles]      = useState([]);
  const [tournois,    setTournois]    = useState([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError,   setEditError]   = useState('');

  useEffect(() => {
    getBillets()
      .then(data => { setBillets(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });

    if (isAdmin) {
      getSalles().then(setSalles).catch(() => {});
      getTournois().then(setTournois).catch(() => {});
    }
  }, [isAdmin]);

  function handleOpenEdit(billet) {
    setEditBillet(billet);
    setEditForm({
      type:           billet.type,
      prix:           billet.prix,
      quantite:       billet.quantite,
      statut:         billet.statut,
      salle:          billet.salle?._id ?? billet.salle ?? '',
      tournoi:        billet.tournoi?._id ?? billet.tournoi ?? '',
      date_evenement: billet.date_evenement?.slice(0, 10) ?? '',
    });
    setEditError('');
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      await adminUpdateBillet(editBillet._id, editForm, token);
      const data = await getBillets();
      setBillets(data);
      setEditBillet(null);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  }

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
              <BilletCard
                key={billet._id}
                billet={billet}
                onEdit={isAdmin ? handleOpenEdit : undefined}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal édition admin ── */}
      {editBillet && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4"
          onClick={e => { if (e.target === e.currentTarget) setEditBillet(null); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <h2 className="text-xl font-bold text-green-800 mb-6">Modifier le billet</h2>

            {editError && (
              <div className="bg-red-100 border border-red-400 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
                {editError}
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={editForm.type}
                  onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                >
                  {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={editForm.statut}
                  onChange={e => setEditForm({ ...editForm, statut: e.target.value })}
                >
                  {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                <input
                  type="number" min="0" step="0.01"
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={editForm.prix}
                  onChange={e => setEditForm({ ...editForm, prix: Number(e.target.value) })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                <input
                  type="number" min="1"
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={editForm.quantite}
                  onChange={e => setEditForm({ ...editForm, quantite: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
                <select
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={editForm.salle}
                  onChange={e => setEditForm({ ...editForm, salle: e.target.value })}
                >
                  <option value="">Sélectionner une salle</option>
                  {salles.map(s => (
                    <option key={s._id} value={s._id}>{s.nom || s.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tournoi (optionnel)</label>
                <select
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={editForm.tournoi}
                  onChange={e => setEditForm({ ...editForm, tournoi: e.target.value })}
                >
                  <option value="">Aucun tournoi</option>
                  {tournois.map(t => (
                    <option key={t._id} value={t._id}>{t.Name}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'événement</label>
                <input
                  type="date"
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                  value={editForm.date_evenement}
                  onChange={e => setEditForm({ ...editForm, date_evenement: e.target.value })}
                />
              </div>

              <div className="col-span-2 flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={editLoading}
                  className="bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-bold px-6 py-2.5 rounded-xl transition flex-1"
                >
                  {editLoading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditBillet(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
