import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Admin() {
  const [usuarios, setUsuarios] = useState([]);
  const [assinaturas, setAssinaturas] = useState([]);
  const [sinais, setSinais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const email = userData?.user?.email;

      if (email !== 'rokdama@gmail.com') {
        alert('Acesso restrito');
        return navigate('/');
      }

      const { data: u } = await supabase.from('usuarios').select('*');
      const { data: a } = await supabase.from('assinaturas').select('*');
      const { data: s } = await supabase.from('sinais').select('*').order('created_at', { ascending: false });

      setUsuarios(u || []);
      setAssinaturas(a || []);
      setSinais(s || []);
      setCarregando(false);
    };

    carregarDados();
  }, []);

  if (carregando) return <div className="p-6 text-white">Carregando painel...</div>;

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Painel Administrativo</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Usuários */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
            <h2 className="text-xl font-semibold mb-4">Usuários</h2>
            <ul className="text-sm text-blue-100 space-y-2 max-h-72 overflow-y-auto">
              {usuarios.map((u) => (
                <li key={u.id}>📧 {u.email}</li>
              ))}
            </ul>
          </div>

          {/* Assinaturas */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
            <h2 className="text-xl font-semibold mb-4">Assinaturas</h2>
            <ul className="text-sm text-blue-100 space-y-2 max-h-72 overflow-y-auto">
              {assinaturas.map((a) => (
                <li key={a.id}>
                  {a.email} → <span className="text-white font-bold">{a.plano}</span> ({a.status})
                </li>
              ))}
            </ul>
          </div>

          {/* Sinais */}
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow">
            <h2 className="text-xl font-semibold mb-4">Últimos Sinais</h2>
            <ul className="text-sm text-blue-100 space-y-2 max-h-72 overflow-y-auto">
              {sinais.map((s) => (
                <li key={s.id}>
                  {s.moeda} — <span className="text-green-400">{s.entry}</span> / <span className="text-yellow-300">{s.target}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
