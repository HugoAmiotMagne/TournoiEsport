import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getTournois, adminCreateTournoi, adminUpdateTournoi, adminDeleteTournoi,
  getJeux, getSalles,
} from '../../services/api';

const EMPTY_FORM = {
  Name: '', description: '', date_debut: '', date_fin: '',
  jeu: '', salle: '', prix_inscription: 0, nombre_equipes_max: 16, statut: 'à venir',
};

export default function AdminTournois() {
  const { isAdmin, token } = useAuth();
  const navigate = useNavigate();

  const [tournois, setTournois]   = useState([]);
  const [jeux, setJeux]           = useState([]);
  const [salles, setSalles]       = useState([]);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [editId, setEditId]       = useState(null);
  const [error, setError]         = useState('');
  const [success, setSuccess]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [showForm, setShowForm]   = useState(false);

  useEffect(() => {
    if (!isAdmin) { navigate('/'); return; }
    load();
  }, [isAdmin]);

  async function load() {
    const [t, j, s] = await Promise.all([getTournois(), getJeux(), getSalles()]);
    setTournois(t);
    setJeux(j);
    setSalles(s);
  }

  function startCreate() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setError('');
    setSuccess('');
    setShowForm(true);
  }

  function startEdit(t) {
    setForm({
      Name: t.Name,
      description: t.description,
      date_debut: t.date_debut?.slice(0, 10) ?? '',
      date_fin: t.date_fin?.slice(0, 10) ?? '',
      jeu: t.jeu?._id ?? t.jeu ?? '',
      salle: t.salle?._id ?? t.salle ?? '',
      prix_inscription: t.prix_inscription ?? 0,
      nombre_equipes_max: t.nombre_equipes_max ?? 16,
      statut: t.statut ?? 'à venir',
    });
    setEditId(t._id);
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
        await adminUpdateTournoi(editId, form, token);
        setSuccess('Tournoi mis à jour !');
      } else {
        await adminCreateTournoi(form, token);
        setSuccess('Tournoi créé !');
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
    if (!confirm('Supprimer ce tournoi ?')) return;
    try {
      await adminDeleteTournoi(id, token);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#E8F5A8] px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Gestion des tournois</h1>
          <button onClick={() => navigate('/admin')} className="text-sm text-green-700 hover:underline mt-1">← Retour au dashboard</button>
        </div>
        <button
          onClick={startCreate}
          className="bg-green-700 hover:bg-green-600 text-white font-bold px-5 py-2.5 rounded-xl transition"
        >
          + Nouveau tournoi
        </button>
      </div>

      {error   && <div className="bg-red-100 border border-red-400 text-red-700 rounded-xl px-4 py-3 mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 rounded-xl px-4 py-3 mb-4">{success}</div>}

      {showForm && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-xl font-bold text-green-800 mb-6">{editId ? 'Modifier le tournoi' : 'Créer un tournoi'}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input className="w-full border rounded-xl px-3 py-2 text-sm" value={form.Name} onChange={e => setForm({...form, Name: e.target.value})} required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="w-full border rounded-xl px-3 py-2 text-sm" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input type="date" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.date_debut} onChange={e => setForm({...form, date_debut: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input type="date" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.date_fin} onChange={e => setForm({...form, date_fin: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jeu</label>
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.jeu} onChange={e => setForm({...form, jeu: e.target.value})} required>
                <option value="">Sélectionner un jeu</option>
                {jeux.map(j => <option key={j._id} value={j._id}>{j.Name || j.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salle (optionnel)</label>
              <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.salle} onChange={e => setForm({...form, salle: e.target.value})}>
                <option value="">Aucune salle</option>
                {salles.map(s => <option key={s._id} value={s._id}>{s.Name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix d'inscription (€)</label>
              <input type="number" min="0" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.prix_inscription} onChange={e => setForm({...form, prix_inscription: Number(e.target.value)})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Équipes max</label>
              <input type="number" min="2" className="w-full border rounded-xl px-3 py-2 text-sm" value={form.nombre_equipes_max} onChange={e => setForm({...form, nombre_equipes_max: Number(e.target.value)})} />
            </div>
            {editId && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select className="w-full border rounded-xl px-3 py-2 text-sm" value={form.statut} onChange={e => setForm({...form, statut: e.target.value})}>
                  {['à venir','en cours','terminé','annulé'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
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
              <th className="px-4 py-3 text-left">Jeu</th>
              <th className="px-4 py-3 text-left">Début</th>
              <th className="px-4 py-3 text-left">Statut</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournois.map((t, i) => (
              <tr key={t._id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium">{t.Name}</td>
                <td className="px-4 py-3 text-gray-600">{t.jeu?.Name || t.jeu?.nom || '—'}</td>
                <td className="px-4 py-3 text-gray-600">{t.date_debut ? new Date(t.date_debut).toLocaleDateString('fr-FR') : '—'}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">{t.statut}</span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => startEdit(t)} className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-medium px-3 py-1 rounded-lg transition">Modifier</button>
                  <button onClick={() => handleDelete(t._id)} className="bg-red-100 hover:bg-red-200 text-red-700 text-xs font-medium px-3 py-1 rounded-lg transition">Supprimer</button>
                </td>
              </tr>
            ))}
            {tournois.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">Aucun tournoi</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
