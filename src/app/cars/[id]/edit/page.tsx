import { CarForm } from '@/components/CarForm';
import prisma from '@/lib/prisma';
import { Car } from '@prisma/client';
import { notFound } from 'next/navigation';


interface EditPageProps {
  params: {
    id: string;
  };
}

// Nenhuma mudança aqui
async function getCarData(id: string): Promise<Car | null> {
    const car = await prisma.car.findUnique({
        where: { id },
    });
    return car;
}

const EditCarPage = async ({ params }: EditPageProps) => {
  const carData = await getCarData(params.id);

  if (!carData) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Editando: {carData.brand} {carData.model}</h1>
      <CarForm initialData={carData} />
    </div>
  );
};

export default EditCarPage;