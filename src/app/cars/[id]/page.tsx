// src/app/cars/[id]/page.tsx

import { CarDetails } from "@/components/CarDetails";
import { Suspense } from "react";

interface CarDetailPageProps {
  params: {
    id: string;
  };
}

// Este componente NÃO é mais async
export default function CarDetailPage({ params }: CarDetailPageProps) {
  const { id } = params;

  return (
    // Suspense é uma boa prática ao carregar um componente async filho
    // Ele permite que você mostre um fallback de carregamento.
    <Suspense fallback={<div>Carregando detalhes do carro...</div>}>
      <CarDetails carId={id} />
    </Suspense>
  );
}