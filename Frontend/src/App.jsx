import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from "./Components/Navigation/Navigation";
import "./App.css";

export default function App() {
  return (
    <div className="App">
      <Navigation />
      <Outlet />
    </div>
  );
}