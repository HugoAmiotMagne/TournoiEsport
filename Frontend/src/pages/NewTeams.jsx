import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getJeux, getMesEquipes } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function NewTeams() {
  const navigate  = useNavigate();
  const { token, isLoggedIn, user } = useAuth();

  const [jeux,         setJeux]         = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState(null);
  const [success,      setSuccess]      = useState(false);
  const [logoPreview,  setLogoPreview]  = useState(null);
  const [monEquipe,    setMonEquipe]    = useState(null);
  const [checkingTeam, setCheckingTeam] = useState(true);

  const [form, setForm] = useState({
    Name:          '',
    description:   '',
    jeu_principal: '',
    logo:          null,
  });

  useEffect(() => {
    getJeux().then(setJeux).catch(() => setJeux([]));
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) { setCheckingTeam(false); return; }
    getMesEquipes(user.id)
      .then(memberships => {
        if (memberships.length > 0) setMonEquipe(memberships[0]);
      })
      .catch(() => {})
      .finally(() => setCheckingTeam(false));
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center px-4">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-8 text-center max-w-sm w-full shadow-xl">
          <p className="text-green-100 mb-4">Tu dois être connecté pour créer une équipe.</p>
          <Link to="/login" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-6 py-3 rounded-xl transition-all">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  if (checkingTeam) {
    return (
      <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 font-medium">Chargement…</p>
        </div>
      </div>
    );
  }

  if (monEquipe) {
    return (
      <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center px-4">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-8 text-center max-w-sm w-full shadow-xl text-white">
          <svg className="w-12 h-12 text-yellow-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-yellow-300 font-bold text-xl mb-2">Tu es déjà dans une équipe</p>
          <p className="text-green-200 text-sm mb-6">
            Tu es membre de <span className="font-bold text-white">{monEquipe.equipe?.Name}</span>. Quitte cette équipe avant d'en créer une nouvelle.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to={`/teams/${monEquipe.equipe?._id}`}
              className="inline-block bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold px-6 py-3 rounded-xl transition-all"
            >
              Voir mon équipe
            </Link>
            <Link
              to="/teams"
              className="inline-block bg-green-800 hover:bg-green-900 text-green-100 font-bold px-6 py-3 rounded-xl transition-all"
            >
              Toutes les équipes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      setError('Format non supporté (jpeg, png, gif, webp)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Le logo ne doit pas dépasser 2 Mo');
      return;
    }
    setError(null);
    setLogoPreview(URL.createObjectURL(file));
    setForm(prev => ({ ...prev, logo: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.Name.trim()) { setError("Le nom de l'équipe est requis"); return; }
    setLoading(true);
    setError(null);
    try {
      const data = new FormData();
      data.append('Name', form.Name.trim());
      if (form.description)   data.append('description',   form.description.trim());
      if (form.jeu_principal) data.append('jeu_principal', form.jeu_principal);
      if (form.logo)          data.append('logo',          form.logo);

      const res = await fetch('http://localhost:3002/api/equipes/new', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Erreur lors de la création');
      setSuccess(true);
      setTimeout(() => navigate(`/teams/${result._id}`), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full">

      {/* Bannière */}
      <div className="w-full bg-gradient-to-br from-green-600 to-green-700 py-12 sm:py-16 px-4 text-center">
        <h1
          className="text-5xl sm:text-6xl font-bold text-yellow-300 italic mb-3"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Nouvelle Équipe
        </h1>
        <p className="text-green-200 text-lg">Crée ton équipe et recrute des joueurs</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">

        {success ? (
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-10 text-center shadow-xl">
            <div className="w-16 h-16 bg-green-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-yellow-300 font-bold text-2xl mb-2">Équipe créée !</p>
            <p className="text-green-200 text-sm">Redirection en cours…</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-8 shadow-xl text-white">

            {error && (
              <div className="bg-red-900/40 border border-red-500 text-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">

              {/* Logo */}
              <div>
                <label className="block text-green-100 text-sm font-medium mb-3">Logo de l'équipe</label>
                {logoPreview ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={logoPreview}
                      alt="Aperçu"
                      className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={() => { setLogoPreview(null); setForm(prev => ({ ...prev, logo: null })); }}
                      className="text-red-300 hover:text-red-200 text-sm font-medium transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center gap-3 cursor-pointer bg-green-800 border-2 border-dashed border-green-500 hover:border-yellow-400 rounded-xl px-4 py-4 transition-colors">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-green-300 text-sm">Choisir un logo (jpeg, png — max 2 Mo)</span>
                    <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block text-green-100 text-sm font-medium mb-1.5">
                  Nom de l'équipe <span className="text-red-300">*</span>
                </label>
                <input
                  type="text"
                  name="Name"
                  value={form.Name}
                  onChange={handleChange}
                  required
                  placeholder="Les Destroyers"
                  className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-green-100 text-sm font-medium mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Présentez votre équipe…"
                  className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors resize-none"
                />
              </div>

              {/* Jeu principal */}
              <div>
                <label className="block text-green-100 text-sm font-medium mb-1.5">Jeu principal</label>
                <select
                  name="jeu_principal"
                  value={form.jeu_principal}
                  onChange={handleChange}
                  className="w-full bg-green-800 text-white rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
                >
                  <option value="">— Sélectionner un jeu —</option>
                  {jeux.map(jeu => (
                    <option key={jeu._id} value={jeu._id}>{jeu.Name}</option>
                  ))}
                </select>
              </div>

              {/* Boutons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-600 text-green-900 font-bold py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:scale-100"
                >
                  {loading ? 'Création en cours…' : "Créer l'équipe"}
                </button>
                <Link
                  to="/teams"
                  className="flex-1 text-center bg-green-800 hover:bg-green-900 text-green-100 font-bold py-3 rounded-xl transition-all duration-200"
                >
                  Annuler
                </Link>
              </div>

            </form>
          </div>
        )}
      </div>
    </div>
  );
}
