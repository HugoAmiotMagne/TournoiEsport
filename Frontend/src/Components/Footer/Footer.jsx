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
            <h2 className="text-[#c8a832] font-bold text-2xl tracking-wide">
              Game Bar Hub
            </h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Nous sommes un bar reliant bonne ambiance, competitions et passion du gaming. Rejoignez-nous pour vivre des expériences inoubliables autour de votre passion !
            </p>
            <div className="flex items-center gap-6 mt-2">
              <a
                href="#"
                aria-label="Instagram"
                className="text-[#c8a832] hover:text-white transition-colors duration-200"
              >
                <InstagramIcon />
              </a>
              <a
                href="#"
                aria-label="Twitter / X"
                className="text-[#c8a832] hover:text-white transition-colors duration-200"
              >
                <XIcon />
              </a>
            </div>
          </div>

          {/* Links section */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Features */}
            <div>
              <h3 className="text-[#c8a832] font-semibold text-sm mb-4 uppercase tracking-wider">
                Features
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                {["Core features", "Pro experience", "Integrations"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors duration-200"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Learn more */}
            <div>
              <h3 className="text-[#c8a832] font-semibold text-sm mb-4 uppercase tracking-wider">
                Learn more
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                {["Blog", "Case studies", "Customer stories", "Best practices"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-white transition-colors duration-200"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-[#c8a832] font-semibold text-sm mb-4 uppercase tracking-wider">
                Support
              </h3>
              <ul className="flex flex-col gap-2 text-sm text-white/80">
                {["Contact", "Support", "Legal"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-white transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-1 bg-[#c8a832] w-full" />
    </footer>
  );
};

export default Footer;