import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modoLogin, setModoLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let result;

    if (modoLogin) {
        result = await supabase.auth.signInWithPassword({ email, password: senha });
    } else {
    result = await supabase.auth.signUp({ email, password: senha });
    if (!result.error) {
        await supabase.from('usuarios').upsert([{ email }]);
    }
}

    if (result.error) {
      alert(result.error.message);
    } else {
      navigate('/signals');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{modoLogin ? 'Entrar' : 'Cadastrar'}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          {modoLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>
      <button
        className="mt-4 text-sm text-blue-600 underline"
        onClick={() => setModoLogin(!modoLogin)}
      >
        {modoLogin ? 'Criar uma conta' : 'Já tem conta? Entrar'}
      </button>
    </div>
  );
}
