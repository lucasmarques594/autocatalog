// src/app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { registrationSchema } from '@/lib/schemas';
import { Role } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = registrationSchema.parse(body);

    const { name, email, password, role, cpf, cnpj, storeName, storeAddress } = data;

    // Verificar se o email, CPF ou CNPJ já existem
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }
    
    if (cpf) {
        const existingProfile = await prisma.profile.findUnique({ where: { cpf } });
        if (existingProfile) {
            return NextResponse.json({ error: 'CPF já cadastrado' }, { status: 409 });
        }
    }
    
    if (cnpj) {
        const existingProfile = await prisma.profile.findUnique({ where: { cnpj } });
        if (existingProfile) {
            return NextResponse.json({ error: 'CNPJ já cadastrado' }, { status: 409 });
        }
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Usaremos uma transação do Prisma para garantir a atomicidade
    // Ou tudo é criado com sucesso, ou nada é.
    const result = await prisma.$transaction(async (tx) => {
        // 1. Criar o Usuário base
        const user = await tx.user.create({
            data: {
              name,
              email,
              password: hashedPassword,
              role,
            },
        });

        // 2. Criar o Profile e associar
        await tx.profile.create({
            data: {
                userId: user.id,
                cpf,
                cnpj
            }
        });

        // 3. Se for uma Loja, criar a entidade Store
        if (role === Role.STORE && storeName) {
            await tx.store.create({
                data: {
                    userId: user.id,
                    name: storeName,
                    address: storeAddress || "", // Endereço pode ser opcional inicialmente
                }
            });
        }
        
        // (A lógica para VENDEDOR (SELLER) é diferente, ele seria criado/convidado
        // por uma LOJA já existente, então não tratamos aqui no registro público)

        return user;
    });


    // Remover a senha da resposta
    const { password: _, ...userWithoutPassword } = result;

    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Dados de registro inválidos', details: error.flatten() }, { status: 400 });
    }
    // Tratamento genérico para outros erros
    if (error instanceof Error && error.message.includes('já cadastrado')) {
        return NextResponse.json({ error: error.message }, { status: 409 });
    }

    console.error("Erro no registro:", error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}