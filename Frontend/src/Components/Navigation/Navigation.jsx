import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <header className="bg-[#E8F5A8] shadow-2xl w-full sticky top-0 z-50">
      <nav className="w-full px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/GameBarHub.png" 
              alt="GameBarHub" 
              className="h-16 w-auto"
            />
          </Link>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-800 font-medium hover:text-green-700 transition duration-300"
            >
              Accueil
            </Link>
            <Link 
              to="/billetterie" 
              className="text-gray-800 font-medium hover:text-green-700 transition duration-300"
            >
              Billetterie
            </Link>
            <Link 
              to="/jeux" 
              className="text-gray-800 font-medium hover:text-green-700 transition duration-300"
            >
              Jeux
            </Link>
            <Link 
              to="/tournois" 
              className="text-gray-800 font-medium hover:text-green-700 transition duration-300"
            >
              Tournois
            </Link>
            <Link 
              to="/match" 
              className="text-gray-800 font-medium hover:text-green-700 transition duration-300"
            >
              Match
            </Link>
            <Link 
              to="/teams" 
              className="text-gray-800 font-medium hover:text-green-700 transition duration-300"
            >
              Teams
            </Link>
            <Link 
              to="/reseaux" 
              className="text-gray-800 font-medium hover:text-green-700 transition duration-300"
            >
              Réseaux
            </Link>
            
            {/* Boutons Login et Register si NON connecté */}
            {!isLoggedIn && (
              <>
                <button 
                  onClick={handleLogin} 
                  className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-800 transition duration-300 shadow-md"
                >
                  Connexion
                </button>
                <button 
                  onClick={handleRegister} 
                  className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-800 transition duration-300 shadow-md ml-2"
                >
                  Inscription
                </button>
              </>
            )}
            
            {/* Bouton Logout si connecté */}
            {isLoggedIn && (
              <button 
                onClick={handleLogout} 
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition duration-300 shadow-md"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}