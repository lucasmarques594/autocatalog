// src/app/api/cars/route.ts
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { carCreationSchema } from '@/lib/schemas';
import { verifyAuth } from '@/lib/auth-utils';
import { Role } from '@prisma/client';
import { ZodError } from 'zod';

// POST - Criar um novo carro
export async function POST(request: NextRequest) {
  try {
    // 1. Verificar se o usuário está autenticado e pegar seu ID e Role
    const { userId, role } = await verifyAuth(request);

    // 2. Verificar se o usuário tem permissão para criar um carro
    const allowedRoles: Role[] = [Role.ADMIN, Role.STORE, Role.SELLER, Role.INDIVIDUAL_SELLER];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json({ error: 'Você não tem permissão para anunciar carros.' }, { status: 403 });
    }
    
    // 3. Validar o corpo da requisição com Zod
    const body = await request.json();
    const validatedData = carCreationSchema.parse(body);

    // 4. Regra de negócio: Vendedor individual só pode ter 2 carros ativos
    if (role === Role.INDIVIDUAL_SELLER) {
        const activeCarsCount = await prisma.car.count({
            where: {
                createdById: userId,
                status: 'AVAILABLE'
            }
        });
        if (activeCarsCount >= 2) {
            return NextResponse.json({ error: 'Você atingiu o limite de 2 anúncios ativos.' }, { status: 403 });
        }
    }

    // 5. Criar o carro no banco de dados
    const newCar = await prisma.car.create({
      data: {
        ...validatedData,
        createdById: userId,
        // Futuramente, se for de uma loja, precisaremos associar o storeId aqui
      },
    });

    return NextResponse.json(newCar, { status: 201 });

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.flatten() }, { status: 400 });
    }
    if (error instanceof Error && (error.message.includes('Token') || error.message.includes('autenticação'))) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('Erro ao criar carro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

// GET - Listar todos os carros (sem alterações)
export async function GET(request: Request) {
    try {
      const cars = await prisma.car.findMany({
        where: { status: 'AVAILABLE' },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json(cars);
    } catch (error) {
      return NextResponse.json({ error: 'Erro ao buscar os carros' }, { status: 500 });
    }
}