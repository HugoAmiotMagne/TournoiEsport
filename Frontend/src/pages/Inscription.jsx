import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTournoiById, getMesEquipes, createInscription, imgUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Inscription() {
  const { id } = useParams();
  const { user, token, isLoggedIn } = useAuth();

  const [tournoi,      setTournoi]      = useState(null);
  const [monEquipe,    setMonEquipe]    = useState(null); // membership objet avec equipe populée
  const [loading,      setLoading]      = useState(true);
  const [tournoiError, setTournoiError] = useState(null);

  const [submitting,   setSubmitting]   = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [submitError,  setSubmitError]  = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tournoiData = await getTournoiById(id);
        setTournoi(tournoiData);

        if (isLoggedIn && user?.id) {
          const memberships = await getMesEquipes(user.id);
          if (memberships.length > 0) {
            setMonEquipe(memberships[0]); // l'utilisateur ne peut être que dans une équipe
          }
        }
      } catch (err) {
        setTournoiError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isLoggedIn, user]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createInscription({
        tournoi: id,
        equipe:  monEquipe.equipe._id,
        date_limite: tournoi.date_debut,
        prix_paye:   tournoi.prix_inscription ?? 0,
      }, token);
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const asym = {
    borderTopLeftRadius:     '1.5rem',
    borderTopRightRadius:    '0',
    borderBottomLeftRadius:  '1.5rem',
    borderBottomRightRadius: '1.5rem',
  };
  const asymSm = {
    borderTopLeftRadius:     '1rem',
    borderTopRightRadius:    '0',
    borderBottomLeftRadius:  '1rem',
    borderBottomRightRadius: '1rem',
  };

  if (loading) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">Chargement…</p>
      </div>
    </div>
  );

  if (tournoiError) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center px-4">
      <p className="text-red-600 text-xl text-center">{tournoiError}</p>
    </div>
  );

  const inscriptionsCount = tournoi.inscriptions?.length ?? 0;
  const isFull            = inscriptionsCount >= tournoi.nombre_equipes_max;
  const placesRestantes   = tournoi.nombre_equipes_max - inscriptionsCount;
  const equipe            = monEquipe?.equipe;

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full py-8 sm:py-12 px-4 sm:px-8">

      {/* Retour */}
      <div className="max-w-2xl mx-auto mb-5">
        <Link
          to={`/tournois/${id}`}
          className="inline-flex items-center gap-2 text-green-800 font-semibold hover:text-green-600 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au tournoi
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-gradient-to-br from-green-600 to-green-700 shadow-2xl text-white" style={asym}>

        {/* Header */}
        <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 text-center">
          <p className="text-yellow-300 text-xs font-bold uppercase tracking-widest mb-2">🏆 Inscription</p>
          <h1 className="text-2xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {tournoi.Name}
          </h1>
          <p className="text-green-200 text-sm">
            {new Date(tournoi.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' — '}
            {new Date(tournoi.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-green-800 px-4 py-2 rounded-full">
            <span className="text-green-200 text-sm">Places restantes :</span>
            <span className={`font-bold text-sm ${isFull ? 'text-red-300' : 'text-yellow-300'}`}>
              {placesRestantes} / {tournoi.nombre_equipes_max}
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div className="px-6 sm:px-10 pb-8">

          {/* Tournoi plein */}
          {isFull ? (
            <div className="flex flex-col items-center gap-4 bg-red-500/20 border-2 border-red-400 rounded-2xl p-8 text-center">
              <svg className="w-12 h-12 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <div>
                <p className="text-red-300 font-bold text-xl">Tournoi complet</p>
                <p className="text-red-200 text-sm mt-1">
                  Les {tournoi.nombre_equipes_max} équipes sont déjà inscrites.
                </p>
              </div>
              <Link to="/tournois" className="mt-2 px-6 py-2 bg-green-700 hover:bg-green-600 rounded-xl text-white font-semibold text-sm transition-colors">
                Voir d'autres tournois
              </Link>
            </div>

          ) : success ? (
            /* Succès */
            <div className="flex flex-col items-center gap-4 bg-green-400/20 border-2 border-green-300 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-green-400/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-green-300 font-bold text-2xl">Inscription confirmée !</p>
                <p className="text-green-200 text-sm mt-2">
                  L'équipe <span className="font-bold text-white">{equipe?.Name}</span> est bien inscrite à <span className="font-bold text-white">{tournoi.Name}</span>.
                </p>
              </div>
              <Link to={`/tournois/${id}`} className="mt-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-xl transition-colors">
                Voir le tournoi
              </Link>
            </div>

          ) : !isLoggedIn ? (
            /* Non connecté */
            <div className="flex flex-col items-center gap-4 bg-green-800 rounded-2xl p-8 text-center" style={asymSm}>
              <p className="text-green-200 text-base">Tu dois être connecté pour t'inscrire à un tournoi.</p>
              <Link to="/login" className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-xl transition-colors">
                Se connecter
              </Link>
            </div>

          ) : !monEquipe ? (
            /* Pas d'équipe */
            <div className="flex flex-col items-center gap-5 bg-green-800 rounded-2xl p-8 text-center" style={asymSm}>
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <p className="text-white font-bold text-lg mb-1">Tu n'as pas encore d'équipe</p>
                <p className="text-green-300 text-sm">
                  Rejoins ou crée une équipe avant de t'inscrire à un tournoi.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Link
                  to="/teams"
                  className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-xl transition-colors text-center text-sm"
                >
                  Rejoindre une équipe
                </Link>
                <Link
                  to="/teams/new"
                  className="flex-1 py-3 border-2 border-green-400 hover:border-yellow-400 hover:bg-green-600/40 text-green-200 hover:text-yellow-300 font-bold rounded-xl transition-colors text-center text-sm"
                >
                  Créer une équipe
                </Link>
              </div>
            </div>

          ) : (
            /* Formulaire avec l'équipe de l'utilisateur */
            <div className="space-y-5">

              {/* Carte équipe */}
              <div className="bg-green-800 p-5 sm:p-6" style={asymSm}>
                <h3 className="text-yellow-300 font-semibold text-lg mb-4">Ton équipe</h3>
                <div className="flex items-center gap-4 bg-green-700 border border-yellow-400/40 px-4 py-4 rounded-xl">
                  {equipe?.logo ? (
                    <img src={imgUrl(equipe.logo)} alt={equipe.Name} className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-green-900 text-lg flex-shrink-0">
                      {equipe?.Name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold truncate">{equipe?.Name}</p>
                    <p className="text-yellow-300 text-xs mt-0.5">
                      Rôle : <span className="capitalize">{monEquipe.role}</span>
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-green-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Erreur soumission */}
              {submitError && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-400 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-red-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-300 text-sm">{submitError}</p>
                </div>
              )}

              {/* Bouton confirmer */}
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed
                           text-green-900 font-bold text-lg rounded-2xl shadow-lg
                           transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]
                           flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-green-900 border-t-transparent rounded-full animate-spin" />
                    Inscription en cours…
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Inscrire {equipe?.Name} au tournoi
                  </>
                )}
              </button>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
