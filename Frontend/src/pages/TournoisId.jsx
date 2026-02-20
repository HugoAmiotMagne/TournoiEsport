import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTournoiById } from '../services/api';

const rStyle = (tl, tr, bl, br) => ({
  borderTopLeftRadius: tl,
  borderTopRightRadius: tr,
  borderBottomLeftRadius: bl,
  borderBottomRightRadius: br,
});

const asym   = rStyle('1.5rem', '0', '1.5rem', '1.5rem');
const asymSm = rStyle('1rem',   '0', '1rem',   '1rem');

/* ─── Badge statut tournoi ─── */
const StatutBadge = ({ statut }) => {
  const map = {
    'en cours': { bg: 'bg-yellow-400', text: 'text-green-900' },
    'à venir':  { bg: 'bg-green-300',  text: 'text-green-900' },
    'terminé':  { bg: 'bg-gray-400',   text: 'text-gray-900'  },
    'annulé':   { bg: 'bg-red-400',    text: 'text-white'     },
  };
  const c = map[statut] || { bg: 'bg-gray-400', text: 'text-white' };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${c.bg} ${c.text}`}>
      {statut}
    </span>
  );
};

/* ─── Bloc info rapide ─── */
const InfoBlock = ({ label, children }) => (
  <div className="bg-green-700 p-4 rounded-xl">
    <p className="text-green-200 text-xs uppercase tracking-widest mb-1">{label}</p>
    <div className="text-white font-semibold text-lg leading-tight">{children}</div>
  </div>
);

/* ─── Badge statut match ─── */
const normalizeStatus = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');

const matchStatusStyle = (s) => {
  const n = normalizeStatus(s);
  if (n === 'en_cours')   return 'bg-yellow-400/20 border border-yellow-400 text-yellow-300';
  if (n === 'en_attente') return 'bg-green-400/20  border border-green-400  text-green-300';
  if (n === 'termine')    return 'bg-gray-400/20   border border-gray-400   text-gray-300';
  if (n === 'annule')     return 'bg-red-400/20    border border-red-400    text-red-400';
  return 'bg-gray-400/20 border border-gray-400 text-gray-300';
};
const matchStatusLabel = {
  en_attente: 'En attente',
  en_cours:   'En cours',
  termine:    'Terminé',
  annule:     'Annulé',
};

/* ══════════════════════════════════════════
   Panneau détail — Équipe
══════════════════════════════════════════ */
const EquipeDetail = ({ equipe }) => (
  <div className="flex flex-col gap-4 h-full">
    {/* En-tête */}
    <div className="flex items-center gap-4">
      {equipe.logo ? (
        <img src={equipe.logo} alt={equipe.Name}
          className="w-14 h-14 rounded-full object-cover border-2 border-yellow-400 flex-shrink-0" />
      ) : (
        <div className="w-14 h-14 rounded-full bg-green-600 border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
          <span className="text-yellow-300 font-black text-xl">{equipe.Name?.[0]?.toUpperCase() ?? '?'}</span>
        </div>
      )}
      <div>
        <h3 className="text-white font-bold text-xl leading-tight">{equipe.Name}</h3>
        <p className="text-green-300 text-xs mt-0.5">
          Créée le {new Date(equipe.date_creation).toLocaleDateString('fr-FR')}
        </p>
      </div>
    </div>

    {/* Description */}
    {equipe.description && (
      <div className="bg-green-700/50 p-3 rounded-xl">
        <p className="text-green-200 text-xs uppercase tracking-widest mb-1">Description</p>
        <p className="text-green-100 text-sm leading-relaxed">{equipe.description}</p>
      </div>
    )}

    {/* Capitaine */}
    {equipe.capitaine && (
      <div className="bg-green-700/50 p-3 rounded-xl">
        <p className="text-green-200 text-xs uppercase tracking-widest mb-2">Capitaine</p>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-green-900 font-bold text-sm flex-shrink-0">
            {(equipe.capitaine.username ?? equipe.capitaine.name ?? '?')[0].toUpperCase()}
          </div>
          <span className="text-white font-semibold text-sm">
            {equipe.capitaine.username ?? equipe.capitaine.name ?? equipe.capitaine.email}
          </span>
        </div>
      </div>
    )}

    {/* Membres */}
    {Array.isArray(equipe.membres) && equipe.membres.length > 0 && (
      <div className="bg-green-700/50 p-3 rounded-xl flex-1">
        <p className="text-green-200 text-xs uppercase tracking-widest mb-2">
          Membres ({equipe.membres.length})
        </p>
        <ul className="space-y-1.5 overflow-y-auto max-h-48">
          {equipe.membres.map((m, i) => (
            <li key={m._id ?? i} className="flex items-center gap-2 text-sm text-green-100">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                {(m.username ?? m.name ?? '?')[0].toUpperCase()}
              </div>
              {m.username ?? m.name ?? m.email ?? `Joueur ${i + 1}`}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Jeu principal */}
    {equipe.jeu_principal && (
      <div className="bg-green-700/50 p-3 rounded-xl flex items-center gap-2">
        <span className="text-yellow-300">🎮</span>
        <div>
          <p className="text-green-200 text-xs">Jeu principal</p>
          <p className="text-white font-semibold text-sm">
            {equipe.jeu_principal.nom ?? equipe.jeu_principal.Name ?? '—'}
          </p>
        </div>
      </div>
    )}
  </div>
);

/* ══════════════════════════════════════════
   Panneau détail — Match
══════════════════════════════════════════ */
const MatchDetail = ({ match }) => (
  <div className="flex flex-col gap-4 h-full">
    {/* Statut + date */}
    <div className="flex items-center justify-between flex-wrap gap-2">
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${matchStatusStyle(match.status)}`}>
        {matchStatusLabel[normalizeStatus(match.status)] ?? match.status}
      </span>
      <span className="text-green-300 text-xs">
        {new Date(match.date_debut).toLocaleDateString('fr-FR', {
          day: 'numeric', month: 'long', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        })}
      </span>
    </div>

    {/* Affrontement */}
    <div className="bg-green-700/50 p-4 rounded-xl">
      <div className="flex items-center justify-between gap-3">
        {/* Participant 1 */}
        <div className="flex-1 text-center">
          {match.participant1?.logo ? (
            <img src={match.participant1.logo} alt=""
              className="w-12 h-12 rounded-full object-cover mx-auto mb-2 border-2 border-green-500" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
              {(match.participant1?.Name ?? match.participant1?.nom ?? '?')[0].toUpperCase()}
            </div>
          )}
          <p className="text-white font-bold text-sm leading-tight">
            {match.participant1?.Name ?? match.participant1?.nom ?? 'Équipe 1'}
          </p>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center flex-shrink-0">
          <span className="text-yellow-300 font-black text-2xl">VS</span>
          {match.score && (
            <span className="text-white font-bold text-lg mt-1">{match.score}</span>
          )}
        </div>

        {/* Participant 2 */}
        <div className="flex-1 text-center">
          {match.participant2?.logo ? (
            <img src={match.participant2.logo} alt=""
              className="w-12 h-12 rounded-full object-cover mx-auto mb-2 border-2 border-green-500" />
          ) : (
            <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
              {(match.participant2?.Name ?? match.participant2?.nom ?? '?')[0].toUpperCase()}
            </div>
          )}
          <p className="text-white font-bold text-sm leading-tight">
            {match.participant2?.Name ?? match.participant2?.nom ?? 'Équipe 2'}
          </p>
        </div>
      </div>
    </div>

    {/* Parties */}
    {Array.isArray(match.parties) && match.parties.length > 0 && (
      <div className="bg-green-700/50 p-3 rounded-xl flex-1">
        <p className="text-green-200 text-xs uppercase tracking-widest mb-2">
          Parties ({match.parties.length})
        </p>
        <ul className="space-y-1.5 overflow-y-auto max-h-48">
          {match.parties.map((p, i) => (
            <li key={p._id ?? i}
              className="flex items-center justify-between bg-green-700 px-3 py-2 rounded-lg text-sm"
            >
              <span className="text-green-200">Partie {i + 1}</span>
              {p.score   && <span className="text-yellow-300 font-bold">{p.score}</span>}
              {p.gagnant && (
                <span className="text-white text-xs">
                  🏆 {p.gagnant?.Name ?? p.gagnant?.nom ?? 'Gagnant'}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    )}

    {/* Lien vers la page match */}
    <Link
      to={`/matchs/${match._id}`}
      className="mt-auto flex items-center justify-center gap-2 px-4 py-2.5
                 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold text-sm
                 rounded-xl transition-all duration-200 hover:scale-[1.02]"
    >
      Voir le match complet
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </div>
);

/* ══════════════════════════════════════════
   Section split : liste gauche / détail droite
══════════════════════════════════════════ */
const SplitSection = ({ title, items, renderRow, renderDetail, emptyText }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div className="px-6 sm:px-10 pb-6">
      <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3">
        {title} ({items.length})
      </h3>

      <div className="flex gap-3" style={{ minHeight: '200px' }}>

        {/* ── Liste gauche ── */}
        <div className={`flex flex-col gap-2 overflow-y-auto transition-all duration-300 ${selected ? 'w-2/5' : 'w-full'}`}>
          {items.length === 0 ? (
            <p className="text-green-300 text-sm italic p-4">{emptyText}</p>
          ) : (
            items.map((item, i) => {
              const isSelected = selected?._id === item._id && selected?._index === i;
              return (
                <button
                  key={item._id ?? i}
                  onClick={() => setSelected(isSelected ? null : { ...item, _index: i })}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold
                              transition-all duration-200 flex items-center gap-3
                              ${isSelected
                                ? 'bg-yellow-400 text-green-900 shadow-md'
                                : 'bg-green-800 text-green-100 hover:bg-green-700 hover:text-white'
                              }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center
                                   text-xs font-bold flex-shrink-0
                                   ${isSelected ? 'bg-green-900 text-yellow-300' : 'bg-green-600 text-white'}`}>
                    {i + 1}
                  </span>
                  {renderRow(item)}
                </button>
              );
            })
          )}
        </div>

        {/* ── Panneau détail droite ── */}
        {selected && (
          <div
            className="flex-1 bg-green-800 p-4 sm:p-5 overflow-y-auto"
            style={asymSm}
          >
            {/* Bouton fermer */}
            <div className="flex justify-end mb-3">
              <button
                onClick={() => setSelected(null)}
                className="text-green-400 hover:text-white transition-colors"
                aria-label="Fermer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {renderDetail(selected)}
          </div>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   Composant principal
══════════════════════════════════════════ */
export default function TournoiId() {
  const { id } = useParams();
  const [tournoi, setTournoi] = useState(null);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    getTournoiById(id, 'jeu,salle,createur,inscriptions,matchs')
      .then(data => setTournoi(data))
      .catch(err  => setError(err.message));
  }, [id]);

  if (error) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center px-4">
      <p className="text-red-600 text-xl text-center">{error}</p>
    </div>
  );

  if (!tournoi) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">Chargement du tournoi…</p>
      </div>
    </div>
  );

  const duree = Math.ceil(
    (new Date(tournoi.date_fin) - new Date(tournoi.date_debut)) / (1000 * 60 * 60 * 24)
  );

  const inscriptionsCount = tournoi.inscriptions?.length ?? 0;
  const matchsCount       = tournoi.matchs?.length       ?? 0;
  const isFull            = inscriptionsCount >= tournoi.nombre_equipes_max;
  const isOpen            = tournoi.statut === 'à venir' || tournoi.statut === 'en cours';

  /* Équipes extraites des inscriptions */
  const equipes = (tournoi.inscriptions ?? []).map((ins, i) =>
    ins.equipe && typeof ins.equipe === 'object'
      ? ins.equipe
      : { _id: ins._id ?? `fake-${i}`, Name: ins.equipe ?? `Équipe ${i + 1}`, _fake: true }
  );

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full py-8 sm:py-12 px-4 sm:px-8">

      {/* Retour */}
      <div className="max-w-4xl mx-auto mb-5">
        <Link
          to="/tournois"
          className="inline-flex items-center gap-2 text-green-800 font-semibold hover:text-green-600 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tous les tournois
        </Link>
      </div>

      <div
        className="max-w-4xl mx-auto bg-gradient-to-br from-green-600 to-green-700 shadow-2xl text-white overflow-hidden"
        style={asym}
      >

        {/* ── Hero header ── */}
        <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 text-center">
          {tournoi.jeu && (
            <p className="text-yellow-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-2">
              {tournoi.jeu.name ?? tournoi.jeu.Name ?? 'Jeu'}
            </p>
          )}
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>
            {tournoi.Name}
          </h1>
          <StatutBadge statut={tournoi.statut} />
          <p className="text-green-200 text-sm mt-4">
            Du{' '}
            <span className="font-semibold text-white">
              {new Date(tournoi.date_debut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            {' '}au{' '}
            <span className="font-semibold text-white">
              {new Date(tournoi.date_fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="ml-2 text-green-300">({duree} jour{duree > 1 ? 's' : ''})</span>
          </p>
        </div>

        {/* ── Description ── */}
        <div className="px-6 sm:px-10 pb-6">
          <div className="bg-green-800 p-5 sm:p-6" style={asymSm}>
            <h3 className="text-yellow-300 font-semibold text-lg mb-2">Description</h3>
            <p className="text-green-100 leading-relaxed">{tournoi.description}</p>
          </div>
        </div>

        {/* ── Infos rapides ── */}
        <div className="px-6 sm:px-10 pb-6">
          <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3">Informations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoBlock label="Prix d'inscription">
              {tournoi.prix_inscription === 0
                ? <span className="text-green-300">Gratuit</span>
                : `${tournoi.prix_inscription} €`}
            </InfoBlock>
            <InfoBlock label="Équipes max">{tournoi.nombre_equipes_max}</InfoBlock>
            <InfoBlock label="Inscriptions">
              <span className={isFull ? 'text-red-300' : 'text-white'}>
                {inscriptionsCount}
                <span className="text-green-300 text-sm font-normal"> / {tournoi.nombre_equipes_max}</span>
              </span>
            </InfoBlock>
            <InfoBlock label="Matchs joués">{matchsCount}</InfoBlock>
          </div>
        </div>

        {/* ── Bouton inscription ── */}
        {isOpen && (
          <div className="px-6 sm:px-10 pb-6">
            {isFull ? (
              <div className="flex items-center justify-center gap-3 bg-red-500/20 border-2 border-red-400 rounded-2xl px-6 py-4">
                <svg className="w-6 h-6 text-red-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <div>
                  <p className="text-red-300 font-bold text-lg">Tournoi complet</p>
                  <p className="text-red-200 text-sm">Les {tournoi.nombre_equipes_max} équipes sont déjà inscrites.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Link
                  to={`/inscription/tournois/${id}`}
                  className="w-full sm:w-auto px-10 py-4 bg-yellow-400 hover:bg-yellow-300
                             text-green-900 font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl
                             transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]
                             flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  S&apos;inscrire au tournoi
                </Link>
                <p className="text-green-300 text-xs">
                  {tournoi.nombre_equipes_max - inscriptionsCount} place{tournoi.nombre_equipes_max - inscriptionsCount > 1 ? 's' : ''} restante{tournoi.nombre_equipes_max - inscriptionsCount > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Jeu ── */}
        {tournoi.jeu && typeof tournoi.jeu === 'object' && (
          <div className="px-6 sm:px-10 pb-6">
            <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3">Jeu</h3>
            <div className="bg-green-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={asymSm}>
              {tournoi.jeu.image && (
                <img src={tournoi.jeu.image} alt={tournoi.jeu.name ?? tournoi.jeu.Name}
                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              )}
              <div>
                <p className="text-white font-bold text-xl">{tournoi.jeu.name ?? tournoi.jeu.Name}</p>
                {tournoi.jeu.genre       && <p className="text-green-300 text-sm mt-1">{tournoi.jeu.genre}</p>}
                {tournoi.jeu.description && <p className="text-green-200 text-sm mt-1 line-clamp-2">{tournoi.jeu.description}</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Salle ── */}
        {tournoi.salle && typeof tournoi.salle === 'object' && (
          <div className="px-6 sm:px-10 pb-6">
            <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3">Lieu</h3>
            <div className="bg-green-800 p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-8" style={asymSm}>
              <div>
                <p className="text-white font-bold text-lg">{tournoi.salle.name ?? tournoi.salle.Name}</p>
                {tournoi.salle.adresse && (
                  <p className="text-green-300 text-sm mt-1 flex items-center gap-1">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {tournoi.salle.adresse}
                  </p>
                )}
              </div>
              {tournoi.salle.capacite && (
                <div className="bg-green-700 px-4 py-2 rounded-xl self-start">
                  <p className="text-green-200 text-xs">Capacité</p>
                  <p className="text-white font-bold">{tournoi.salle.capacite} pers.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Équipes inscrites (simple) ── */}
        <div className="px-6 sm:px-10 pb-6">
          <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3">
            Équipes inscrites ({equipes.length})
          </h3>
          {equipes.length === 0 ? (
            <p className="text-green-300 text-sm italic p-4">Aucune équipe inscrite pour l'instant.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {equipes.map((equipe, i) => (
                <div key={equipe._id ?? i} className="bg-green-800 p-4 rounded-xl flex items-center gap-3">
                  {equipe.logo ? (
                    <img src={equipe.logo} alt={equipe.Name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-yellow-400 flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-green-600 border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-yellow-300 font-bold text-lg">{equipe.Name?.[0]?.toUpperCase() ?? '?'}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-sm leading-tight">{equipe.Name}</p>
                    {equipe.capitaine && (
                      <p className="text-green-300 text-xs mt-0.5">
                        Cap: {equipe.capitaine.username ?? equipe.capitaine.name ?? equipe.capitaine.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ══ Split — Matchs ══ */}
        <SplitSection
          title="Matchs"
          items={tournoi.matchs ?? []}
          emptyText="Aucun match planifié pour l'instant."
          renderRow={(match) => (
            <span className="flex items-center gap-2 truncate min-w-0 text-xs sm:text-sm">
              <span className="font-semibold truncate">
                {match.participant1?.Name ?? match.participant1?.nom ?? 'Équipe 1'}
              </span>
              <span className="text-yellow-400 font-black flex-shrink-0">VS</span>
              <span className="font-semibold truncate">
                {match.participant2?.Name ?? match.participant2?.nom ?? 'Équipe 2'}
              </span>
            </span>
          )}
          renderDetail={(match) => <MatchDetail match={match} />}
        />

        {/* ── Créateur ── */}
        {tournoi.createur && typeof tournoi.createur === 'object' && (
          <div className="px-6 sm:px-10 pb-8">
            <div className="border-t border-green-500 pt-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                {(tournoi.createur.username ?? tournoi.createur.name ?? '?')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-green-200 text-xs">Tournoi créé par</p>
                <p className="text-white font-semibold text-sm">
                  {tournoi.createur.username ?? tournoi.createur.name ?? tournoi.createur.email}
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}