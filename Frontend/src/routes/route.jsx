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
import Reseaux from "../pages/Reseaux";
import Error404 from "../pages/ErrorPage";
import TournoiId from "../pages/TournoisId";

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
        path: "/teams",
        element: <Teams />
      },
      {
        path: "/reseaux",
        element: <Reseaux />
      }
    ]
  }
]);

export default router;
            