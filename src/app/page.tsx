import { CarCard } from '@/components/CarCard';
import prisma from '@/lib/prisma';
import { Car } from '@prisma/client';

async function getCars(): Promise<Car[]> {
  // Acesso direto ao Prisma aqui porque é um Server Component
  // Isso é rápido e seguro no Next.js App Router
  const cars = await prisma.car.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { createdAt: 'desc' },
    take: 20, // Limita a 20 carros na página inicial
  });
  return cars;
}

export default async function HomePage() {
  const cars = await getCars();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-secondary">Veículos em Destaque</h1>
      {cars.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum carro anunciado no momento. Seja o primeiro!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

// Para forçar a página a ser sempre dinâmica e buscar os dados mais recentes
export const revalidate = 0;