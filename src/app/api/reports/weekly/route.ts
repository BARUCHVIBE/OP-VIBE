import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Schema para a IA preencher com Structured Outputs
const aiReportSchema = z.object({
  executiveSummary: z.string().describe(
    'Resumo executivo analítico e direto sobre as entregas do departamento (2 a 3 parágrafos).'
  ),
  collaborators: z.array(
    z.object({
      name: z.string().describe('Nome do funcionário'),
      completedCount: z.number().describe('Quantidade de tarefas concluídas'),
      pendingCount: z.number().describe('Quantidade de tarefas pendentes ou em progresso'),
      highlights: z.array(z.string()).describe('Principais entregas ou marcos concluídos nesta semana'),
    })
  ),
  bottlenecks: z.array(z.string()).describe(
    'Gargalos identificados, bloqueios ativamente sinalizados ou riscos de atraso.'
  ),
  actionItems: z.array(z.string()).describe(
    'Sugestões práticas de ações para o gestor tomar (como realocação de demandas ou alinhamentos).'
  ),
});

export async function POST(request: Request) {
  try {
    // 1. Validar autenticação e autorização (Apenas Gerentes e Admins)
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    if (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado. Apenas gestores podem gerar resumos por IA.' },
        { status: 403 }
      );
    }

    // 2. Extrair dados da requisição
    const { departmentId, startDate, endDate } = await request.json();

    if (!departmentId || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Os campos departmentId, startDate e endDate são obrigatórios.' },
        { status: 400 }
      );
    }

    // 3. Buscar tarefas da equipe no período indicado
    const tasks = await prisma.task.findMany({
      where: {
        taskDate: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
        user: {
          departmentId: departmentId,
        },
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma tarefa registrada para este departamento no período selecionado.' },
        { status: 404 }
      );
    }

    // 4. Formatar as tarefas como contexto estruturado em string para a IA
    const tasksContext = tasks
      .map(
        (t) => `
Colaborador: ${t.user.name}
Título: ${t.title}
Descrição: ${t.description || 'Não detalhado'}
Status: ${t.status}
Categoria: ${t.category}
Data: ${t.taskDate.toISOString().split('T')[0]}
-------------------`
      )
      .join('\n');

    // 5. Acionar a IA utilizando o Vercel AI SDK e o Gemini 2.0 Flash
    const prompt = `Você é um Analista de Produtividade e Assistente Executivo. Sua função é analisar a lista de tarefas diárias e semanais executadas por uma equipe e criar um relatório de desempenho conciso, estratégico e direto ao ponto para a diretoria.

Mantenha um tom profissional, analítico e objetivo. Evite jargões desnecessários.

Aqui estão os dados da equipe referentes a esta semana:
${tasksContext}

Gere um relatório estruturado preenchendo exatamente a estrutura JSON solicitada contendo:
- Resumo Executivo: Um parágrafo destacando o foco principal da equipe neste período.
- Principais Entregas: Os maiores marcos concluídos por colaborador.
- Gargalos ou Alertas: Tarefas que estão atrasadas, bloqueadas ou que exigem atenção da gestão.
- Desempenho Individual: Destaques positivos das entregas de cada colaborador.`;

    const { object: aiReport } = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: aiReportSchema,
      prompt: prompt,
      temperature: 0.2, // Baixa temperatura para resultados mais analíticos e menos criativos
    });

    // 6. Salvar o relatório analítico gerado no banco de dados para consultas futuras
    const savedReport = await prisma.weeklyReport.create({
      data: {
        departmentId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        executiveSummary: aiReport.executiveSummary,
        aiInsights: aiReport as any, // Salva o JSON estruturado diretamente
        generatedById: session.user.id,
      },
    });

    return NextResponse.json({
      message: 'Relatório semanal gerado e salvo com sucesso.',
      report: savedReport,
    });
  } catch (error: any) {
    console.error('Erro na geração de relatório semanal:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno no processamento do relatório.' },
      { status: 500 }
    );
  }
}
