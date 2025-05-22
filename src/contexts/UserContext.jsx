// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [plano, setPlano] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndPlano = async () => {
      const { data: sessionData, error } = await supabase.auth.getUser();
      const user = sessionData?.user;

      if (error || !user) {
        console.warn('❌ Usuário não autenticado.');
        setLoading(false);
        return;
      }

      setUser(user); // user contém .email e .id

      const { data, error: assinaturaError } = await supabase
        .from('assinaturas')
        .select('plano')
        .eq('email', user.email) // igual ao navbar
        .eq('status', 'ativo')
        .maybeSingle();

      if (assinaturaError) {
        console.error('Erro ao buscar plano:', assinaturaError.message);
      }

      if (data?.plano) {
        setPlano(data.plano.toLowerCase());
      } else {
        setPlano(null);
      }

      setLoading(false);
    };

    fetchUserAndPlano();
  }, []);

  return (
    <UserContext.Provider value={{ user, plano, loading }}>
      {children}
    </UserContext.Provider>
  );
};
