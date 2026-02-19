import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getJeux } from '../services/api';

export default function NewTeams() {
  const navigate = useNavigate();

  const [jeux, setJeux] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const [form, setForm] = useState({
    Name: '',
    description: '',
    jeu_principal: '',
    logo: null, // fichier
  });

  useEffect(() => {
    getJeux().then(setJeux).catch(() => setJeux([]));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setError('Format non supporté (jpeg, png, gif, webp)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Le logo ne doit pas dépasser 2 Mo');
      return;
    }

    setError(null);
    setLogoPreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, logo: file }));
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setForm((prev) => ({ ...prev, logo: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!form.Name.trim()) {
      setError("Le nom de l'équipe est requis");
      return;
    }

    const data = new FormData();
    data.append('Name', form.Name.trim());
    if (form.description) data.append('description', form.description.trim());
    if (form.jeu_principal) data.append('jeu_principal', form.jeu_principal);
    if (form.logo) data.append('logo', form.logo);

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3002/api/equipes/new', {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: data,
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Erreur');

      setSuccess(true);
      setTimeout(() => navigate(`/equipes/${result._id}`), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full">
      <div className="w-full bg-gradient-to-br from-green-600 to-green-700 py-12 text-center">
        <h1 className="text-5xl font-bold text-yellow-300 italic">Nouvelle Équipe</h1>
      </div>

      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="bg-green-700 p-8 rounded-xl text-white">

          {error && <div className="mb-4 text-red-300">⚠️ {error}</div>}
          {success && <div className="mb-4 text-green-300">✅ Équipe créée</div>}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Logo */}
            <div>
              <label className="block mb-2 font-semibold">Logo</label>
              {logoPreview ? (
                <div className="flex items-center gap-4">
                  <img src={logoPreview} alt="preview" className="w-20 h-20 rounded-full" />
                  <button type="button" onClick={handleRemoveLogo} className="text-red-300">
                    Supprimer
                  </button>
                </div>
              ) : (
                <input type="file" accept="image/*" onChange={handleLogoChange} />
              )}
            </div>

            {/* Nom */}
            <input
              name="Name"
              placeholder="Nom de l'équipe"
              value={form.Name}
              onChange={handleChange}
              className="w-full p-3 rounded text-black"
            />

            {/* Description */}
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-3 rounded text-black"
            />

            {/* Jeu */}
            <select
              name="jeu_principal"
              value={form.jeu_principal}
              onChange={handleChange}
              className="w-full p-3 rounded text-black"
            >
              <option value="">— Jeu principal —</option>
              {jeux.map((jeu) => (
                <option key={jeu._id} value={jeu._id}>
                  {jeu.Name}
                </option>
              ))}
            </select>

            <button
              disabled={loading}
              className="w-full bg-yellow-400 text-green-900 font-bold py-3 rounded"
            >
              {loading ? 'Création...' : 'Créer'}
            </button>

            <Link to="/equipes" className="block text-center underline">
              Annuler
            </Link>

          </form>
        </div>
      </div>
    </div>
  );
}
