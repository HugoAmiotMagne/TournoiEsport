import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';


const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white w-full shadow-2xl">
      

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-10">
          {/* Brand section */}
          <div className="flex flex-col gap-4 max-w-xs">
            <h2 className="text-yellow-300 font-bold text-2xl tracking-wide">
              Game Bar Hub
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Nous sommes un bar reliant bonne ambiance, competitions et passion du gaming. Rejoignez-nous pour vivre des expériences inoubliables autour de votre passion !
            </p>
            <div className="flex items-center gap-6 mt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="text-yellow-300 hover:text-white transition-colors duration-200"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="text-yellow-300 hover:text-white transition-colors duration-200"
              >
                <XIcon />
              </a>
            </div>
          </div>

          {/* Links section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Navigation */}
            <div>
              <h3 className="text-yellow-300 font-semibold text-sm mb-4 uppercase tracking-wider">
                Navigation
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                <li>
                  <Link to="/" className="hover:text-white transition-colors duration-200">Accueil</Link>
                </li>
                <li>
                  <Link to="/tournois" className="hover:text-white transition-colors duration-200">Tournois</Link>
                </li>
                <li>
                  <Link to="/jeux" className="hover:text-white transition-colors duration-200">Jeux</Link>
                </li>
                <li>
                  <Link to="/teams" className="hover:text-white transition-colors duration-200">Équipes</Link>
                </li>
              </ul>
            </div>

            {/* Billetterie & Médias */}
            <div>
              <h3 className="text-yellow-300 font-semibold text-sm mb-4 uppercase tracking-wider">
                Billetterie & Médias
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                <li>
                  <Link to="/billetterie" className="hover:text-white transition-colors duration-200">Billetterie</Link>
                </li>
                <li>
                  <Link to="/streams" className="hover:text-white transition-colors duration-200">Streams</Link>
                </li>
                <li>
                  <Link to="/matchs" className="hover:text-white transition-colors duration-200">Matchs</Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-yellow-300 font-semibold text-sm mb-4 uppercase tracking-wider">
                Assistance
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                <li>
                  <Link to="/contact" className="hover:text-white transition-colors duration-200">Contact</Link>
                </li>
                <li>
                  <Link to="/aide" className="hover:text-white transition-colors duration-200">Aide</Link>
                </li>
                <li>
                  <Link to="/legal" className="hover:text-white transition-colors duration-200">Mentions légales</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-1 bg-yellow-300 w-full" />
    </footer>
  );
};

export default Footer;