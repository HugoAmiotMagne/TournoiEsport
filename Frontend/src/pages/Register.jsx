import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    date_de_naissance: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { confirmPassword, ...userData } = form;
      await signupUser(userData);
      // Auto-login après inscription
      const data = await loginUser(form.email, form.password);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-yellow-300 text-center mb-2">Inscription</h1>
          <p className="text-green-200 text-center text-sm mb-8">Rejoins la communauté Game Bar Hub !</p>

          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-green-100 text-sm font-medium mb-1.5">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  value={form.prenom}
                  onChange={handleChange}
                  required
                  placeholder="Jean"
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
                  placeholder="Dupont"
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
                placeholder="ton@email.com"
                className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-green-100 text-sm font-medium mb-1.5">Date de naissance</label>
              <input
                type="date"
                name="date_de_naissance"
                value={form.date_de_naissance}
                onChange={handleChange}
                required
                className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-green-100 text-sm font-medium mb-1.5">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
                placeholder="8 caractères minimum"
                className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-green-100 text-sm font-medium mb-1.5">Confirmer le mot de passe</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full bg-green-800 text-white placeholder-green-400 rounded-xl px-4 py-3 text-sm outline-none border-2 border-green-600 focus:border-yellow-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-yellow-400 hover:bg-yellow-300 disabled:bg-yellow-600 text-green-900 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription en cours...' : "Créer mon compte"}
            </button>
          </form>

          <p className="text-green-200 text-sm text-center mt-6">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
