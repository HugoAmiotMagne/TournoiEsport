import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from "./Components/Navigation/Navigation";
import Footer from "./Components/Footer/Footer";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  );
}