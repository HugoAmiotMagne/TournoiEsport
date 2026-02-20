import React from 'react';
import { Link } from 'react-router-dom';

const normalizeStatus = (status) => {
  return (status || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');
};

const statusLabel = {
  en_attente: 'En attente',
  en_cours:   'En cours',
  termine:    'Terminé',
  annule:     'Annulé',
};

const statusBadgeBg = (status) => {
  const normalized = normalizeStatus(status);
  if (normalized === 'en_cours')   return 'bg-yellow-400/20 border border-yellow-400 text-yellow-300';
  if (normalized === 'en_attente') return 'bg-green-400/20 border border-green-400 text-green-300';
  if (normalized === 'termine')    return 'bg-gray-400/20 border border-gray-400 text-gray-300';
  if (normalized === 'annule')     return 'bg-red-400/20 border border-red-400 text-red-400';
  return '';
};

const TeamAvatar = ({ equipe }) => {
  return equipe?.logo ? (
    <img
      src={equipe.logo}
      alt={equipe.Name}
      className="w-10 h-10 rounded-full object-cover border-2 border-yellow-400 mx-auto mb-2"
    />
  ) : (
    <div className="w-10 h-10 rounded-full bg-green-600 border-2 border-yellow-400 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
      {(equipe?.Name ?? '?')[0].toUpperCase()}
    </div>
  );
};

export default function MatchCard({ match }) {
  return (
    <Link to={`/match/${match._id}`} className="block group">
      <div
        className="bg-gradient-to-br from-green-600 to-green-700 shadow-lg p-6 sm:p-8 text-white
                   group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300 h-full flex flex-col"
        style={{
          borderTopLeftRadius: '1.5rem',
          borderTopRightRadius: '0',
          borderBottomLeftRadius: '1.5rem',
          borderBottomRightRadius: '1.5rem',
        }}
      >
        {/* Badge statut */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusBadgeBg(match.status)}`}>
            {statusLabel[normalizeStatus(match.status)] ?? match.status}
          </span>
          <span className="text-green-200 text-xs">
            📅 {new Date(match.date_debut).toLocaleDateString('fr-FR', {
              day: 'numeric', month: 'short', year: 'numeric',
            })}
          </span>
        </div>

        {/* Affrontement */}
        <div
          className="bg-green-800 p-4 sm:p-5 mb-5 flex-1"
          style={{
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '0',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
          }}
        >
          <div className="flex items-center justify-between gap-3">
            {/* Participant 1 */}
            <div className="flex-1 text-center">
              <TeamAvatar equipe={match.participant1} />
              <p className="font-bold text-sm sm:text-base leading-tight">
                {match.participant1?.Name ?? 'Équipe 1'}
              </p>
              {match.participant1?.membres && (
                <p className="text-green-300 text-xs mt-0.5">
                  {match.participant1.membres.length} membre{match.participant1.membres.length > 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* VS + score */}
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="text-yellow-300 font-black text-xl sm:text-2xl">VS</span>
              {normalizeStatus(match.status) === 'termine' && match.score && (
                <span className="text-white font-bold text-sm mt-1">{match.score}</span>
              )}
            </div>

            {/* Participant 2 */}
            <div className="flex-1 text-center">
              <TeamAvatar equipe={match.participant2} />
              <p className="font-bold text-sm sm:text-base leading-tight">
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

        {/* Infos bas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-700 p-3 rounded-xl">
            <p className="text-green-200 text-xs mb-1">Tournoi</p>
            <p className="text-sm font-semibold leading-tight line-clamp-1">
              {match.tournoi?.Name ?? '—'}
            </p>
          </div>
          <div className="bg-green-700 p-3 rounded-xl">
            <p className="text-green-200 text-xs mb-1">Parties</p>
            <p className="text-lg font-bold">
              {match.parties?.length ?? 0}
              <span className="text-green-300 text-xs font-normal ml-1">
                joué{match.parties?.length > 1 ? 'es' : 'e'}
              </span>
            </p>
          </div>
        </div>

      </div>
    </Link>
  );
}