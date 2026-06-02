import { PrismaClient, Role, Status } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Iniciando o seeding do banco de dados...');

  // 1. Limpar banco de dados existente
  await prisma.weeklyReport.deleteMany({});
  await prisma.task.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.department.deleteMany({});

  // 2. Criar Departamento
  const techDept = await prisma.department.create({
    data: {
      name: 'Tecnologia da Informação',
    },
  });

  const mktDept = await prisma.department.create({
    data: {
      name: 'Marketing Digital',
    },
  });

  console.log('Departamentos criados.');

  // 3. Criar Usuários
  const passwordHash = bcrypt.hashSync('password123', 10);

  const manager = await prisma.user.create({
    data: {
      name: 'Carlos Oliveira (Diretor)',
      email: 'carlos@vibe.com',
      passwordHash: passwordHash,
      role: Role.MANAGER,
      departmentId: techDept.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Ana Silva (Administradora)',
      email: 'ana@vibe.com',
      passwordHash: passwordHash,
      role: Role.ADMIN,
      departmentId: techDept.id,
    },
  });

  const dev = await prisma.user.create({
    data: {
      name: 'Bruno Souza (Desenvolvedor)',
      email: 'bruno@vibe.com',
      passwordHash: passwordHash,
      role: Role.EMPLOYEE,
      departmentId: techDept.id,
    },
  });

  const designer = await prisma.user.create({
    data: {
      name: 'Daniela Reis (UX Designer)',
      email: 'daniela@vibe.com',
      passwordHash: passwordHash,
      role: Role.EMPLOYEE,
      departmentId: techDept.id,
    },
  });

  const marketer = await prisma.user.create({
    data: {
      name: 'Juliana Costa (Analista)',
      email: 'juliana@vibe.com',
      passwordHash: passwordHash,
      role: Role.EMPLOYEE,
      departmentId: mktDept.id,
    },
  });

  console.log('Usuários criados.');

  // 4. Criar Tarefas
  const today = new Date();
  
  // Função para criar datas relativas ao dia de hoje
  const getRelativeDate = (days: number) => {
    const d = new Date();
    d.setDate(today.getDate() + days);
    return d;
  };

  await prisma.task.createMany({
    data: [
      // Tarefas Bruno (Dev)
      {
        userId: dev.id,
        title: 'Migração da API para Next.js 16',
        description: 'Refatoração das rotas dinâmicas do backend para API Routes.',
        status: Status.DONE,
        category: 'DEV',
        taskDate: getRelativeDate(-2),
        estimatedHours: 12,
      },
      {
        userId: dev.id,
        title: 'Implementação de autenticação com NextAuth',
        description: 'Configuração do CredentialsProvider e segurança de rotas com JWT.',
        status: Status.DONE,
        category: 'DEV',
        taskDate: getRelativeDate(-1),
        estimatedHours: 8,
      },
      {
        userId: dev.id,
        title: 'Integração do Gateway de Pagamento (Stripe)',
        description: 'Desenvolvimento do fluxo de checkout. Pendente de chaves de API da diretoria.',
        status: Status.BLOCKED,
        category: 'DEV',
        taskDate: getRelativeDate(0),
        estimatedHours: 16,
      },
      {
        userId: dev.id,
        title: 'Correção de bugs na listagem de usuários',
        description: 'Ajuste de paginação e filtros no dashboard do administrador.',
        status: Status.IN_PROGRESS,
        category: 'DEV',
        taskDate: getRelativeDate(1),
        estimatedHours: 4,
      },
      
      // Tarefas Daniela (UX Designer)
      {
        userId: designer.id,
        title: 'Protótipo do Dashboard Executivo (Figma)',
        description: 'Construção da alta fidelidade visual com foco em relatórios de IA e gráficos.',
        status: Status.DONE,
        category: 'DESIGN',
        taskDate: getRelativeDate(-3),
        estimatedHours: 16,
      },
      {
        userId: designer.id,
        title: 'Teste de usabilidade com os diretores',
        description: 'Coleta de feedback sobre a navegabilidade e legibilidade dos resumos de IA.',
        status: Status.DONE,
        category: 'DESIGN',
        taskDate: getRelativeDate(-1),
        estimatedHours: 6,
      },
      {
        userId: designer.id,
        title: 'Guia de Componentes e Design System',
        description: 'Padronização de cores HSL, tipografia Inter e estados de hover/ativo.',
        status: Status.IN_PROGRESS,
        category: 'DESIGN',
        taskDate: getRelativeDate(0),
        estimatedHours: 10,
      },
      {
        userId: designer.id,
        title: 'Ajustes no fluxo de cadastro de tarefas',
        description: 'Simplificar formulários para diminuir o tempo gasto pelo colaborador.',
        status: Status.TODO,
        category: 'DESIGN',
        taskDate: getRelativeDate(2),
        estimatedHours: 8,
      },

      // Tarefas Juliana (Marketing)
      {
        userId: marketer.id,
        title: 'Campanha de E-mail Marketing Semanal',
        description: 'Envio de newsletter com atualizações de produto aos clientes VIP.',
        status: Status.DONE,
        category: 'MARKETING',
        taskDate: getRelativeDate(-1),
        estimatedHours: 4,
      },
      {
        userId: marketer.id,
        title: 'Análise de SEO do site institucional',
        description: 'Mapeamento de palavras-chave competitivas e ajuste de meta tags.',
        status: Status.IN_PROGRESS,
        category: 'MARKETING',
        taskDate: getRelativeDate(0),
        estimatedHours: 12,
      }
    ],
  });

  console.log('Tarefas criadas com sucesso!');
  console.log('Banco de dados semeado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
