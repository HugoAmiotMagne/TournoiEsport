import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getJeux } from '../services/api';

// Convertit un fichier image en Base64
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default function NewTeams() {
  const navigate = useNavigate();

  const [jeux, setJeux]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const [form, setForm] = useState({
    Name:          '',
    description:   '',
    jeu_principal: '',
    logo:          '',
  });

  // Chargement de la liste des jeux
  useEffect(() => {
    getJeux()
      .then(setJeux)
      .catch(() => setJeux([]));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Vérification type
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Format non supporté. Utilise jpeg, png, gif ou webp.');
      return;
    }

    // Vérification taille (2 Mo max)
    if (file.size > 2 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 2 Mo.');
      return;
    }

    setError(null);
    const base64 = await toBase64(file);
    setLogoPreview(base64);
    setForm((prev) => ({ ...prev, logo: base64 }));
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setForm((prev) => ({ ...prev, logo: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.Name.trim()) {
      setError('Le nom de l\'équipe est requis.');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3002/api/equipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          Name:          form.Name.trim(),
          description:   form.description.trim(),
          jeu_principal: form.jeu_principal || undefined,
          logo:          form.logo || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Erreur lors de la création');

      setSuccess(true);
      setTimeout(() => navigate(`/equipes/${data._id}`), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
          Nouvelle Équipe
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 font-semibold">
          Créez votre équipe et partez à la conquête des tournois
        </p>
      </div>

      {/* ── Formulaire ── */}
      <div className="max-w-2xl mx-auto px-4 sm:px-8 py-10">
        <div
          className="bg-gradient-to-br from-green-600 to-green-700 shadow-xl p-6 sm:p-10 text-white"
          style={{
            borderTopLeftRadius: '1.5rem',
            borderTopRightRadius: '0',
            borderBottomLeftRadius: '1.5rem',
            borderBottomRightRadius: '1.5rem',
          }}
        >
          {/* Message succès */}
          {success && (
            <div className="bg-green-400/30 border border-green-300 rounded-xl px-4 py-3 mb-6 text-center">
              <p className="text-white font-bold">✅ Équipe créée avec succès ! Redirection...</p>
            </div>
          )}

          {/* Message erreur */}
          {error && (
            <div className="bg-red-500/20 border border-red-400 rounded-xl px-4 py-3 mb-6">
              <p className="text-red-300 font-semibold text-sm">⚠️ {error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* Logo */}
            <div>
              <label className="block text-yellow-300 font-semibold mb-3 text-sm sm:text-base">
                Logo de l'équipe
                <span className="text-green-300 font-normal ml-2">(optionnel — max 2 Mo)</span>
              </label>

              {logoPreview ? (
                <div className="flex items-center gap-4">
                  <img
                    src={logoPreview}
                    alt="Aperçu logo"
                    className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="text-red-300 hover:text-red-200 text-sm font-semibold transition-colors"
                  >
                    ✕ Supprimer
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-2xl cursor-pointer hover:border-yellow-400 hover:bg-green-800/30 transition-all duration-200">
                  <svg className="w-8 h-8 text-green-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-green-200 text-sm">Cliquez pour uploader une image</span>
                  <span className="text-green-400 text-xs mt-1">jpeg, png, gif, webp</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Nom */}
            <div>
              <label className="block text-yellow-300 font-semibold mb-2 text-sm sm:text-base">
                Nom de l'équipe <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="Name"
                value={form.Name}
                onChange={handleChange}
                placeholder="Ex : Les Invincibles"
                maxLength={50}
                className="w-full px-4 py-3 rounded-xl bg-green-800 border-2 border-green-500 focus:border-yellow-400 focus:outline-none text-white placeholder-green-400 text-sm sm:text-base transition-colors"
              />
              <p className="text-green-400 text-xs mt-1 text-right">{form.Name.length}/50</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-yellow-300 font-semibold mb-2 text-sm sm:text-base">
                Description
                <span className="text-green-300 font-normal ml-2">(optionnel)</span>
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Décrivez votre équipe, votre style de jeu..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-3 rounded-xl bg-green-800 border-2 border-green-500 focus:border-yellow-400 focus:outline-none text-white placeholder-green-400 text-sm sm:text-base transition-colors resize-none"
              />
              <p className="text-green-400 text-xs mt-1 text-right">{form.description.length}/500</p>
            </div>

            {/* Jeu principal */}
            <div>
              <label className="block text-yellow-300 font-semibold mb-2 text-sm sm:text-base">
                Jeu principal
                <span className="text-green-300 font-normal ml-2">(optionnel)</span>
              </label>
              <select
                name="jeu_principal"
                value={form.jeu_principal}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-green-800 border-2 border-green-500 focus:border-yellow-400 focus:outline-none text-white text-sm sm:text-base transition-colors appearance-none cursor-pointer"
              >
                <option value="">— Sélectionner un jeu —</option>
                {jeux.map((jeu) => (
                  <option key={jeu._id} value={jeu._id}>
                    {jeu.nom ?? jeu.Name}
                  </option>
                ))}
              </select>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={loading || success}
                className="flex-1 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300
                           disabled:bg-yellow-400/50 disabled:cursor-not-allowed
                           text-green-900 font-bold text-sm sm:text-base px-6 py-3 rounded-xl
                           transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Créer l'équipe
                  </>
                )}
              </button>

              <Link
                to="/equipes"
                className="flex-1 flex items-center justify-center gap-2 bg-green-800 hover:bg-green-900
                           text-white font-bold text-sm sm:text-base px-6 py-3 rounded-xl
                           transition-all duration-200 hover:scale-[1.02] text-center"
              >
                Annuler
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}