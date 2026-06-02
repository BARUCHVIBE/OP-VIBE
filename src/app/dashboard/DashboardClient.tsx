'use client';

import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Session } from 'next-auth';
import {
  Sparkles,
  LogOut,
  User,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FolderOpen,
  Send,
  Calendar,
  Briefcase,
  Users,
  CheckSquare,
  TrendingUp,
  Brain,
  ChevronRight,
  RefreshCw,
  UserPlus,
  Mail,
  Lock,
} from 'lucide-react';
import {
  mockTasks,
  mockReports,
  mockUsers,
  MockTask,
  MockReport,
  simulateGeminiReport,
} from '@/lib/mockData';

interface DashboardClientProps {
  session: Session;
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const user = session.user;
  const isManager = user.role === 'MANAGER' || user.role === 'ADMIN';

  // State
  const [tasks, setTasks] = useState<MockTask[]>([]);
  const [reports, setReports] = useState<MockReport[]>([]);
  const [activeReport, setActiveReport] = useState<MockReport | null>(null);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  // Tab states for Manager
  const [managerTab, setManagerTab] = useState<'overview' | 'tasks' | 'team'>('overview');

  // Form states for adding tasks (Employee)
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState('DEV');
  const [taskStatus, setTaskStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED'>('TODO');
  const [taskHours, setTaskHours] = useState(4);
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);

  // Form states for adding members (Manager)
  const [memberName, setMemberName] = useState('');
  const [memberEmail, setMemberEmail] = useState('');
  const [memberPassword, setMemberPassword] = useState('Vibe@123');
  const [memberRole, setMemberRole] = useState<'EMPLOYEE' | 'MANAGER' | 'ADMIN'>('EMPLOYEE');
  const [memberDept, setMemberDept] = useState('d1');
  const [memberMessage, setMemberMessage] = useState<string | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [memberLoading, setMemberLoading] = useState(false);

  // Loading/Trigger states
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize data
  useEffect(() => {
    setTasks(mockTasks);
    setReports(mockReports);
    setTeamMembers(mockUsers);
    if (mockReports.length > 0) {
      setActiveReport(mockReports[0]);
    }
  }, []);

  // Handler: Add task (local preview mode)
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask: MockTask = {
      id: 't-' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      user: { name: user.name || 'Colaborador' },
      title: taskTitle,
      description: taskDesc,
      status: taskStatus,
      category: taskCategory,
      taskDate: taskDate,
      estimatedHours: Number(taskHours),
    };

    setTasks([newTask, ...tasks]);
    
    // Reset form
    setTaskTitle('');
    setTaskDesc('');
    setTaskStatus('TODO');
    setTaskCategory('DEV');
    setTaskHours(4);
  };

  // Handler: Add team member (Manager UI)
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setMemberMessage(null);
    setMemberError(null);
    setMemberLoading(true);

    const payload = {
      name: memberName,
      email: memberEmail,
      role: memberRole,
      departmentId: memberDept,
      password: memberPassword,
    };

    try {
      // Tentar cadastrar no backend via API
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao processar requisição');
      }

      // Sucesso no banco
      setMemberMessage('Funcionário cadastrado com sucesso!');
      
      // Adicionar à lista visual local
      const newMember = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        departmentId: data.user.departmentId,
      };
      setTeamMembers([...teamMembers, newMember]);
      
      // Resetar formulário
      setMemberName('');
      setMemberEmail('');
      setMemberPassword('Vibe@123');
    } catch (err: any) {
      console.warn("API User creation failed. Simulating user registration locally in Sandbox mode.");
      
      // Sandbox fallback mode - simular sucesso visual localmente
      const mockId = 'u-' + Math.random().toString(36).substr(2, 9);
      const simulatedMember = {
        id: mockId,
        name: memberName,
        email: memberEmail,
        role: memberRole,
        departmentId: memberDept,
      };

      setTeamMembers([...teamMembers, simulatedMember]);
      setMemberMessage('Membro cadastrado com sucesso (Modo Sandbox)!');
      
      // Resetar formulário
      setMemberName('');
      setMemberEmail('');
      setMemberPassword('Vibe@123');
    } finally {
      setMemberLoading(false);
    }
  };

  // Handler: Generate Report via IA
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const aiInsights = await simulateGeminiReport(tasks);
      
      const newReport: MockReport = {
        id: 'r-' + Math.random().toString(36).substr(2, 9),
        departmentId: user.departmentId || 'd1',
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        executiveSummary: aiInsights.executiveSummary,
        aiInsights: aiInsights,
        createdAt: new Date().toISOString(),
      };

      setReports([newReport, ...reports]);
      setActiveReport(newReport);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const blockedTasks = tasks.filter((t) => t.status === 'BLOCKED').length;
  const teamMembersCount = teamMembers.length || 4;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans">
      {/* Dynamic BG blobs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/60 backdrop-blur-xl border-b border-zinc-800/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md shadow-indigo-500/10">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white">VIBE</span>
              <span className="ml-2 text-xs bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded-full border border-indigo-500/10">
                AI Productivity
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5 px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 flex items-center justify-center text-zinc-300">
                <User className="h-3.5 w-3.5" />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-zinc-200">{user.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">
                  {isManager ? 'Gestor' : 'Colaborador'}
                </p>
              </div>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-200 transition duration-150 active:scale-95"
              title="Sair do Sistema"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 z-10">
        {isManager ? (
          /* ========================================================
             MANAGER DASHBOARD
             ======================================================== */
          <div className="space-y-8 animate-fadeIn">
            {/* Greetings & Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white">
                  Painel Executivo
                </h1>
                <p className="text-zinc-400 text-sm mt-1">
                  Resumos executivos baseados em inteligência artificial e diagnósticos de tarefas.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="flex items-center gap-2 py-2.5 px-5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition-all duration-200 disabled:opacity-50 active:scale-95 group"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin text-white" />
                      Analisando com IA...
                    </>
                  ) : (
                    <>
                      <Brain className="h-4 w-4 text-white" />
                      Gerar Relatório IA
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-zinc-900/40 border border-zinc-900 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3 text-zinc-500">
                  <span className="text-xs uppercase font-bold tracking-wider">Total de Tarefas</span>
                  <FolderOpen className="h-4 w-4 text-indigo-400" />
                </div>
                <p className="text-3xl font-bold text-white">{totalTasks}</p>
                <p className="text-[10px] text-zinc-500 mt-1">Registradas nesta semana</p>
              </div>

              <div className="rounded-2xl bg-zinc-900/40 border border-zinc-900 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3 text-zinc-500">
                  <span className="text-xs uppercase font-bold tracking-wider">Concluídas</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-bold text-white">{completedTasks}</p>
                <p className="text-[10px] text-emerald-500/80 mt-1 font-medium">
                  {totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}% de progresso
                </p>
              </div>

              <div className="rounded-2xl bg-zinc-900/40 border border-zinc-900 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3 text-zinc-500">
                  <span className="text-xs uppercase font-bold tracking-wider">Gargalos / Bloqueios</span>
                  <AlertTriangle className={`h-4 w-4 ${blockedTasks > 0 ? 'text-amber-500 animate-bounce' : 'text-zinc-500'}`} />
                </div>
                <p className="text-3xl font-bold text-white">{blockedTasks}</p>
                <p className="text-[10px] text-zinc-500 mt-1">Sinalizados por colaboradores</p>
              </div>

              <div className="rounded-2xl bg-zinc-900/40 border border-zinc-900 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3 text-zinc-500">
                  <span className="text-xs uppercase font-bold tracking-wider">Equipe Ativa</span>
                  <Users className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-3xl font-bold text-white">{teamMembersCount}</p>
                <p className="text-[10px] text-zinc-500 mt-1">Colaboradores ativos</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-zinc-800/80">
              <button
                onClick={() => setManagerTab('overview')}
                className={`py-3 px-6 text-sm font-semibold border-b-2 transition duration-150 -mb-[2px] ${
                  managerTab === 'overview'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Resumo da IA e Análises
              </button>
              <button
                onClick={() => setManagerTab('tasks')}
                className={`py-3 px-6 text-sm font-semibold border-b-2 transition duration-150 -mb-[2px] ${
                  managerTab === 'tasks'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Banco de Tarefas
              </button>
              <button
                onClick={() => setManagerTab('team')}
                className={`py-3 px-6 text-sm font-semibold border-b-2 transition duration-150 -mb-[2px] ${
                  managerTab === 'team'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Gerenciar Equipe
              </button>
            </div>

            {/* Tab Contents */}
            {managerTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Executive Report */}
                <div className="lg:col-span-2 space-y-6">
                  {activeReport ? (
                    <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800/80 p-6 md:p-8 shadow-xl backdrop-blur-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-violet-500/0 rounded-bl-3xl pointer-events-none" />

                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2.5">
                          <Brain className="h-5.5 w-5.5 text-indigo-400" />
                          <h2 className="text-xl font-bold text-white">Relatório Analítico Semanal</h2>
                        </div>
                        <span className="text-xs text-zinc-400 bg-zinc-950/80 border border-zinc-800/60 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                          {activeReport.startDate} até {activeReport.endDate}
                        </span>
                      </div>

                      {/* Executive Summary */}
                      <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
                          Resumo Executivo
                        </h3>
                        <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line bg-zinc-950/30 p-4 border border-zinc-900 rounded-2xl">
                          {activeReport.executiveSummary}
                        </p>
                      </div>

                      {/* Collaborators Highlights */}
                      <div className="mb-8">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-400 mb-4">
                          Desempenho por Colaborador
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {activeReport.aiInsights.collaborators.map((colab, i) => (
                            <div
                              key={i}
                              className="p-4 bg-zinc-950/60 border border-zinc-800/50 rounded-2xl hover:border-zinc-800 transition duration-150"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <span className="font-semibold text-zinc-200 text-sm">{colab.name}</span>
                                <div className="flex gap-1 text-[10px]">
                                  <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/10">
                                    {colab.completedCount} entregas
                                  </span>
                                  {colab.pendingCount > 0 && (
                                    <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                                      {colab.pendingCount} pendentes
                                    </span>
                                  )}
                                </div>
                              </div>
                              <ul className="space-y-1.5">
                                {colab.highlights.map((h, k) => (
                                  <li key={k} className="text-xs text-zinc-400 flex items-start gap-1.5">
                                    <span className="text-indigo-400 mt-1 select-none">•</span>
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottlenecks */}
                      <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" />
                          Pontos de Atenção & Gargalos
                        </h3>
                        <ul className="space-y-2">
                          {activeReport.aiInsights.bottlenecks.map((b, i) => (
                            <li key={i} className="text-xs text-zinc-300 flex items-start gap-2">
                              <span className="text-amber-500 mt-1">•</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-dashed border-zinc-800 p-12 text-center flex flex-col items-center">
                      <Brain className="h-10 w-10 text-zinc-600 mb-3 animate-pulse" />
                      <p className="text-zinc-400 font-semibold text-sm">Sem relatórios disponíveis</p>
                      <p className="text-zinc-500 text-xs mt-1 mb-4">Gerencie tarefas e clique em "Gerar Relatório IA".</p>
                    </div>
                  )}
                </div>

                {/* Recommendations and History */}
                <div className="space-y-6">
                  {/* Action Items */}
                  {activeReport && (
                    <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800/80 p-6 shadow-xl backdrop-blur-lg">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4 flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4" />
                        Recomendações de Ação
                      </h3>
                      <ul className="space-y-3">
                        {activeReport.aiInsights.actionItems.map((action, i) => (
                          <li
                            key={i}
                            className="p-3 bg-zinc-950/60 border border-zinc-900 rounded-xl flex items-start gap-3 hover:border-zinc-800/60 transition duration-150 group"
                          >
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold group-hover:scale-105 transition duration-150">
                              {i + 1}
                            </span>
                            <span className="text-xs text-zinc-300 leading-normal">{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Historical Reports List */}
                  <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800/80 p-6 shadow-xl backdrop-blur-lg">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
                      Histórico de Relatórios
                    </h3>
                    <div className="space-y-2">
                      {reports.map((rep) => (
                        <button
                          key={rep.id}
                          onClick={() => setActiveReport(rep)}
                          className={`w-full text-left p-3.5 rounded-xl border transition duration-150 flex items-center justify-between ${
                            activeReport?.id === rep.id
                              ? 'bg-indigo-500/10 border-indigo-500/30 text-white'
                              : 'bg-zinc-950/40 border-zinc-900 hover:border-zinc-800 text-zinc-400'
                          }`}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-zinc-200">
                              Relatório Semanal
                            </span>
                            <span className="text-[10px] text-zinc-500">
                              {rep.startDate} - {rep.endDate}
                            </span>
                          </div>
                          <ChevronRight className="h-4.5 w-4.5 text-zinc-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {managerTab === 'tasks' && (
              /* Manager view: Tasks List */
              <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800/80 p-6 shadow-xl backdrop-blur-lg overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-base font-bold text-white">Tarefas da Equipe</h3>
                  <span className="text-xs bg-zinc-950 text-zinc-400 px-3 py-1.5 border border-zinc-900 rounded-xl">
                    {tasks.length} itens encontrados
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-zinc-800/60 text-zinc-500 uppercase tracking-wider font-bold">
                        <th className="pb-3 pr-4">Colaborador</th>
                        <th className="pb-3 pr-4">Título</th>
                        <th className="pb-3 pr-4">Categoria</th>
                        <th className="pb-3 pr-4">Data</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3">Esforço</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                      {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-zinc-950/40 group">
                          <td className="py-3.5 pr-4 font-semibold text-zinc-200">{task.user.name}</td>
                          <td className="py-3.5 pr-4">
                            <span className="text-zinc-300 font-medium block">{task.title}</span>
                            <span className="text-zinc-500 text-[10px] block mt-0.5">{task.description}</span>
                          </td>
                          <td className="py-3.5 pr-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 uppercase">
                              {task.category}
                            </span>
                          </td>
                          <td className="py-3.5 pr-4 text-zinc-400">{task.taskDate}</td>
                          <td className="py-3.5 pr-4">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                                task.status === 'DONE'
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : task.status === 'IN_PROGRESS'
                                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                  : task.status === 'BLOCKED'
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                                  : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                              }`}
                            >
                              {task.status === 'DONE' && 'Concluído'}
                              {task.status === 'IN_PROGRESS' && 'Em Progresso'}
                              {task.status === 'BLOCKED' && 'Bloqueado'}
                              {task.status === 'TODO' && 'A Fazer'}
                            </span>
                          </td>
                          <td className="py-3.5 text-zinc-400">{task.estimatedHours} hrs</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {managerTab === 'team' && (
              /* Manager view: Team management */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form column */}
                <div className="lg:col-span-1">
                  <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800/80 p-6 shadow-xl backdrop-blur-lg">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                        <UserPlus className="h-4 w-4 text-indigo-400" />
                      </div>
                      <h2 className="text-lg font-bold text-white">Cadastrar Membro</h2>
                    </div>

                    <form onSubmit={handleAddMember} className="space-y-4">
                      {memberMessage && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-400 font-medium animate-fadeIn">
                          {memberMessage}
                        </div>
                      )}
                      {memberError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-xs text-red-400 font-medium animate-shake">
                          {memberError}
                        </div>
                      )}

                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Nome Completo
                        </label>
                        <input
                          type="text"
                          value={memberName}
                          onChange={(e) => setMemberName(e.target.value)}
                          required
                          placeholder="Ex: João Souza"
                          className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition duration-150"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          E-mail Corporativo
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                          <input
                            type="email"
                            value={memberEmail}
                            onChange={(e) => setMemberEmail(e.target.value)}
                            required
                            placeholder="exemplo@vibe.com"
                            className="block w-full pl-10 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition duration-150"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Senha Provisória
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                          <input
                            type="text"
                            value={memberPassword}
                            onChange={(e) => setMemberPassword(e.target.value)}
                            required
                            className="block w-full pl-10 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition duration-150"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                            Cargo / Nível
                          </label>
                          <select
                            value={memberRole}
                            onChange={(e) => setMemberRole(e.target.value as any)}
                            className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition duration-150"
                          >
                            <option value="EMPLOYEE">Colaborador</option>
                            <option value="MANAGER">Gestor</option>
                            <option value="ADMIN">Admin</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                            Departamento
                          </label>
                          <select
                            value={memberDept}
                            onChange={(e) => setMemberDept(e.target.value)}
                            className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition duration-150"
                          >
                            <option value="d1">Tecnologia da Informação</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={memberLoading}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition duration-150 active:scale-98"
                      >
                        {memberLoading ? 'Cadastrando...' : 'Cadastrar Membro'}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Team members list column */}
                <div className="lg:col-span-2">
                  <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800/80 p-6 shadow-xl backdrop-blur-lg">
                    <h3 className="text-base font-bold text-white mb-4">Membros Cadastrados</h3>
                    <div className="space-y-3">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-4 bg-zinc-950/50 border border-zinc-900 rounded-2xl flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500/15 to-violet-500/15 border border-indigo-500/10 flex items-center justify-center text-indigo-400 text-xs font-semibold uppercase">
                              {member.name.substring(0, 2)}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-zinc-200">{member.name}</p>
                              <p className="text-[10px] text-zinc-500">{member.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400 uppercase font-semibold">
                              {member.role === 'EMPLOYEE' && 'Staff'}
                              {member.role === 'MANAGER' && 'Gestor'}
                              {member.role === 'ADMIN' && 'Admin'}
                            </span>
                            <span className="text-[9px] text-zinc-600">
                              ID: {member.id.substring(0, 5)}...
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ========================================================
             EMPLOYEE PORTAL
             ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            {/* Task logger form */}
            <div className="lg:col-span-1">
              <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800/80 p-6 shadow-xl backdrop-blur-lg sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-7 w-7 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                    <Plus className="h-4 w-4 text-indigo-400" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Registrar Atividade</h2>
                </div>

                <form onSubmit={handleAddTask} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Título da Tarefa
                    </label>
                    <input
                      type="text"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                      placeholder="Ex: Refatorar fluxo de login"
                      className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition duration-150"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Descrição Detalhada
                    </label>
                    <textarea
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      rows={3}
                      placeholder="Descreva brevemente o que foi feito..."
                      className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition duration-150 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Categoria
                      </label>
                      <select
                        value={taskCategory}
                        onChange={(e) => setTaskCategory(e.target.value)}
                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition duration-150"
                      >
                        <option value="DEV">Desenvolvimento</option>
                        <option value="DESIGN">Design / UX</option>
                        <option value="SUPPORT">Suporte</option>
                        <option value="MARKETING">Marketing</option>
                        <option value="ADMIN">Administração</option>
                        <option value="OTHER">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Status
                      </label>
                      <select
                        value={taskStatus}
                        onChange={(e) => setTaskStatus(e.target.value as any)}
                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition duration-150"
                      >
                        <option value="TODO">A Fazer</option>
                        <option value="IN_PROGRESS">Em Progresso</option>
                        <option value="DONE">Concluído</option>
                        <option value="BLOCKED">Bloqueado</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Horas Dedicadas
                      </label>
                      <input
                        type="number"
                        value={taskHours}
                        onChange={(e) => setTaskHours(Number(e.target.value))}
                        min={1}
                        max={40}
                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition duration-150"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                        Data
                      </label>
                      <input
                        type="date"
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                        className="block w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 transition duration-150"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 transition duration-150 active:scale-98"
                  >
                    <Send className="h-3.5 w-3.5 text-white" />
                    Registrar Atividade
                  </button>
                </form>
              </div>
            </div>

            {/* Task list for Employee */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-white">Minhas Atividades</h1>
                  <p className="text-xs text-zinc-500 mt-0.5">Listagem das suas tarefas registradas nesta semana.</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 text-[10px] font-semibold flex items-center gap-1.5">
                    <CheckSquare className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-zinc-300">{tasks.filter(t => t.userId === user.id).length} tarefas</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {tasks
                  .filter((t) => t.userId === user.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="p-4 bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-2xl flex items-center justify-between gap-4 transition duration-150"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-zinc-200 text-sm leading-tight">
                            {task.title}
                          </h3>
                          <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] font-bold text-zinc-400">
                            {task.category}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 leading-normal">
                          {task.description || 'Nenhuma descrição detalhada fornecida.'}
                        </p>
                        <div className="flex items-center gap-3 text-[10px] text-zinc-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-zinc-600" />
                            {task.taskDate}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-zinc-600" />
                            {task.estimatedHours} horas estimadas
                          </span>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border shrink-0 ${
                          task.status === 'DONE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : task.status === 'IN_PROGRESS'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : task.status === 'BLOCKED'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse'
                            : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                        }`}
                      >
                        {task.status === 'DONE' && 'Concluído'}
                        {task.status === 'IN_PROGRESS' && 'Em Progresso'}
                        {task.status === 'BLOCKED' && 'Bloqueado'}
                        {task.status === 'TODO' && 'A Fazer'}
                      </span>
                    </div>
                  ))}

                {tasks.filter((t) => t.userId === user.id).length === 0 && (
                  <div className="text-center p-12 border border-dashed border-zinc-800 rounded-3xl">
                    <Briefcase className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-zinc-500 text-xs">Você não registrou nenhuma tarefa ainda.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
