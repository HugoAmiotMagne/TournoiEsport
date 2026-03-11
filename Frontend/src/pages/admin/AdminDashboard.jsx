import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const cards = [
    { to: '/admin/tournois', label: 'Tournois', desc: 'Créer, modifier et supprimer des tournois', color: 'from-green-600 to-green-700' },
    { to: '/admin/matchs',   label: 'Matchs',   desc: 'Planifier et gérer les matchs',           color: 'from-yellow-500 to-yellow-600' },
    { to: '/admin/billets',  label: 'Billets',  desc: 'Créer et gérer les billets disponibles',  color: 'from-blue-600 to-blue-700' },
  ];

  return (
    <div className="min-h-screen bg-[#E8F5A8] px-6 py-12">
      <h1 className="text-4xl font-bold text-green-800 mb-2">Panneau administrateur</h1>
      <p className="text-green-700 mb-10">Gérez le contenu de la plateforme</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ to, label, desc, color }) => (
          <Link
            key={to}
            to={to}
            className={`bg-gradient-to-br ${color} rounded-2xl p-8 text-white shadow-xl hover:scale-[1.02] transition-transform`}
          >
            <h2 className="text-2xl font-bold mb-2">{label}</h2>
            <p className="text-white/80 text-sm">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
