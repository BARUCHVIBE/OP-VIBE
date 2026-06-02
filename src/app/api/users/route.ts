import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    // 1. Validar autenticação e autorização
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 });
    }

    if (session.user.role !== 'MANAGER' && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Não autorizado. Apenas gestores podem cadastrar membros.' },
        { status: 403 }
      );
    }

    // 2. Extrair dados do corpo da requisição
    const { name, email, role, departmentId, password } = await request.json();

    if (!name || !email || !role || !departmentId) {
      return NextResponse.json(
        { error: 'Os campos nome, email, cargo e departamento são obrigatórios.' },
        { status: 400 }
      );
    }

    const defaultPassword = password || 'Vibe@123';
    const passwordHash = bcrypt.hashSync(defaultPassword, 10);

    // 3. Verificar duplicidade de e-mail
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este endereço de e-mail já está em uso.' },
        { status: 400 }
      );
    }

    // 4. Inserir no banco de dados
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        departmentId,
      },
    });

    return NextResponse.json({
      message: 'Membro cadastrado com sucesso!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        departmentId: newUser.departmentId,
      },
    });
  } catch (error: any) {
    console.error('Erro ao cadastrar usuário:', error);
    return NextResponse.json(
      { error: error.message || 'Erro interno ao processar o cadastro.' },
      { status: 500 }
    );
  }
}
