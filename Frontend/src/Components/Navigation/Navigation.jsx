import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gameBarHubLogo from '../../assets/GameBarHub.png';
import Bouton from '../UI/Bouton';
import { useAuth } from '../../context/AuthContext';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin    = () => { navigate('/login');    setIsMenuOpen(false); };
  const handleRegister = () => { navigate('/register'); setIsMenuOpen(false); };
  const handleProfil   = () => { navigate('/profil');   setIsMenuOpen(false); };
  const handleAdmin    = () => { navigate('/admin');    setIsMenuOpen(false); };
  const handleLogout   = () => { logout(); navigate('/'); setIsMenuOpen(false); };

  return (
    <header className="bg-[#E8F5A8] shadow-2xl w-full sticky top-0 z-50">
      <nav className="w-full px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={gameBarHubLogo} alt="GameBarHub" className="h-14 w-auto" width="56" height="56" fetchpriority="high" />
          </Link>

          {/* Burger (mobile) */}
          <button
            className="md:hidden text-gray-800 focus:outline-none p-3 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />
            {!isLoggedIn ? (
              <>
                <Bouton onClick={handleLogin}>Connexion</Bouton>
                <Bouton onClick={handleRegister}>Inscription</Bouton>
              </>
            ) : (
              <>
                {isAdmin && <Bouton onClick={handleAdmin} color="yellow">Admin</Bouton>}
                <Bouton onClick={handleProfil}>Profil</Bouton>
                <Bouton onClick={handleLogout} color="red">Déconnexion</Bouton>
              </>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden mt-6 flex flex-col gap-4">
            <NavLinks mobile onClick={() => setIsMenuOpen(false)} />
            {!isLoggedIn ? (
              <>
                <Bouton onClick={handleLogin} full>Connexion</Bouton>
                <Bouton onClick={handleRegister} full>Inscription</Bouton>
              </>
            ) : (
              <>
                {isAdmin && <Bouton onClick={handleAdmin} color="yellow" full>Admin</Bouton>}
                <Bouton onClick={handleProfil} color="green" full>Profil</Bouton>
                <Bouton onClick={handleLogout} color="red" full>Déconnexion</Bouton>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLinks({ mobile = false, onClick }) {
  const base    = 'text-gray-800 font-medium hover:text-green-700 transition duration-300';
  const mobile_ = mobile ? 'block py-2 border-b border-gray-200' : '';

  return (
    <>
      {[
        ['/',            'Accueil'],
        ['/billetterie', 'Billetterie'],
        ['/jeux',        'Jeux'],
        ['/tournois',    'Tournois'],
        ['/match',       'Match'],
        ['/teams',       'Teams'],
      ].map(([path, label]) => (
        <Link key={path} to={path} onClick={onClick} className={`${base} ${mobile_}`}>
          {label}
        </Link>
      ))}
    </>
  );
}
