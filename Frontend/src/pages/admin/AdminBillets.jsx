import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getBillets, adminCreateBillet, adminDeleteBillet,
  getSalles, getTournois,
} from '../../services/api';

const TYPES = ['Standard', 'VIP', 'PRESSE'];
const EMPTY_FORM = { type: 'Standard', prix: 0, quantite: 1, salle: '', tournoi: '' };

export default function AdminBillets() {
  const { isAdmin, token, user } = useAuth();
  const navigate = useNavigate();

  const [billets, setBillets]   = useState([]);
  const [salles, setSalles]     = useState([]);
  const [tournois, setTournois] = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    load();
  }, [isAdmin]);

  async function load() {
    const [b, s, t] = await Promise.all([getBillets(), getSalles(), getTournois()]);
    setBillets(b);
    setSalles(s);
    setTournois(t);
  }

  function startCreate() {
    setForm(EMPTY_FORM);
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await adminCreateBillet({ ...form, user: user.id }, token);
      setSuccess('Billet créé !');
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce billet ?')) return;
    try {
      await adminDeleteBillet(id, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  const statutColor = {
    disponible: 'bg-green-100 text-green-800',
    vendu:      'bg-blue-100 text-blue-800',
    utilisé:   'bg-gray-100 text-gray-700',
    annulé:    'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-[#E8F5A8] px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Gestion des billets</h1>
          <button onClick={() => navigate('/admin')} className="text-sm text-green-700 hover:underline mt-1">← Retour au dashboard</button>
        </div>
        <button onClick={startCreate} className="bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl transition">
          + Nouveau billet
        </button>
      </div>

      {error   && <div className="bg-red-100 border border-red-400 text-red-700 rounded-xl px-4 py-3 mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 rounded-xl px-4 py-3 mb-4">{success}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-green-800 mb-6">Créer un billet</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
              <input type="number" min="0" step="0.01" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.prix} onChange={e => setForm({...form, prix: Number(e.target.value)})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
              <input type="number" min="1" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.quantite} onChange={e => setForm({...form, quantite: Number(e.target.value)})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salle</label>
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.salle} onChange={e => setForm({...form, salle: e.target.value})} required>
                <option value="">Sélectionner une salle</option>
                {salles.map(s => <option key={s._id} value={s._id}>{s.Name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tournoi (optionnel)</label>
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.tournoi} onChange={e => setForm({...form, tournoi: e.target.value})}>
                <option value="">Aucun tournoi</option>
                {tournois.map(t => <option key={t._id} value={t._id}>{t.Name}</option>)}
              </select>
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-bold px-6 py-2.5 rounded-xl transition">
                {loading ? 'Création...' : 'Créer le billet'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-xl transition">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Prix</th>
              <th className="px-4 py-3 text-left">Quantité</th>
              <th className="px-4 py-3 text-left">Salle</th>
              <th className="px-4 py-3 text-left">Tournoi</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {billets.map((b, i) => (
              <tr key={b._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium">{b.type}</td>
                <td className="px-4 py-3 text-gray-600">{b.prix} €</td>
                <td className="px-4 py-3 text-gray-600">{b.quantite}</td>
                <td className="px-4 py-3 text-gray-600">{b.salle?.Name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{b.tournoi?.Name || '—'}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statutColor[b.statut] || ''}`}>{b.statut}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(b._id)} className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1 rounded-lg transition">Supprimer</button>
                </td>
              </tr>
            ))}
            {billets.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">Aucun billet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
