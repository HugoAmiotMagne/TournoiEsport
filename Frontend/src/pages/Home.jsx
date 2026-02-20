import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { getTournois } from "../services/api";
import slide1 from "../assets/slide/photo-exterieur.jpg";
import slide2 from "../assets/slide/photo-ordi.jpg";
import slide3 from "../assets/slide/photo-du-bar.jpg";

const slides = [
  { src: slide1, alt: "Slide 1" },
  { src: slide2, alt: "Slide 2" },
  { src: slide3, alt: "Slide 3" },
];

const horaires = [
  { jour: "Lundi",    heures: "14h – 00h" },
  { jour: "Mardi",    heures: "14h – 00h" },
  { jour: "Mercredi", heures: "14h – 00h" },
  { jour: "Jeudi",    heures: "14h – 00h" },
  { jour: "Vendredi", heures: "14h – 02h" },
  { jour: "Samedi",   heures: "10h – 02h" },
  { jour: "Dimanche", heures: "10h – 00h" },
];

function ImageSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() =>
    setCurrent((c) => (c + 1) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full overflow-hidden shadow-xl select-none" style={{ height: "520px" }}>
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <img
            key={i}
            src={slide.src}
            alt={slide.alt}
            className="w-full flex-shrink-0 object-cover"
            style={{ height: "520px", minWidth: "100%" }}
          />
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "bg-yellow-400 w-5 h-2.5" : "bg-white/60 w-2.5 h-2.5"
            }`}
            aria-label={`Aller au slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function Home() {
  const [prochainsTournois, setProchainsTournois] = useState([]);

  useEffect(() => {
    getTournois()
      .then((data) => {
        const now = new Date();
        const upcoming = data
          .filter((t) => new Date(t.date_debut) >= now)
          .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut))
          .slice(0, 3);
        setProchainsTournois(upcoming);
      })
      .catch(console.error);
  }, []);

  const getStatutColor = (statut) => {
    if (statut === "en cours") return "text-yellow-300";
    if (statut === "à venir")  return "text-green-300";
    return "text-gray-300";
  };

  return (
    <div className="min-h-screen bg-[#E8F5A8] w-full font-sans">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Satisfy&display=swap');
        .font-script { font-family: 'Satisfy', cursive; }
      `}</style>

      {/* ── Bannière ── */}
      <div className="w-full bg-gradient-to-br from-green-600 to-green-700 py-12 sm:py-16 px-4 sm:px-8 text-center">
        <p className="text-gray-800 text-sm font-medium mb-2">
          {new Date().toLocaleDateString("fr-FR", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <h1 className="font-script text-5xl sm:text-6xl text-yellow-300 mb-3 drop-shadow-lg">
          Game Bar Hub
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 font-semibold">
          Bar et Lieu d'Esport
        </p>
      </div>

      {/* ── Slider ── */}
      <ImageSlider />

      {/* ── Grid Layout ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Colonne principale (2/3) ── */}
        <div className="lg:col-span-2 flex flex-col gap-8">

          {/* Section LAN */}
          <section className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-6 sm:p-8 shadow-lg text-white">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-3">
              Envie de faire une LAN ?
            </h2>
            <div className="bg-green-800 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl p-4 sm:p-5 mb-5">
              <p className="text-green-100 text-sm sm:text-base leading-relaxed">
                Organisez votre prochaine LAN party avec vos amis dans notre espace dédié.
                Nous disposons de postes haut de gamme, une connexion fibre, et une ambiance
                unique pour rendre chaque session mémorable. Réservez votre créneau
                et préparez-vous à jouer jusqu'à l'aube !
              </p>
            </div>
            <Link
              to="/tournois"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Liste Tournois
            </Link>
          </section>

          {/* Section Jouer */}
          <section className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-6 sm:p-8 shadow-lg text-white">
            <h2 className="text-2xl sm:text-3xl font-bold text-yellow-300 mb-3">
              Envie de jouer ?
            </h2>
            <div className="bg-green-800 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl p-4 sm:p-5 mb-5">
              <p className="text-green-100 text-sm sm:text-base leading-relaxed">
                Rejoignez l'une de nos équipes ou créez la vôtre pour participer
                aux compétitions locales et nationales. Que vous soyez débutant
                ou joueur confirmé, il y a une place pour vous dans la communauté
                Game Bar Hub. Le prochain tournoi commence bientôt !
              </p>
            </div>
            <Link
              to="/equipes"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-green-900 font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Créez Ton Équipe
            </Link>
          </section>

        </div>

        {/* ── Sidebar (1/3) ── */}
        <div className="flex flex-col gap-6">

          {/* Horaires */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-6 shadow-lg text-white">
            <h3 className="text-yellow-300 font-bold text-lg mb-4">Horaires d'ouverture</h3>
            <ul className="space-y-1.5">
              {horaires.map(({ jour, heures }) => (
                <li
                  key={jour}
                  className="flex justify-between items-center text-sm px-3 py-2 rounded-xl bg-green-800 text-green-100"
                >
                  <span>{jour}</span>
                  <span className="text-yellow-300 font-medium">{heures}</span>
                </li>
              ))}
            </ul>
            <p className="text-green-300 text-xs text-center mt-3">
              12 rue de l'Esport, Paris
            </p>
          </div>

          {/* Prochaines compétitions */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-tl-3xl rounded-bl-3xl rounded-br-3xl p-6 shadow-lg text-white">
            <h3 className="text-yellow-300 font-bold text-lg mb-4">Prochaines compétitions</h3>
            {prochainsTournois.length === 0 ? (
              <p className="text-green-200 text-sm text-center py-4">
                Aucune compétition à venir pour le moment.
              </p>
            ) : (
              <div className="space-y-3">
                {prochainsTournois.map((t) => {
                  const inscrits = t.inscriptions?.length ?? 0;
                  const placesRestantes = t.nombre_equipes_max - inscrits;
                  return (
                    <Link
                      key={t._id}
                      to={`/tournois/${t._id}`}
                      className="block bg-green-800 hover:bg-green-900 rounded-xl p-3 transition-colors duration-200 group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold text-sm group-hover:text-yellow-300 transition-colors leading-tight pr-2">
                          {t.Name}
                        </p>
                        <span className={`text-xs font-medium flex-shrink-0 ${getStatutColor(t.statut)}`}>
                          {t.statut}
                        </span>
                      </div>
                      <p className="text-green-300 text-xs mb-1.5">
                        {new Date(t.date_debut).toLocaleDateString("fr-FR", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-green-400 text-xs">
                          {placesRestantes > 0
                            ? `${placesRestantes} place${placesRestantes > 1 ? "s" : ""} restante${placesRestantes > 1 ? "s" : ""}`
                            : <span className="text-red-400">Complet</span>
                          }
                        </span>
                        <span className="text-yellow-300 text-xs font-medium">
                          {t.prix_inscription === 0 ? "Gratuit" : `${t.prix_inscription}€`}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
            <Link
              to="/tournois"
              className="mt-4 flex items-center justify-center gap-1 text-yellow-300 hover:text-yellow-200 text-xs font-medium transition-colors"
            >
              Voir tous les tournois
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

        </div>
      </div>

      {/* ── Citation + CTA pleine largeur ── */}
      <div className="w-full px-4 sm:px-8 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <blockquote className="text-green-900 font-bold text-2xl sm:text-3xl md:text-4xl leading-snug italic">
            "L'esport, c'est là où le jeu rassemble les esprits,<br className="hidden sm:block" /> et le bar unit les âmes !"
          </blockquote>
          <div className="mt-3 flex justify-center">
            <div className="w-20 h-1 bg-green-700 rounded-full" />
          </div>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold text-base px-10 py-4 rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg"
            >
              Contactez Nous !
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;