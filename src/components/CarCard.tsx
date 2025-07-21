// src/components/CarCard.tsx
import { Car } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { Gauge, GitCommitHorizontal, Calendar } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const images = car.images as string[];
  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(car.price);

  return (
    <Link href={`/cars/${car.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out group-hover:shadow-xl group-hover:-translate-y-1.5 border-b-4 border-transparent group-hover:border-primary-600">
        <div className="relative h-52 w-full">
          <Image
            src={images[0] || '/placeholder.png'}
            alt={`${car.brand} ${car.model}`}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            width={400}
            height={256}
          />
          <div className="absolute top-2 right-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {car.year}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-secondary-800 truncate" title={`${car.brand} ${car.model}`}>
            {car.brand} {car.model}
          </h3>
          <p className="text-sm text-gray-500 truncate">{car.version}</p>
          
          <p className="mt-3 text-2xl font-extrabold text-primary-600">
            {priceFormatted}
          </p>

          <div className="mt-4 text-sm text-gray-600 flex justify-between items-center border-t pt-3">
             <span className="flex items-center gap-1.5">
                <Gauge size={14}/> {car.mileage.toLocaleString('pt-BR')} km
             </span>
             <span className="flex items-center gap-1.5">
                <GitCommitHorizontal size={14}/> {car.transmission}
             </span>
          </div>
        </div>
      </div>
    </Link>
  );
};