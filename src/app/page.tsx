import Link from 'next/link';
import { ArrowRight, Sparkles, Brain, LayoutDashboard, CheckSquare, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[150px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/40 backdrop-blur-md border-b border-zinc-900/60 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/10">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">VIBE</span>
          </div>

          <Link
            href="/login"
            className="flex items-center gap-1.5 py-1.5 px-4 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold shadow-sm transition duration-150 active:scale-95"
          >
            Entrar no Painel
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl w-full mx-auto px-6 py-16 md:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20">
              <Brain className="h-3.5 w-3.5 text-indigo-400" />
              Relatórios e Insights Gerados por Inteligência Artificial
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              A produtividade da sua equipe,{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-indigo-500 bg-clip-text text-transparent">
                resumida pela IA.
              </span>
            </h1>

            <p className="text-zinc-400 text-base md:text-lg max-w-xl leading-relaxed">
              Consolide as tarefas diárias e semanais da sua equipe em resumos executivos ricos de alto nível. Identifique gargalos instantaneamente e melhore a tomada de decisão com o poder do Gemini.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 py-3.5 px-7 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 transition duration-200 active:scale-98"
              >
                Começar Agora
                <ArrowRight className="h-4.5 w-4.5 text-white" />
              </Link>
            </div>
          </div>

          {/* Right Cards Visuals */}
          <div className="lg:col-span-5 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-3xl blur-2xl" />
            <div className="relative rounded-3xl bg-zinc-900/60 border border-zinc-800/80 p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-zinc-800/60">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-indigo-400" />
                  <span className="font-bold text-xs text-white uppercase tracking-wider">Insights Semanais</span>
                </div>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/10">
                  IA Ativa
                </span>
              </div>
              
              <div className="p-3.5 bg-zinc-950/60 border border-zinc-900 rounded-xl space-y-2">
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">Resumo Executivo</span>
                <p className="text-[11px] text-zinc-400 leading-normal">
                  "O departamento de desenvolvimento entregou a migração de banco de dados para PostgreSQL. Porém, o colaborador Bruno Souza está bloqueado na API do Stripe aguardando aprovação..."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="bg-zinc-950/60 p-3 border border-zinc-900 rounded-xl space-y-1">
                  <span className="text-zinc-500 block">Progresso</span>
                  <span className="text-white font-bold text-sm">82%</span>
                </div>
                <div className="bg-zinc-950/60 p-3 border border-zinc-900 rounded-xl space-y-1">
                  <span className="text-zinc-500 block">Gargalos Ativos</span>
                  <span className="text-amber-500 font-bold text-sm">1 Pendente</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 md:mt-28">
          <div className="rounded-2xl bg-zinc-900/30 border border-zinc-900 p-6 hover:border-zinc-800/60 transition duration-150">
            <LayoutDashboard className="h-8 w-8 text-indigo-400 mb-4" />
            <h3 className="text-base font-bold text-zinc-100 mb-2">Interface Dupla</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Telas customizadas para diretores visualizarem relatórios de alto nível e colaboradores registrarem tarefas rapidamente.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/30 border border-zinc-900 p-6 hover:border-zinc-800/60 transition duration-150">
            <CheckSquare className="h-8 w-8 text-violet-400 mb-4" />
            <h3 className="text-base font-bold text-zinc-100 mb-2">Logs Sem Fricção</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Membros registram suas entregas em segundos, especificando tempo de dedicação, status de progresso e categorias.
            </p>
          </div>

          <div className="rounded-2xl bg-zinc-900/30 border border-zinc-900 p-6 hover:border-zinc-800/60 transition duration-150">
            <ShieldCheck className="h-8 w-8 text-indigo-400 mb-4" />
            <h3 className="text-base font-bold text-zinc-100 mb-2">Ações Sugeridas</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              A IA indica pontos de atenção exatos, sugerindo passos operacionais para desbloquear gargalos na próxima semana.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-zinc-900/80 text-center text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} VIBE Productivity. Todos os direitos reservados.
      </footer>
    </div>
  );
}
