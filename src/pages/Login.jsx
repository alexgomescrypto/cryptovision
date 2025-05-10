import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modoLogin, setModoLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
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
        throw result.error;
      }
      navigate('/signals');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            {modoLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="mt-2 text-gray-400">
            {modoLogin 
              ? 'Enter your credentials to access your account' 
              : 'Sign up to start receiving trading signals'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white text-lg font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>{modoLogin ? 'Sign In' : 'Create Account'}</span>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setModoLogin(!modoLogin)}
            className="text-blue-400 hover:text-blue-300 font-medium transition duration-200"
          >
            {modoLogin 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}