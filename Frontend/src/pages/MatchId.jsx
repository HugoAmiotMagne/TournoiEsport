import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatchById, imgUrl } from '../services/api';

const rStyle = (tl, tr, bl, br) => ({
  borderTopLeftRadius: tl,
  borderTopRightRadius: tr,
  borderBottomLeftRadius: bl,
  borderBottomRightRadius: br,
});
const asym   = rStyle('1.5rem', '0', '1.5rem', '1.5rem');
const asymSm = rStyle('1rem',   '0', '1rem',   '1rem');

/* ─── Helpers statut ─── */
const normalizeStatus = (s) =>
  (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_');

const STATUS_STYLE = {
  en_attente: { badge: 'bg-green-300 text-green-900',   label: 'En attente' },
  en_cours:   { badge: 'bg-yellow-400 text-green-900',  label: 'En cours'   },
  termine:    { badge: 'bg-gray-400 text-gray-900',     label: 'Terminé'    },
  annule:     { badge: 'bg-red-400 text-white',         label: 'Annulé'     },
};

const StatutBadge = ({ status }) => {
  const s = STATUS_STYLE[normalizeStatus(status)] ?? { badge: 'bg-gray-400 text-white', label: status };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${s.badge}`}>
      {s.label}
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

/* ─── Avatar équipe ─── */
const TeamAvatar = ({ equipe, size = 'lg', highlight = false }) => {
  const sz     = size === 'lg' ? 'w-16 h-16 text-2xl' : 'w-10 h-10 text-base';
  const border = highlight ? 'border-yellow-400' : 'border-green-500';
  return equipe?.logo ? (
    <img src={imgUrl(equipe.logo)} alt={equipe.Name}
      className={`${sz} rounded-full object-cover border-2 ${border} flex-shrink-0`} />
  ) : (
    <div className={`${sz} rounded-full bg-green-600 border-2 ${border} flex items-center justify-center flex-shrink-0 font-black text-white`}>
      {(equipe?.Name ?? '?')[0].toUpperCase()}
    </div>
  );
};

/* ══════════════════════════════════════════
   Page MatchId
══════════════════════════════════════════ */
export default function MatchId() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMatchById(id)
      .then(data => setMatch(data))
      .catch(err  => setError(err.message));
  }, [id]);

  if (error) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center px-4">
      <p className="text-red-600 text-xl text-center">{error}</p>
    </div>
  );

  if (!match) return (
    <div className="min-h-screen bg-[#E8F5A8] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-700 font-medium">Chargement du match…</p>
      </div>
    </div>
  );

  const status       = normalizeStatus(match.status);
  const isTermine    = status === 'termine';
  const partiesCount = match.parties?.length ?? 0;

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full py-8 sm:py-12 px-4 sm:px-8">

      {/* Retour */}
      <div className="max-w-3xl mx-auto mb-5">
        <Link
          to="/match"
          className="inline-flex items-center gap-2 text-green-800 font-semibold hover:text-green-600 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tous les matchs
        </Link>
      </div>

      <div
        className="max-w-3xl mx-auto bg-gradient-to-br from-green-600 to-green-700 shadow-2xl text-white overflow-hidden"
        style={asym}
      >

        {/* ── Hero : affrontement ── */}
        <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6">
          {match.tournoi && (
            <p className="text-center text-yellow-300 text-xs sm:text-sm font-bold uppercase tracking-widest mb-4">
              {match.tournoi.Name ?? '—'}
            </p>
          )}

          <div className="flex items-center justify-between gap-4 sm:gap-8">
            {/* Participant 1 */}
            <div className="flex-1 flex flex-col items-center gap-3 text-center">
              <TeamAvatar equipe={match.participant1} size="lg" highlight />
              <div>
                <p className="font-bold text-lg sm:text-2xl leading-tight">
                  {match.participant1?.Name ?? 'Équipe 1'}
                </p>
                {match.participant1?.membres && (
                  <p className="text-green-300 text-xs mt-0.5">
                    {match.participant1.membres.length} membre{match.participant1.membres.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* VS + score */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <span className="text-yellow-300 font-black text-3xl sm:text-4xl">VS</span>
              {isTermine && match.score && (
                <span className="bg-green-800 text-white font-black text-xl sm:text-2xl px-4 py-1 rounded-xl mt-1">
                  {match.score}
                </span>
              )}
            </div>

            {/* Participant 2 */}
            <div className="flex-1 flex flex-col items-center gap-3 text-center">
              <TeamAvatar equipe={match.participant2} size="lg" highlight />
              <div>
                <p className="font-bold text-lg sm:text-2xl leading-tight">
                  {match.participant2?.Name ?? 'Équipe 2'}
                </p>
                {match.participant2?.membres && (
                  <p className="text-green-300 text-xs mt-0.5">
                    {match.participant2.membres.length} membre{match.participant2.membres.length > 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-5">
            <StatutBadge status={match.status} />
          </div>
        </div>

        {/* ── Infos rapides ── */}
        <div className="px-6 sm:px-10 pb-6">
          <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3">Informations</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoBlock label="Date">
              {new Date(match.date_debut).toLocaleDateString('fr-FR', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </InfoBlock>
            <InfoBlock label="Heure">
              {new Date(match.date_debut).toLocaleTimeString('fr-FR', {
                hour: '2-digit', minute: '2-digit',
              })}
            </InfoBlock>
            <InfoBlock label="Parties jouées">
              <span>{partiesCount}</span>
              {partiesCount > 0 && (
                <span className="text-green-300 text-sm font-normal ml-1">
                  partie{partiesCount > 1 ? 's' : ''}
                </span>
              )}
            </InfoBlock>
          </div>
        </div>

        {/* ── Tournoi lié ── */}
        {match.tournoi && typeof match.tournoi === 'object' && (
          <div className="px-6 sm:px-10 pb-6">
            <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3">Tournoi</h3>
            <div className="bg-green-800 p-4 sm:p-5" style={asymSm}>
              <p className="text-white font-bold text-lg">{match.tournoi.Name}</p>
              {match.tournoi.statut && (
                <p className="text-green-300 text-sm mt-0.5">{match.tournoi.statut}</p>
              )}
            </div>
          </div>
        )}

        {/* ── Parties ── */}
        {partiesCount > 0 && (
          <div className="px-6 sm:px-10 pb-6">
            <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3">
              Parties ({partiesCount})
            </h3>
            <div className="bg-green-800 p-4 sm:p-5 space-y-2" style={asymSm}>
              {match.parties.map((p, i) => (
                <div
                  key={p._id ?? i}
                  className="flex items-center justify-between bg-green-700 px-4 py-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-white font-semibold text-sm">
                      {p.map ?? `Partie ${i + 1}`}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    {p.score && (
                      <span className="text-yellow-300 font-bold text-lg">{p.score}</span>
                    )}
                    {p.gagnant && (
                      <div className="flex items-center gap-2 bg-green-600 px-3 py-1 rounded-lg">
                        <span className="text-yellow-300 text-xs">🏆</span>
                        <span className="text-white font-semibold text-sm">
                          {p.gagnant?.Name ?? p.gagnant?.nom ?? 'Gagnant'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Équipes (membres) ── */}
        {[match.participant1, match.participant2].some(e => Array.isArray(e?.membres) && e.membres.length > 0) && (
          <div className="px-6 sm:px-10 pb-6">
            <h3 className="text-yellow-300 font-semibold text-sm uppercase tracking-widest mb-3">Compositions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[match.participant1, match.participant2].map((equipe, ei) =>
                Array.isArray(equipe?.membres) && equipe.membres.length > 0 ? (
                  <div key={equipe._id ?? ei} className="bg-green-800 p-4" style={asymSm}>
                    <div className="flex items-center gap-2 mb-3">
                      <TeamAvatar equipe={equipe} size="sm" />
                      <p className="text-white font-bold text-sm">{equipe.Name}</p>
                    </div>
                    <ul className="space-y-1.5">
                      {equipe.membres.map((m, mi) => (
                        <li key={m._id ?? mi} className="flex items-center gap-2 text-green-100 text-sm">
                          <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {(m.username ?? m.name ?? '?')[0].toUpperCase()}
                          </div>
                          {m.username ?? m.name ?? m.email ?? `Joueur ${mi + 1}`}
                          {equipe.capitaine?._id === m._id && (
                            <span className="text-yellow-300 text-xs ml-auto">C</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="px-6 sm:px-10 pb-8">
          <div className="border-t border-green-500 pt-5 flex items-center justify-between flex-wrap gap-3">
            <p className="text-green-300 text-xs">
              Créé le {new Date(match.createdAt ?? match.date_debut).toLocaleDateString('fr-FR')}
            </p>
            {match.tournoi?._id && (
              <Link
                to={`/tournois/${match.tournoi._id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300
                           text-green-900 font-bold text-sm rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                Voir le tournoi
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}