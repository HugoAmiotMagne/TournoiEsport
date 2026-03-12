import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getJeux, adminCreateJeu, adminUpdateJeu, adminDeleteJeu } from '../../services/api';

const PLATEFORMES = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];
const EMPTY_FORM = {
  Name: '', Mode: '', Map: '', plateforme: 'PC',
  min_joueur: 1, max_joueur: 10, image: '',
};

export default function AdminJeux() {
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();

  const [jeux, setJeux]         = useState([]);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [editId, setEditId]     = useState(null);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    load();
  }, [isAdmin]);

  async function load() {
    const data = await getJeux();
    setJeux(data);
  }

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function startEdit(j) {
    setForm({
      Name:        j.Name        ?? '',
      Mode:        j.Mode        ?? '',
      Map:         j.Map         ?? '',
      plateforme:  j.plateforme  ?? 'PC',
      min_joueur:  j.min_joueur  ?? 1,
      max_joueur:  j.max_joueur  ?? 10,
      image:       j.image       ?? '',
    });
    setEditId(j._id);
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
        await adminUpdateJeu(editId, form, token);
        setSuccess('Jeu mis à jour !');
      } else {
        await adminCreateJeu(form, token);
        setSuccess('Jeu créé !');
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
    if (!confirm('Supprimer ce jeu ?')) return;
    try {
      await adminDeleteJeu(id, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#E8F5A8] px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Gestion des jeux</h1>
          <button onClick={() => navigate('/admin')} className="text-sm text-green-700 hover:underline mt-1">← Retour au dashboard</button>
        </div>
        <button
          onClick={startCreate}
          className="bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl transition"
        >
          + Nouveau jeu
        </button>
      </div>

      {error   && <div className="bg-red-100 border border-red-400 text-red-700 rounded-xl px-4 py-3 mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 rounded-xl px-4 py-3 mb-4">{success}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-green-800 mb-6">{editId ? 'Modifier le jeu' : 'Créer un jeu'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input className="w-full border rounded-xl px-3 py-2 text-sm" value={form.Name} onChange={e => setForm({...form, Name: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode de jeu</label>
              <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="ex: 5v5, Battle Royale…" value={form.Mode} onChange={e => setForm({...form, Mode: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Map / Arène</label>
              <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="ex: Dust2, Summoner's Rift…" value={form.Map} onChange={e => setForm({...form, Map: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plateforme</label>
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.plateforme} onChange={e => setForm({...form, plateforme: e.target.value})} required>
                {PLATEFORMES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joueurs min</label>
              <input type="number" min="1" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.min_joueur} onChange={e => setForm({...form, min_joueur: Number(e.target.value)})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joueurs max</label>
              <input type="number" min="1" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.max_joueur} onChange={e => setForm({...form, max_joueur: Number(e.target.value)})} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image (URL, optionnel)</label>
              <input className="w-full border rounded-xl px-3 py-2 text-sm" placeholder="https://..." value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
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
              <th className="px-4 py-3 text-left">Nom</th>
              <th className="px-4 py-3 text-left">Mode</th>
              <th className="px-4 py-3 text-left">Map</th>
              <th className="px-4 py-3 text-left">Plateforme</th>
              <th className="px-4 py-3 text-left">Joueurs</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jeux.map((j, i) => (
              <tr key={j._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium flex items-center gap-2">
                  {j.image && <img src={j.image.startsWith('/') ? `http://localhost:3002${j.image}` : j.image} alt={j.Name} className="w-8 h-8 rounded object-cover" />}
                  {j.Name}
                </td>
                <td className="px-4 py-3 text-gray-600">{j.Mode}</td>
                <td className="px-4 py-3 text-gray-600">{j.Map}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">{j.plateforme}</span>
                </td>
                <td className="px-4 py-3 text-gray-600">{j.min_joueur} – {j.max_joueur}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => startEdit(j)} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium px-3 py-1 rounded-lg transition">Modifier</button>
                  <button onClick={() => handleDelete(j._id)} className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1 rounded-lg transition">Supprimer</button>
                </td>
              </tr>
            ))}
            {jeux.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Aucun jeu</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
