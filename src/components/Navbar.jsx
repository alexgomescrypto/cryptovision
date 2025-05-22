import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';


export default function Navbar() {
  const [userEmail, setUserEmail] = useState(null);
  const [plano, setPlano] = useState('Sem Plano');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const fetchUserAndPlano = async (user) => {
    setUserEmail(user.email);

    const { data, error } = await supabase
      .from('assinaturas')
      .select('plano')
      .eq('email', user.email)
      .eq('status', 'ativo')
      .maybeSingle();

    if (data?.plano) {
      setPlano(data.plano);
    } else {
      setPlano('Sem Plano');
    }
  };

  // Chamada inicial ao montar
  supabase.auth.getUser().then(({ data: sessionData }) => {
    const user = sessionData.user;
    if (user) fetchUserAndPlano(user);
  });

  // Escuta mudanças de login/logout
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      fetchUserAndPlano(session.user);
    } else {
      setUserEmail(null);
      setPlano('Sem Plano');
    }
  });

  // Limpa o listener ao desmontar o componente
  return () => {
    listener.subscription.unsubscribe();
  };
}, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm fixed w-full z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link 
            to="/" 
            className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent hover:from-blue-500 hover:to-blue-700 transition-all duration-300"
          >
            CoinVision
          </Link>
          
          <button 
            className="md:hidden relative w-10 h-10 focus:outline-none group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 mb-1.5 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 mt-1.5 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </div>
          </button>

          <div className="hidden md:flex items-center space-x-1">
            {[
              { path: '/', label: 'Home' },
              { path: '/planos', label: 'Plans' },
              { path: '/statistics', label: 'Statistics' },
              { path: '/signals', label: 'Signals' },
              { path: '/support', label: 'Support' },
              ...(userEmail === 'rokdama@gmail.com' ? [{ path: '/admin', label: 'Admin' }] : []),
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {userEmail ? (
              <div className="flex items-center space-x-4 ml-4">
                <Link
                  to="/conta"
                  className="px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium text-blue-400 hover:bg-gray-700 transition-all duration-300"
                >
                  {plano} Plan
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-4 pb-3 space-y-3">
            {[
              { path: '/', label: 'Home' },
              { path: '/planos', label: 'Plans' },
              { path: '/statistics', label: 'Statistics' },
              { path: '/signals', label: 'Signals' },
              { path: '/support', label: 'Support' },
              ...(userEmail === 'rokdama@gmail.com' ? [{ path: '/admin', label: 'Admin' }] : []),
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {userEmail ? (
              <div className="space-y-3 pt-3 border-t border-gray-700">
                <Link
                  to="/conta"
                  className="block px-4 py-2 bg-gray-800 rounded-lg text-sm font-medium text-blue-400 hover:bg-gray-700 transition-all duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {plano} Plan
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}