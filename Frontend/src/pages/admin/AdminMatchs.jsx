import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getMatchs, adminCreateMatch, adminUpdateMatch, adminDeleteMatch,
  getTournois, searchEquipes,
} from '../../services/api';

const STATUTS = ['prévu', 'en cours', 'terminé', 'annulé'];
const EMPTY_FORM = { date_debut: '', status: 'prévu', tournoi: '', participant1: '', participant2: '' };

export default function AdminMatchs() {
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();

  const [matchs, setMatchs]       = useState([]);
  const [tournois, setTournois]   = useState([]);
  const [equipes, setEquipes]     = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editId, setEditId]       = useState(null);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);
  const [search, setSearch]       = useState('');

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    load();
  }, [isAdmin]);

  async function load() {
    const [m, t] = await Promise.all([getMatchs(), getTournois()]);
    setMatchs(m);
    setTournois(t);
  }

  async function handleSearch(e) {
    const val = e.target.value;
    setSearch(val);
    if (val.length < 2) { setEquipes([]); return; }
    try {
      const res = await searchEquipes(val);
      setEquipes(res);
    } catch { setEquipes([]); }
  }

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function startEdit(m) {
    setForm({
      date_debut: m.date_debut?.slice(0, 16) ?? '',
      status: m.status ?? 'prévu',
      tournoi: m.tournoi?._id ?? m.tournoi ?? '',
      participant1: m.participant1?._id ?? m.participant1 ?? '',
      participant2: m.participant2?._id ?? m.participant2 ?? '',
    });
    setEditId(m._id);
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editId) {
        await adminUpdateMatch(editId, form, token);
        setSuccess('Match mis à jour !');
      } else {
        await adminCreateMatch(form, token);
        setSuccess('Match créé !');
      }
      setShowForm(false);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Supprimer ce match ?')) return;
    try {
      await adminDeleteMatch(id, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#E8F5A8] px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Gestion des matchs</h1>
          <button onClick={() => navigate('/admin')} className="text-sm text-green-700 hover:underline mt-1">← Retour au dashboard</button>
        </div>
        <button onClick={startCreate} className="bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl transition">
          + Nouveau match
        </button>
      </div>

      {error   && <div className="bg-red-100 border border-red-400 text-red-700 rounded-xl px-4 py-3 mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 rounded-xl px-4 py-3 mb-4">{success}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-green-800 mb-6">{editId ? 'Modifier le match' : 'Créer un match'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date et heure</label>
              <input type="datetime-local" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.date_debut} onChange={e => setForm({...form, date_debut: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tournoi</label>
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.tournoi} onChange={e => setForm({...form, tournoi: e.target.value})} required>
                <option value="">Sélectionner un tournoi</option>
                {tournois.map(t => <option key={t._id} value={t._id}>{t.Name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher équipes</label>
              <input className="w-full border rounded-xl px-3 py-2 text-sm mb-2" placeholder="Nom de l'équipe..." value={search} onChange={handleSearch} />
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.participant1} onChange={e => setForm({...form, participant1: e.target.value})} required>
                <option value="">Équipe 1</option>
                {equipes.map(eq => <option key={eq._id} value={eq._id}>{eq.Name}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Équipe 2</label>
                <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.participant2} onChange={e => setForm({...form, participant2: e.target.value})} required>
                  <option value="">Équipe 2</option>
                  {equipes.map(eq => <option key={eq._id} value={eq._id}>{eq.Name}</option>)}
                </select>
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="submit" disabled={loading} className="bg-green-700 hover:bg-green-600 disabled:bg-green-400 text-white font-bold px-6 py-2.5 rounded-xl transition">
                {loading ? 'Enregistrement...' : editId ? 'Mettre à jour' : 'Créer'}
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
              <th className="px-4 py-3 text-left">Tournoi</th>
              <th className="px-4 py-3 text-left">Équipe 1</th>
              <th className="px-4 py-3 text-left">Équipe 2</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matchs.map((m, i) => (
              <tr key={m._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 text-gray-600">{m.tournoi?.Name || '—'}</td>
                <td className="px-4 py-3 font-medium">{m.participant1?.Name || '—'}</td>
                <td className="px-4 py-3 font-medium">{m.participant2?.Name || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{m.date_debut ? new Date(m.date_debut).toLocaleDateString('fr-FR') : '—'}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{m.status}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => startEdit(m)} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium px-3 py-1 rounded-lg transition">Modifier</button>
                  <button onClick={() => handleDelete(m._id)} className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1 rounded-lg transition">Supprimer</button>
                </td>
              </tr>
            ))}
            {matchs.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Aucun match</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
