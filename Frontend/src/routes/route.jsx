/* fichier root.jsx */
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Logout from "../pages/Logout";
import Register from "../pages/Register";
import Billetterie from "../pages/Billetterie";
import Jeux from "../pages/Jeux";
import Tournois from "../pages/Tournois";
import Match from "../pages/Match";
import Teams from "../pages/Teams";
import Error404 from "../pages/ErrorPage";
import Inscription from "../pages/Inscription";
import NewTeam from "../pages/NewTeams";
import TournoiId from "../pages/TournoisId";
import TeamsId from "../pages/TeamsId";
import MatchId from "../pages/MatchId";
import Profil from "../pages/Profil";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminTournois from "../pages/admin/AdminTournois";
import AdminMatchs from "../pages/admin/AdminMatchs";
import AdminBillets from "../pages/admin/AdminBillets";
import AdminJeux from "../pages/admin/AdminJeux";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/logout",
        element: <Logout />
      },
      {
        path: "/profil",
        element: <Profil />
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/billetterie",
        element: <Billetterie />
      },
      {
        path: "/jeux",
        element: <Jeux />
      },
      {
        path: "/tournois",
        element: <Tournois />
      },
      {
        path: "/tournois/:id",
        element: <TournoiId />
      },
      {
        path: "/match",
        element: <Match />
      },
      {
        path: "/match/:id",
        element: <MatchId />
      },
      {
        path: "/teams",
        element: <Teams />
      },
      {
        path: "/teams/:id",
        element: <TeamsId />
      },
      {
        path: "/teams/new",
        element: <NewTeam />
      },
      {
        path: "/inscription/tournois/:id",
        element: <Inscription />
      },
      {
        path: "/admin",
        element: <AdminDashboard />
      },
      {
        path: "/admin/tournois",
        element: <AdminTournois />
      },
      {
        path: "/admin/matchs",
        element: <AdminMatchs />
      },
      {
        path: "/admin/billets",
        element: <AdminBillets />
      },
      {
        path: "/admin/jeux",
        element: <AdminJeux />
      }
    ]
  }
]);

export default router;
            