// src/app/page.tsx
import { CarCard } from '@/components/CarCard';
import prisma from '@/lib/prisma';
import { Car } from '@prisma/client';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

async function getCars(): Promise<Car[]> {
  const cars = await prisma.car.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { createdAt: 'desc' },
    take: 12,
  });
  return cars;
}

const HeroSection = () => (
  <div className="text-center py-16 md:py-24 bg-gradient-to-b from-primary-50 to-gray-50 rounded-xl mb-12 border border-primary-100 shadow-sm">
    <h1 className="text-4xl md:text-5xl font-extrabold text-secondary-900 tracking-tight">
      Encontre o Carro dos Seus Sonhos
    </h1>
    <p className="mt-4 max-w-2xl mx-auto text-lg text-secondary-700">
      Explore milhares de veículos de concessionárias e vendedores particulares em todo o Brasil.
    </p>
    <div className="mt-8">
      <Link href="#veiculos" passHref>
        <Button size="lg" className="transform hover:scale-105">
          Ver Veículos em Destaque
        </Button>
      </Link>
    </div>
  </div>
);

export default async function HomePage() {
  const cars = await getCars();

  return (
    <>
      <HeroSection />
      
      <section id="veiculos">
        <h2 className="text-3xl font-bold mb-8 text-secondary-800 border-l-4 border-primary-500 pl-4">
          Veículos em Destaque
        </h2>
        
        {cars.length === 0 ? (
          <div className="text-center py-16 px-4 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800">Nenhum carro anunciado</h3>
            <p className="mt-2 text-gray-500">Seja o primeiro a anunciar na nossa plataforma!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export const revalidate = 60; // Revalida a página a cada 60 segundos