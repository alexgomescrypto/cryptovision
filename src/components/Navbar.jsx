import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const [userEmail, setUserEmail] = useState(null);
  const [plano, setPlano] = useState('Sem Plano');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: sessionData } = await supabase.auth.getUser();
      const user = sessionData.user;
      if (user) {
        setUserEmail(user.email);

        const { data, error } = await supabase
          .from('assinaturas')
          .select('plano')
          .eq('email', user.email)
          .eq('status', 'ativo')
          .maybeSingle();

        if (data && data.plano) {
          setPlano(data.plano);
        }
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">CoinVision</Link>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-400 transition duration-300">Home</Link>
            <Link to="/planos" className="hover:text-blue-400 transition duration-300">Plans</Link>
            <Link to="/statistics" className="hover:text-blue-400 transition duration-300">Statistics</Link>
            <Link to="/signals" className="hover:text-blue-400 transition duration-300">Signals</Link>
            <Link to="/support" className="hover:text-blue-400 transition duration-300">Support</Link>
            {userEmail === 'rokdama@gmail.com' && (
              <Link to="/admin" className="hover:text-blue-400 transition duration-300">Admin</Link>
            )}
            {userEmail ? (
              <div className="flex items-center space-x-4">
                <Link to="/conta" className="text-sm bg-gray-700 px-3 py-1 rounded">
                  {plano} Plan
                </Link>
                <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-300">
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link to="/" className="block hover:text-blue-400">Home</Link>
            <Link to="/planos" className="block hover:text-blue-400">Plans</Link>
            <Link to="/statistics" className="block hover:text-blue-400">Statistics</Link>
            <Link to="/signals" className="block hover:text-blue-400">Signals</Link>
            <Link to="/support" className="block hover:text-blue-400">Support</Link>
            {userEmail === 'rokdama@gmail.com' && (
              <Link to="/admin" className="block hover:text-blue-400">Admin</Link>
            )}
            {userEmail ? (
              <>
                <Link to="/conta" className="block text-sm bg-gray-700 px-3 py-1 rounded inline-block">
                  {plano} Plan
                </Link>
                <button onClick={handleLogout} className="block text-sm text-red-400 hover:text-red-300 mt-4">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition duration-300">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}