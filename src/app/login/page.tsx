'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Lock, Mail, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Credenciais inválidas ou incorretas.');
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('Ocorreu um erro no servidor. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-zinc-950 px-4">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[140px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md z-10 transition-all duration-300">
        {/* Logo/Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 ring-1 ring-white/10 mb-4 animate-pulse">
            <LayoutDashboard className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-zinc-50 via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            VIBE
          </h1>
          <p className="text-sm text-zinc-400 mt-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-violet-400" />
            Gestão de Produtividade com Inteligência Artificial
          </p>
        </div>

        {/* Card */}
        <div className="relative rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-8 shadow-2xl backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent rounded-3xl pointer-events-none" />
          
          <h2 className="text-xl font-semibold text-zinc-100 mb-6 text-center">
            Bem-vindo de volta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs font-medium text-red-400 animate-shake">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Endereço de E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="exemplo@vibe.com"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 bg-zinc-950/80 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/80 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-950 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Autenticando...
                </>
              ) : (
                <>
                  Acessar Painel
                </>
              )}
            </button>
          </form>

          {/* Test credentials info banner */}
          <div className="mt-8 pt-6 border-t border-zinc-800/60 text-center">
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider mb-2 font-semibold">
              Credenciais de Demonstração
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
              <div className="bg-zinc-950/40 p-2 border border-zinc-800/40 rounded-lg">
                <span className="block font-bold text-indigo-400">carlos@vibe.com</span>
                Diretor (Manager)
              </div>
              <div className="bg-zinc-950/40 p-2 border border-zinc-800/40 rounded-lg">
                <span className="block font-bold text-violet-400">bruno@vibe.com</span>
                Desenvolvedor (Staff)
              </div>
            </div>
            <p className="text-[9px] text-zinc-600 mt-2">
              Senha para ambos: <code className="bg-zinc-950 px-1 py-0.5 rounded text-zinc-500 border border-zinc-900">password123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
