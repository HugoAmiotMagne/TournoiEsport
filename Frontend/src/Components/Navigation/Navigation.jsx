import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gameBarHubLogo from '../../assets/GameBarHub.png';

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleRegister = () => {
    navigate('/register');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-[#E8F5A8] shadow-2xl w-full sticky top-0 z-50">
      <nav className="w-full px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={gameBarHubLogo}
              alt="GameBarHub"
              className="h-14 w-auto"
            />
          </Link>

          {/* Bouton Burger (mobile) */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Menu Desktop */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks />

            {!isLoggedIn ? (
              <>
                <Button onClick={handleLogin}>Connexion</Button>
                <Button onClick={handleRegister}>Inscription</Button>
              </>
            ) : (
              <Button onClick={handleLogout} color="red">
                Déconnexion
              </Button>
            )}
          </div>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 flex flex-col gap-4">
            <NavLinks mobile onClick={() => setIsMenuOpen(false)} />

            {!isLoggedIn ? (
              <>
                <Button onClick={handleLogin} full>
                  Connexion
                </Button>
                <Button onClick={handleRegister} full>
                  Inscription
                </Button>
              </>
            ) : (
              <Button onClick={handleLogout} color="red" full>
                Déconnexion
              </Button>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

/* Liens de navigation */
function NavLinks({ mobile = false, onClick }) {
  const baseClass =
    'text-gray-800 font-medium hover:text-green-700 transition duration-300';

  const mobileClass = mobile
    ? 'block py-2 border-b border-gray-200'
    : '';

  return (
    <>
      {[
        ['/', 'Accueil'],
        ['/billetterie', 'Billetterie'],
        ['/jeux', 'Jeux'],
        ['/tournois', 'Tournois'],
        ['/match', 'Match'],
        ['/teams', 'Teams'],
      ].map(([path, label]) => (
        <Link
          key={path}
          to={path}
          onClick={onClick}
          className={`${baseClass} ${mobileClass}`}
        >
          {label}
        </Link>
      ))}
    </>
  );
}

/* Bouton réutilisable */
function Button({ children, onClick, color = 'green', full = false }) {
  const colors = {
    green: 'bg-green-700 hover:bg-green-800',
    red: 'bg-red-600 hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${colors[color]}
        text-white px-6 py-2.5 rounded-lg font-medium
        transition duration-300 shadow-md
        ${full ? 'w-full' : ''}
      `}
    >
      {children}
    </button>
  );
}
