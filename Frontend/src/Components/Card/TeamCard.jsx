import React from 'react';
import { Link } from 'react-router-dom';

export default function TeamCard({ equipe }) {
  return (
    <Link to={`/equipes/${equipe._id}`} className="block group">
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
        {/* En-tête : logo + nom */}
        <div className="flex items-center gap-4 mb-5">
          {equipe.logo ? (
            <img
              src={equipe.logo}
              alt={`Logo ${equipe.Name}`}
              className="w-14 h-14 rounded-full object-cover flex-shrink-0 border-2 border-yellow-400"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-green-800 border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
              <span className="text-yellow-300 font-black text-xl">
                {equipe.Name?.[0]?.toUpperCase() ?? '?'}
              </span>
            </div>
          )}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">{equipe.Name}</h2>
            <p className="text-green-200 text-xs mt-0.5">
              Créée le {new Date(equipe.date_creation).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>

        {/* Description */}
        <div
          className="bg-green-800 p-4 sm:p-5 mb-5 flex-1"
          style={{
            borderTopLeftRadius: '1rem',
            borderTopRightRadius: '0',
            borderBottomLeftRadius: '1rem',
            borderBottomRightRadius: '1rem',
          }}
        >
          {equipe.description ? (
            <>
              <h3 className="text-yellow-300 font-semibold mb-2 text-sm sm:text-base">Description :</h3>
              <p className="text-green-100 text-sm leading-relaxed line-clamp-3">
                {equipe.description}
              </p>
            </>
          ) : (
            <p className="text-green-400 text-sm italic">Aucune description.</p>
          )}
        </div>

        {/* Infos bas de carte */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-700 p-3 rounded-xl">
            <p className="text-green-200 text-xs mb-1">Capitaine</p>
            <p className="text-sm font-semibold leading-tight truncate">
              {equipe.capitaine?.username ?? equipe.capitaine?.email ?? '—'}
            </p>
          </div>
          <div className="bg-green-700 p-3 rounded-xl">
            <p className="text-green-200 text-xs mb-1">Membres</p>
            <p className="text-lg font-bold">
              {equipe.membres?.length ?? 0}
              <span className="text-green-300 text-xs font-normal ml-1">
                joueur{equipe.membres?.length > 1 ? 's' : ''}
              </span>
            </p>
          </div>
          {equipe.jeu_principal && (
            <div className="col-span-2 bg-green-700 p-3 rounded-xl flex items-center gap-2">
              <span className="text-yellow-300 text-sm">🎮</span>
              <div>
                <p className="text-green-200 text-xs">Jeu principal</p>
                <p className="text-sm font-semibold">
                  {equipe.jeu_principal.nom ?? equipe.jeu_principal.Name ?? '—'}
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </Link>
  );
}