import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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