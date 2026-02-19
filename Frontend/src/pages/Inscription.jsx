import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTournoiById, searchEquipes, createInscription } from '../services/api';

export default function Inscription() {
  const { id } = useParams(); // id du tournoi
  const navigate = useNavigate();

  const [tournoi, setTournoi]       = useState(null);
  const [tournoiError, setTournoiError] = useState(null);

  // Recherche d'équipe
  const [search, setSearch]         = useState('');
  const [equipes, setEquipes]       = useState([]);
  const [searching, setSearching]   = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected]     = useState(null); // équipe choisie

  // Soumission
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const dropdownRef = useRef(null);

  // Charger les infos du tournoi
  useEffect(() => {
    getTournoiById(id)
      .then(data => setTournoi(data))
      .catch(err => setTournoiError(err.message));
  }, [id]);

  // Recherche d'équipes avec debounce
  useEffect(() => {
    if (search.length < 2) { setEquipes([]); setShowDropdown(false); return; }
    setSearching(true);
    const timer = setTimeout(() => {
      searchEquipes(search)
        .then(data => {
          setEquipes(data);
          setShowDropdown(true);
        })
        .catch(() => setEquipes([]))
        .finally(() => setSearching(false));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fermer dropdown si clic extérieur
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selectEquipe = (equipe) => {
    setSelected(equipe);
    setSearch(equipe.name ?? equipe.Name);
    setShowDropdown(false);
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (!selected) { setSubmitError("Veuillez sélectionner une équipe dans la liste."); return; }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createInscription({
        equipe: selected._id,
        date_limite: tournoi.date_debut,
        prix_paye: tournoi.prix_inscription ?? 0,
      });
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const asym = {
    borderTopLeftRadius: '1.5rem',
    borderTopRightRadius: '0',
    borderBottomLeftRadius: '1.5rem',
    borderBottomRightRadius: '1.5rem',
  };
  const asymSm = {
    borderTopLeftRadius: '1rem',
    borderTopRightRadius: '0',
    borderBottomLeftRadius: '1rem',
    borderBottomRightRadius: '1rem',
  };

  if (tournoiError) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center px-4">
      <p className="text-red-600 text-xl text-center">{tournoiError}</p>
    </div>
  );

  if (!tournoi) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">Chargement…</p>
      </div>
    </div>
  );

  const inscriptionsCount = tournoi.inscriptions?.length ?? 0;
  const isFull = inscriptionsCount >= tournoi.nombre_equipes_max;
  const placesRestantes = tournoi.nombre_equipes_max - inscriptionsCount;

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

          {/* Places restantes */}
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
              <Link
                to="/tournois"
                className="mt-2 px-6 py-2 bg-green-700 hover:bg-green-600 rounded-xl text-white font-semibold text-sm transition-colors"
              >
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
                  L'équipe <span className="font-bold text-white">{selected?.name ?? selected?.Name}</span> est bien inscrite à <span className="font-bold text-white">{tournoi.Name}</span>.
                </p>
              </div>
              <Link
                to={`/tournois/${id}`}
                className="mt-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold rounded-xl transition-colors"
              >
                Voir le tournoi
              </Link>
            </div>

          ) : (
            /* Formulaire */
            <div className="space-y-5">

              {/* Recherche équipe */}
              <div className="bg-green-800 p-5 sm:p-6" style={asymSm}>
                <h3 className="text-yellow-300 font-semibold text-lg mb-4">Sélectionne ton équipe</h3>

                <div className="relative" ref={dropdownRef}>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher une équipe…"
                      value={search}
                      onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
                      onFocus={() => equipes.length > 0 && setShowDropdown(true)}
                      className="w-full px-4 py-3 pr-10 rounded-xl bg-green-700 border-2 border-green-600
                                 focus:border-yellow-400 focus:outline-none text-white placeholder-green-400
                                 text-sm transition-colors"
                    />
                    {/* Icône */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {searching ? (
                        <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                      ) : selected ? (
                        <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Dropdown résultats */}
                  {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-green-900 border border-green-600 rounded-xl shadow-2xl overflow-hidden">
                      {equipes.length === 0 ? (
                        <div className="px-4 py-3 text-green-400 text-sm text-center">
                          Aucune équipe trouvée pour "{search}"
                        </div>
                      ) : (
                        <ul className="max-h-52 overflow-y-auto">
                          {equipes.map((eq) => (
                            <li
                              key={eq._id}
                              onClick={() => selectEquipe(eq)}
                              className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-green-700 transition-colors border-b border-green-800 last:border-0"
                            >
                              {/* Avatar initiale */}
                              <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                {(eq.name ?? eq.Name ?? '?')[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="text-white font-semibold text-sm">{eq.name ?? eq.Name}</p>
                                {eq.membres && (
                                  <p className="text-green-400 text-xs">{eq.membres.length} membre{eq.membres.length > 1 ? 's' : ''}</p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>

                {/* Équipe sélectionnée */}
                {selected && (
                  <div className="mt-3 flex items-center gap-3 bg-green-700 border border-yellow-400/40 px-4 py-3 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-green-900 text-sm flex-shrink-0">
                      {(selected.name ?? selected.Name ?? '?')[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold text-sm">{selected.name ?? selected.Name}</p>
                      <p className="text-yellow-300 text-xs">Équipe sélectionnée</p>
                    </div>
                    <button
                      onClick={() => { setSelected(null); setSearch(''); }}
                      className="text-green-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Aide */}
                <p className="text-green-400 text-xs mt-3">
                  Tape au moins 2 caractères pour rechercher ton équipe.
                </p>
              </div>

              {/* Erreur soumission */}
              {submitError && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-400 rounded-xl px-4 py-3">
                  <svg className="w-4 h-4 text-red-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-300 text-sm">{submitError}</p>
                </div>
              )}

              {/* Bouton S'inscrire */}
              <button
                onClick={handleSubmit}
                disabled={submitting || !selected}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Confirmer l'inscription
                  </>
                )}
              </button>

              {/* Séparateur */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-green-500" />
                <span className="text-green-400 text-xs uppercase tracking-widest">ou</span>
                <div className="flex-1 h-px bg-green-500" />
              </div>

              {/* Créer une équipe */}
              <Link
                to="/equipes/creer"
                className="w-full py-4 border-2 border-green-400 hover:border-yellow-400 hover:bg-green-600/40
                           text-green-200 hover:text-yellow-300 font-bold text-base rounded-2xl
                           transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 4v16m8-8H4" />
                </svg>
                Créer mon équipe
              </Link>
              <p className="text-green-400 text-xs text-center -mt-2">
                Tu n'as pas encore d'équipe ? Crée-la puis reviens t'inscrire ici.
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}