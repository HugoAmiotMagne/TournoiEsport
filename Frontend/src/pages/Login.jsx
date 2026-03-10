import React from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
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
    setLoading(true);
    setError('');
    try {
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
      <div className="w-full max-w-md">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-yellow-300 text-center mb-2">Connexion</h1>
          <p className="text-green-200 text-center text-sm mb-8">Content de te revoir !</p>

          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-200 rounded-xl px-4 py-3 mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              <label className="block text-green-100 text-sm font-medium mb-1.5">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={form.password}
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
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-green-200 text-sm text-center mt-6">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
