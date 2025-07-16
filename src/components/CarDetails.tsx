// src/components/CarDetails.tsx

import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Car } from '@prisma/client';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from './ui/Button';
import Link from 'next/link';

// Nosso tipo que já tínhamos
type CarWithCreator = Car & {
  createdBy: {
    name: string | null;
  };
};

// Função de busca de dados
async function getCar(id: string): Promise<CarWithCreator | null> {
  const car = await prisma.car.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: { name: true },
      },
    },
  });
  return car;
}

const FeatureItem: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
    <div className="flex items-center space-x-2">
        {checked ? <CheckCircle className="text-green-500" /> : <XCircle className="text-gray-400" />}
        <span>{label}</span>
    </div>
);


export const CarDetails = async ({ carId }: { carId: string }) => {
  const car = await getCar(carId);

  if (!car) {
    notFound();
  }

  const images = car.images as string[];

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Galeria de Imagens */}
        <div>
          <img src={images[0] || '/placeholder.png'} alt={`${car.brand} ${car.model}`} className="w-full h-auto rounded-lg shadow-lg mb-4" />
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1, 5).map((img, index) => (
              <img key={index} src={img} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-md cursor-pointer" />
            ))}
          </div>
        </div>

        {/* Informações e Preço */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-primary">{car.brand} {car.model}</h1>
              <p className="text-xl text-gray-600">{car.version}</p>
            </div>
            <Link href={`/cars/${car.id}/edit`}>
              <Button variant="secondary">Editar</Button>
            </Link>
          </div>
          
          <p className="text-4xl font-extrabold text-secondary">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-md">
            <span><strong>Ano:</strong> {car.year}</span>
            <span><strong>KM:</strong> {car.mileage.toLocaleString('pt-BR')}</span>
            <span><strong>Câmbio:</strong> {car.transmission}</span>
            <span><strong>Combustível:</strong> {car.fuelType}</span>
            <span><strong>Cor:</strong> {car.color}</span>
            <span><strong>Portas:</strong> {car.doors}</span>
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-2">Anunciado por:</h3>
            <p className="text-gray-800">{car.createdBy.name}</p>
          </div>

          <Button className="w-full mt-4 !py-3 !text-lg">
            Entrar em Contato
          </Button>
        </div>
      </div>

      {/* Detalhes e Opcionais */}
      <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-secondary">Detalhes e Opcionais</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-2">
          <FeatureItem label="Ar Condicionado" checked={car.airConditioning} />
          <FeatureItem label="Vidros Elétricos" checked={car.electricWindows} />
          {/* Adicione outros FeatureItem aqui */}
        </div>
      </div>
    </div>
  );
};