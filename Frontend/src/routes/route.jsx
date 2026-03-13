/* fichier root.jsx */
import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Error404 from "../pages/ErrorPage";
import Home from "../pages/Home";  // Pas de lazy sur la page principale (LCP critique)


const Login          = lazy(() => import("../pages/Login"));
const Logout         = lazy(() => import("../pages/Logout"));
const Register       = lazy(() => import("../pages/Register"));
const Billetterie    = lazy(() => import("../pages/Billetterie"));
const Jeux           = lazy(() => import("../pages/Jeux"));
const Tournois       = lazy(() => import("../pages/Tournois"));
const Match          = lazy(() => import("../pages/Match"));
const Teams          = lazy(() => import("../pages/Teams"));
const Inscription    = lazy(() => import("../pages/Inscription"));
const NewTeam        = lazy(() => import("../pages/NewTeams"));
const TournoiId      = lazy(() => import("../pages/TournoisId"));
const TeamsId        = lazy(() => import("../pages/TeamsId"));
const MatchId        = lazy(() => import("../pages/MatchId"));
const Profil         = lazy(() => import("../pages/Profil"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminTournois  = lazy(() => import("../pages/admin/AdminTournois"));
const AdminMatchs    = lazy(() => import("../pages/admin/AdminMatchs"));
const AdminBillets   = lazy(() => import("../pages/admin/AdminBillets"));
const AdminJeux      = lazy(() => import("../pages/admin/AdminJeux"));

const wrap = (Component) => (
  <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-[#E8F5A8]"><div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" /></div>}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      { path: "/",                        element: wrap(Home) },
      { path: "/login",                   element: wrap(Login) },
      { path: "/logout",                  element: wrap(Logout) },
      { path: "/profil",                  element: wrap(Profil) },
      { path: "/register",                element: wrap(Register) },
      { path: "/billetterie",             element: wrap(Billetterie) },
      { path: "/jeux",                    element: wrap(Jeux) },
      { path: "/tournois",                element: wrap(Tournois) },
      { path: "/tournois/:id",            element: wrap(TournoiId) },
      { path: "/match",                   element: wrap(Match) },
      { path: "/match/:id",               element: wrap(MatchId) },
      { path: "/teams",                   element: wrap(Teams) },
      { path: "/teams/:id",               element: wrap(TeamsId) },
      { path: "/teams/new",               element: wrap(NewTeam) },
      { path: "/inscription/tournois/:id", element: wrap(Inscription) },
      { path: "/admin",                   element: wrap(AdminDashboard) },
      { path: "/admin/tournois",          element: wrap(AdminTournois) },
      { path: "/admin/matchs",            element: wrap(AdminMatchs) },
      { path: "/admin/billets",           element: wrap(AdminBillets) },
      { path: "/admin/jeux",              element: wrap(AdminJeux) },
    ]
  }
]);

export default router;
            