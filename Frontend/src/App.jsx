import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from "./Components/Navigation/Navigation";
import Footer from "./Components/Footer/Footer";
import { AuthProvider } from "./context/AuthContext";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Navigation />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
