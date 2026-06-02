export interface MockTask {
  id: string;
  userId: string;
  user: { name: string };
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  category: string;
  taskDate: string;
  estimatedHours: number;
}

export interface MockReport {
  id: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  executiveSummary: string;
  aiInsights: {
    executiveSummary: string;
    collaborators: Array<{
      name: string;
      completedCount: number;
      pendingCount: number;
      highlights: string[];
    }>;
    bottlenecks: string[];
    actionItems: string[];
  };
  createdAt: string;
}

export const mockUsers = [
  { id: 'u1', name: 'Carlos Oliveira (Diretor)', email: 'carlos@vibe.com', role: 'MANAGER', departmentId: 'd1' },
  { id: 'u2', name: 'Ana Silva (Administradora)', email: 'ana@vibe.com', role: 'ADMIN', departmentId: 'd1' },
  { id: 'u3', name: 'Bruno Souza (Desenvolvedor)', email: 'bruno@vibe.com', role: 'EMPLOYEE', departmentId: 'd1' },
  { id: 'u4', name: 'Daniela Reis (UX Designer)', email: 'daniela@vibe.com', role: 'EMPLOYEE', departmentId: 'd1' },
];

export const mockTasks: MockTask[] = [
  {
    id: 't1',
    userId: 'u3',
    user: { name: 'Bruno Souza' },
    title: 'Migração da API para Next.js 16',
    description: 'Refatoração das rotas dinâmicas do backend para API Routes.',
    status: 'DONE',
    category: 'DEV',
    taskDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: 12,
  },
  {
    id: 't2',
    userId: 'u3',
    user: { name: 'Bruno Souza' },
    title: 'Implementação de autenticação com NextAuth',
    description: 'Configuração do CredentialsProvider e segurança de rotas com JWT.',
    status: 'DONE',
    category: 'DEV',
    taskDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: 8,
  },
  {
    id: 't3',
    userId: 'u3',
    user: { name: 'Bruno Souza' },
    title: 'Integração do Gateway de Pagamento (Stripe)',
    description: 'Desenvolvimento do fluxo de checkout. Pendente de chaves de API da diretoria.',
    status: 'BLOCKED',
    category: 'DEV',
    taskDate: new Date().toISOString().split('T')[0],
    estimatedHours: 16,
  },
  {
    id: 't4',
    userId: 'u3',
    user: { name: 'Bruno Souza' },
    title: 'Correção de bugs na listagem de usuários',
    description: 'Ajuste de paginação e filtros no dashboard do administrador.',
    status: 'IN_PROGRESS',
    category: 'DEV',
    taskDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: 4,
  },
  {
    id: 't5',
    userId: 'u4',
    user: { name: 'Daniela Reis' },
    title: 'Protótipo do Dashboard Executivo (Figma)',
    description: 'Construção da alta fidelidade visual com foco em relatórios de IA e gráficos.',
    status: 'DONE',
    category: 'DESIGN',
    taskDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: 16,
  },
  {
    id: 't6',
    userId: 'u4',
    user: { name: 'Daniela Reis' },
    title: 'Teste de usabilidade com os diretores',
    description: 'Coleta de feedback sobre a navegabilidade e legibilidade dos resumos de IA.',
    status: 'DONE',
    category: 'DESIGN',
    taskDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: 6,
  },
  {
    id: 't7',
    userId: 'u4',
    user: { name: 'Daniela Reis' },
    title: 'Guia de Componentes e Design System',
    description: 'Padronização de cores HSL, tipografia Inter e estados de hover/ativo.',
    status: 'IN_PROGRESS',
    category: 'DESIGN',
    taskDate: new Date().toISOString().split('T')[0],
    estimatedHours: 10,
  },
];

export const mockReports: MockReport[] = [
  {
    id: 'r1',
    departmentId: 'd1',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    executiveSummary: 'O departamento de TI apresentou um ritmo forte esta semana, impulsionado por entregas cruciais de migração de arquitetura e infraestrutura de design. No entanto, há um bloqueio crítico de integração de faturamento que precisa de atenção imediata da diretoria.',
    aiInsights: {
      executiveSummary: 'O departamento de TI apresentou um ritmo forte esta semana, impulsionado por entregas cruciais de migração de arquitetura e infraestrutura de design. No entanto, há um bloqueio crítico de integração de faturamento que precisa de atenção imediata da diretoria.',
      collaborators: [
        {
          name: 'Bruno Souza',
          completedCount: 2,
          pendingCount: 2,
          highlights: ['Migração concluída com sucesso para o Next.js 16', 'Estruturação do fluxo de autenticação e sessão com NextAuth.js'],
        },
        {
          name: 'Daniela Reis',
          completedCount: 2,
          pendingCount: 1,
          highlights: ['Protótipo de alta fidelidade do dashboard executivo no Figma', 'Validação e ajustes de UX baseados no feedback dos gestores'],
        },
      ],
      bottlenecks: [
        'Bruno Souza está bloqueado na integração do Stripe devido à falta de liberação das chaves de produção por parte da diretoria.',
        'Potencial sobrecarga de design gráfico no final da semana devido aos ajustes pendentes de cadastro de tarefas.',
      ],
      actionItems: [
        'Aprovar e disponibilizar as chaves de API do Stripe para desbloquear o desenvolvimento.',
        'Realizar reunião 1:1 com Bruno para avaliar o cronograma pós-migração do Next.js.',
      ],
    },
    createdAt: new Date().toISOString(),
  },
];

// Função que simula uma resposta do Gemini
export async function simulateGeminiReport(tasks: any[]): Promise<any> {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Contar tarefas
  const summary: Record<string, { name: string; completed: number; pending: number; highlights: string[] }> = {};
  
  tasks.forEach((t) => {
    const colab = t.user?.name || 'Colaborador';
    if (!summary[colab]) {
      summary[colab] = { name: colab, completed: 0, pending: 0, highlights: [] };
    }
    if (t.status === 'DONE') {
      summary[colab].completed += 1;
      if (t.title) summary[colab].highlights.push(t.title);
    } else {
      summary[colab].pending += 1;
    }
  });

  const bottlenecks = tasks
    .filter((t) => t.status === 'BLOCKED')
    .map((t) => `${t.user?.name || 'Colaborador'} está bloqueado em "${t.title}": ${t.description || 'Sem descrição'}`);

  if (bottlenecks.length === 0) {
    bottlenecks.push('Nenhum gargalo crítico identificado. A equipe está avançando conforme planejado.');
  }

  return {
    executiveSummary: 'Análise consolidada baseada nas tarefas inseridas pela equipe. A equipe demonstrou produtividade consistente com entregas focadas em melhorias técnicas e novos recursos de design. Os recursos gerais do projeto estão bem distribuídos.',
    collaborators: Object.values(summary).map((s) => ({
      name: s.name,
      completedCount: s.completed,
      pendingCount: s.pending,
      highlights: s.highlights.slice(0, 2),
    })),
    bottlenecks: bottlenecks,
    actionItems: [
      'Revisar prioridades do departamento para a próxima semana.',
      'Investigar tarefas bloqueadas ou com impedimentos relatados pelos colaboradores.',
    ],
  };
}
