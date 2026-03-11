import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEquipeById, getMembresByEquipe, rejoindreEquipe, quitterEquipe, imgUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ROLE_LABEL = {
  capitaine:   'Capitaine',
  joueur:      'Joueur',
  remplacant:  'Remplaçant',
  coach:       'Coach',
};

const ROLE_COLOR = {
  capitaine:  'bg-yellow-400 text-green-900',
  joueur:     'bg-green-700 text-white',
  remplacant: 'bg-green-800 text-green-200',
  coach:      'bg-blue-700 text-white',
};

export default function TeamsId() {
  const { id } = useParams();
  const { user, token, isLoggedIn } = useAuth();

  const [equipe,        setEquipe]        = useState(null);
  const [membres,       setMembres]       = useState([]);
  const [monMembership, setMonMembership] = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg,     setActionMsg]     = useState('');
  const [actionErr,     setActionErr]     = useState('');

  useEffect(() => {
    Promise.all([getEquipeById(id), getMembresByEquipe(id)])
      .then(([eq, mem]) => {
        setEquipe(eq);
        setMembres(mem);
        // Détecter si l'utilisateur connecté est déjà membre
        if (isLoggedIn && user) {
          const moi = mem.find(m =>
            String(m.user?._id) === String(user.id) ||
            String(m.user?._id) === String(user._id)
          );
          setMonMembership(moi ?? null);
        }
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [id]);

  const handleRejoindre = async () => {
    setActionLoading(true);
    setActionErr('');
    setActionMsg('');
    try {
      const nouveau = await rejoindreEquipe(id, token);
      setMembres(prev => [...prev, nouveau]);
      setMonMembership(nouveau);
      setActionMsg("Tu as bien rejoint l'équipe !");
    } catch (err) {
      setActionErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuitter = async () => {
    setActionLoading(true);
    setActionErr('');
    setActionMsg('');
    try {
      await quitterEquipe(monMembership._id, token);
      setMembres(prev => prev.filter(m => m._id !== monMembership._id));
      setMonMembership(null);
      setActionMsg("Tu as quitté l'équipe.");
    } catch (err) {
      setActionErr(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <p className="text-gray-800 text-xl font-semibold">Chargement...</p>
    </div>
  );

  if (error || !equipe) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <p className="text-red-600 text-xl">Erreur : {error ?? 'Équipe introuvable'}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full">

      {/* Bannière */}
      <div className="w-full bg-gradient-to-br from-green-600 to-green-700 py-12 sm:py-16 px-4 sm:px-8 text-center">
        <Link to="/teams" className="inline-block text-green-200 hover:text-white text-sm mb-4 transition-colors">
          ← Retour aux équipes
        </Link>

        <div className="flex flex-col items-center gap-4">
          {equipe.logo ? (
            <img
              src={imgUrl(equipe.logo)}
              alt={`Logo ${equipe.Name}`}
              className="w-24 h-24 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-800 border-4 border-yellow-400 flex items-center justify-center shadow-lg">
              <span className="text-yellow-300 font-black text-4xl">
                {equipe.Name?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl font-bold text-yellow-300 italic" style={{ fontFamily: 'Georgia, serif' }}>
            {equipe.Name}
          </h1>

          <p className="text-green-200 text-sm">
            Créée le {new Date(equipe.date_creation).toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 flex flex-col gap-8">

        {/* Description */}
        {equipe.description && (
          <div
            className="bg-gradient-to-br from-green-600 to-green-700 p-6 text-white shadow-lg"
            style={{ borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}
          >
            <h2 className="text-yellow-300 font-bold text-lg mb-2">À propos</h2>
            <p className="text-green-100 leading-relaxed">{equipe.description}</p>
          </div>
        )}

        {/* Infos + action */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className="bg-gradient-to-br from-green-600 to-green-700 p-5 text-white shadow"
            style={{ borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}
          >
            <p className="text-green-200 text-xs uppercase tracking-wider mb-1">Jeu principal</p>
            <p className="font-semibold text-lg">
              {equipe.jeu_principal?.nom ?? equipe.jeu_principal?.Name ?? '—'}
            </p>
          </div>
          <div
            className="bg-gradient-to-br from-green-600 to-green-700 p-5 text-white shadow"
            style={{ borderTopLeftRadius: '1.5rem', borderBottomLeftRadius: '1.5rem', borderBottomRightRadius: '1.5rem' }}
          >
            <p className="text-green-200 text-xs uppercase tracking-wider mb-1">Membres</p>
            <p className="font-bold text-2xl">
              {membres.length}
              <span className="text-green-300 text-sm font-normal ml-1">
                joueur{membres.length > 1 ? 's' : ''}
              </span>
            </p>
          </div>
        </div>

        {/* Bouton rejoindre / quitter */}
        <div>
          {actionMsg && (
            <div className="bg-green-900/30 border border-green-500 text-green-800 rounded-xl px-4 py-3 mb-4 text-sm text-center font-medium">
              {actionMsg}
            </div>
          )}
          {actionErr && (
            <div className="bg-red-900/20 border border-red-400 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm text-center font-medium">
              {actionErr}
            </div>
          )}

          {!isLoggedIn ? (
            <div className="bg-white/60 border border-green-300 rounded-2xl px-6 py-4 text-center">
              <p className="text-gray-700 text-sm">
                <Link to="/login" className="text-green-700 font-semibold hover:underline">Connecte-toi</Link>
                {' '}pour rejoindre cette équipe.
              </p>
            </div>
          ) : monMembership ? (
            <button
              onClick={handleQuitter}
              disabled={actionLoading || monMembership.role === 'capitaine'}
              title={monMembership.role === 'capitaine' ? "Le capitaine ne peut pas quitter l'équipe" : ''}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {actionLoading ? 'En cours...' : 'Quitter l\'équipe'}
            </button>
          ) : (
            <button
              onClick={handleRejoindre}
              disabled={actionLoading}
              className="w-full sm:w-auto bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-green-900 font-bold px-8 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              {actionLoading ? 'En cours...' : 'Rejoindre l\'équipe'}
            </button>
          )}
        </div>

        {/* Liste des membres */}
        <div>
          <h2 className="text-gray-800 font-bold text-xl mb-4">
            Membres ({membres.length})
          </h2>

          {membres.length === 0 ? (
            <p className="text-gray-500 text-sm italic">Aucun membre pour l'instant.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {membres.map(m => (
                <div
                  key={m._id}
                  className="bg-gradient-to-br from-green-600 to-green-700 px-5 py-4 flex items-center gap-4 shadow"
                  style={{ borderTopLeftRadius: '1rem', borderBottomLeftRadius: '1rem', borderBottomRightRadius: '1rem' }}
                >
                  {/* Avatar initiales */}
                  <div className="w-10 h-10 rounded-full bg-green-800 border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-yellow-300 font-bold text-sm">
                      {m.user?.prenom?.[0]?.toUpperCase() ?? m.user?.email?.[0]?.toUpperCase() ?? '?'}
                    </span>
                  </div>

                  {/* Nom */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">
                      {m.user?.prenom && m.user?.nom
                        ? `${m.user.prenom} ${m.user.nom}`
                        : m.user?.email ?? 'Utilisateur inconnu'}
                    </p>
                    {m.numero_maillot && (
                      <p className="text-green-300 text-xs">N° {m.numero_maillot}</p>
                    )}
                  </div>

                  {/* Badge rôle */}
                  <span className={`text-xs font-bold px-3 py-1 rounded-full flex-shrink-0 ${ROLE_COLOR[m.role] ?? 'bg-green-700 text-white'}`}>
                    {ROLE_LABEL[m.role] ?? m.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
