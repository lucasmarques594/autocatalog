import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { carCreationSchema } from '@/lib/schemas'; 
import { verifyAuth } from '@/lib/auth-utils';
import { ZodError } from 'zod';


interface Params {
  params: { id: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const car = await prisma.car.findUnique({
      where: { id },
      include: { // Incluímos os dados de quem criou o anúncio
        createdBy: {
          select: {
            name: true,
            role: true,
          },
        },
      },
    });

    if (!car) {
      return NextResponse.json({ error: 'Carro não encontrado' }, { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error('Erro ao buscar carro:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params; 

    const { userId, role } = await verifyAuth(request);
    
    const car = await prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      return NextResponse.json({ error: 'Carro não encontrado' }, { status: 404 });
    }

    if (car.createdById !== userId && role !== 'ADMIN') {
      return NextResponse.json({ error: 'Você não tem permissão para editar este anúncio' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = carCreationSchema.parse(body);

    const updatedCar = await prisma.car.update({
      where: { id: id }, // Especifica QUAL carro atualizar
      data: {
        ...validatedData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCar);

  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Dados inválidos', details: error.flatten() }, { status: 400 });
    }
    if (error instanceof Error && (error.message.includes('Token') || error.message.includes('autenticação'))) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error(`Erro ao atualizar carro ${params.id}:`, error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}