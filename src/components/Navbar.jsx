import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Navbar() {
  const [userEmail, setUserEmail] = useState(null);
  const [plano, setPlano] = useState('Sem Plano');
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
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">CoinVision</h1>
      <div className="space-x-4">
        <Link to="/">Home</Link>
        <Link to="/planos">Planos</Link>
        <Link to="/statistics">Estatísticas</Link>
        <Link to="/signals">Sinais</Link>
        <Link to="/support">Suporte</Link>
        <Link to="/admin">Admin</Link>
        <Link to="/conta">Minha Conta</Link>
        {userEmail ? (
          <>
            <span className="text-sm">Logado: {userEmail}</span>
            <span className="text-sm">Plano: {plano}</span>
            <button onClick={handleLogout} className="ml-2 underline">
              Sair
            </button>
          </>
        ) : (
          <Link to="/login">Entrar</Link>
        )}
      </div>
    </nav>
  );
}
