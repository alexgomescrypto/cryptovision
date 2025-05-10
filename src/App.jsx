import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Planos from './pages/Planos';
import Statistics from './pages/Statistics';
import Signals from './pages/Signals';
import Support from './pages/Support';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Conta from './pages/Conta';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/signals" element={<Signals />} />
        <Route path="/support" element={<Support />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/conta" element={<Conta />} />
      </Routes>
    </Router>
  );
}
