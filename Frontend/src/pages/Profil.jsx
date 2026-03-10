import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://localhost:3002/api';

export default function Profil() {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    prenom: user?.prenom || '',
    nom: user?.nom || '',
    email: user?.email || '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id || user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la mise à jour');
      login({ ...user, ...form }, token);
      setMessage('Profil mis à jour avec succès !');
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/${user.id || user._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Erreur lors de la suppression');
      logout();
      navigate('/');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg flex flex-col gap-6">

        {/* Carte infos */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-yellow-300 text-center mb-6">Mon Profil</h1>

          {message && (
            <div className="bg-green-900/40 border border-green-400 text-green-200 rounded-xl px-4 py-3 mb-6 text-sm text-center">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-center">
              {error}
            </div>
          )}

          {!editMode ? (
            /* Mode affichage */
            <div className="flex flex-col gap-4">
              <InfoRow label="Prénom" value={user.prenom} />
              <InfoRow label="Nom" value={user.nom} />
              <InfoRow label="Email" value={user.email} />

              <button
                onClick={() => setEditMode(true)}
                className="mt-4 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Modifier mes informations
              </button>
            </div>
          ) : (
            /* Mode édition */
            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-green-100 text-sm font-medium mb-1.5">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={form.prenom}
                    onChange={handleChange}
                    required
                    className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-green-100 text-sm font-medium mb-1.5">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={form.nom}
                    onChange={handleChange}
                    required
                    className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-green-100 text-sm font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-600 text-green-900 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed"
                >
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </button>
                <button
                  type="button"
                  onClick={() => { setEditMode(false); setError(''); }}
                  className="flex-1 bg-green-800 hover:bg-green-900 text-green-100 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Zone suppression */}
        <div className="bg-red-900/20 border border-red-400 rounded-2xl p-6">
          <h2 className="text-red-700 font-bold text-lg mb-2">Zone dangereuse</h2>
          <p className="text-red-600 text-sm mb-4">
            La suppression de votre compte est définitive et irréversible.
          </p>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200"
            >
              Supprimer mon compte
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-red-700 font-semibold text-sm">Êtes-vous sûr ? Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200"
                >
                  {loading ? 'Suppression...' : 'Oui, supprimer'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-green-300 text-xs font-medium uppercase tracking-wider">{label}</span>
      <span className="text-white font-semibold text-base">{value || '—'}</span>
    </div>
  );
}
