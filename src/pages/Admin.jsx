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

  if (carregando) return <div className="p-6">Carregando painel...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Usuários</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Criado em</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{new Date(u.criado_em).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Assinaturas</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Plano</th>
              <th className="border px-2 py-1">Status</th>
              <th className="border px-2 py-1">Data início</th>
            </tr>
          </thead>
          <tbody>
            {assinaturas.map((a) => (
              <tr key={a.id}>
                <td className="border px-2 py-1">{a.email}</td>
                <td className="border px-2 py-1">{a.plano}</td>
                <td className="border px-2 py-1">{a.status}</td>
                <td className="border px-2 py-1">{new Date(a.data_inicio).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Sinais</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Moeda</th>
              <th className="border px-2 py-1">Entrada</th>
              <th className="border px-2 py-1">Alvo</th>
              <th className="border px-2 py-1">Stop</th>
              <th className="border px-2 py-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {sinais.map((s) => (
              <tr key={s.id}>
                <td className="border px-2 py-1">{s.moeda}</td>
                <td className="border px-2 py-1">{s.entry}</td>
                <td className="border px-2 py-1">{s.target}</td>
                <td className="border px-2 py-1">{s.stop}</td>
                <td className="border px-2 py-1">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
