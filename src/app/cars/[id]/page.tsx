import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Car } from '@prisma/client';
import { CheckCircle, XCircle, Calendar, Gauge, Settings, Fuel, Palette, DoorOpen, User, Phone, Heart, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

type CarWithCreator = Car & {
    createdBy: {
      name: string | null;
    };
  };

// Esta função busca os dados no servidor
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

// Componente para renderizar um opcional
const FeatureItem: React.FC<{ label: string; checked: boolean }> = ({ label, checked }) => (
    <div className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-100 hover:shadow-sm transition-all duration-200">
        {checked ? (
            <CheckCircle className="text-emerald-500 w-5 h-5 flex-shrink-0" />
        ) : (
            <XCircle className="text-gray-400 w-5 h-5 flex-shrink-0" />
        )}
        <span className={`text-sm font-medium ${checked ? 'text-gray-800' : 'text-gray-500'}`}>
            {label}
        </span>
    </div>
);

export default async function CarDetailPage({ params }: { params: { id: string } }) {
    const car = await getCar(params.id);
  
    if (!car) {
      notFound();
    }
  
    const images = car.images as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-blue-100">
      {/* Header Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                {car.brand} {car.model}
              </h1>
              <p className="text-xl text-blue-100">{car.version}</p>
            </div>
            <div className="flex gap-3">
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Heart className="w-6 h-6" />
              </button>
              <button className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Galeria de Imagens - 2 colunas */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={images[0] || '/placeholder.png'} 
                  alt={`${car.brand} ${car.model}`} 
                  className="w-full h-80 md:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  {car.year}
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="p-4">
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(1, 5).map((img, index) => (
                    <img 
                      key={index} 
                      src={img} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity border-2 border-transparent hover:border-blue-300"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Informações e Preço - 1 coluna */}
          <div className="space-y-6">
            {/* Card de Preço */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="text-center">
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)}
                </p>
                <p className="text-gray-500 text-sm">Preço à vista</p>
              </div>
            </div>

            {/* Especificações Técnicas */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Settings className="w-6 h-6 text-blue-500 mr-2" />
                Especificações
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-gray-600">Ano</span>
                  </div>
                  <span className="font-semibold text-gray-800">{car.year}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <div className="flex items-center">
                    <Gauge className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-gray-600">Quilometragem</span>
                  </div>
                  <span className="font-semibold text-gray-800">{car.mileage.toLocaleString('pt-BR')} km</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-gray-600">Câmbio</span>
                  </div>
                  <span className="font-semibold text-gray-800">{car.transmission}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <div className="flex items-center">
                    <Fuel className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-gray-600">Combustível</span>
                  </div>
                  <span className="font-semibold text-gray-800">{car.fuelType}</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-blue-100">
                  <div className="flex items-center">
                    <Palette className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-gray-600">Cor</span>
                  </div>
                  <span className="font-semibold text-gray-800">{car.color}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <DoorOpen className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-gray-600">Portas</span>
                  </div>
                  <span className="font-semibold text-gray-800">{car.doors}</span>
                </div>
              </div>
            </div>

            {/* Vendedor */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <User className="w-5 h-5 text-blue-500 mr-2" />
                Vendedor
              </h3>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{car.createdBy.name}</p>
                  <p className="text-sm text-gray-500">Vendedor verificado</p>
                </div>
              </div>
            </div>

            {/* Botão de Contato */}
            <div className="bg-gradient-to-r from-blue-600 to-sky-600 rounded-2xl p-6 text-white">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 text-lg rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl">
                <Phone className="w-5 h-5 mr-2" />
                Entrar em Contato
              </Button>
              <p className="text-center text-blue-100 text-sm mt-3">
                Resposta em menos de 24 horas
              </p>
            </div>
          </div>
        </div>

        {/* Detalhes e Opcionais */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold mb-8 text-blue-600 flex items-center">
            <CheckCircle className="w-8 h-8 mr-3" />
            Equipamentos e Opcionais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <FeatureItem label="Ar Condicionado" checked={car.airConditioning} />
            <FeatureItem label="Vidros Elétricos" checked={car.electricWindows} />
            <FeatureItem label="Bancos de Couro" checked={car.leatherSeats} />
            <FeatureItem label="Multimídia" checked={car.mediaCenter} />
            <FeatureItem label="Câmera de Ré" checked={car.reverseCamera} />
            <FeatureItem label="Sensor de Estacionamento" checked={car.parkingSensor} />
            <FeatureItem label="Freios ABS" checked={car.absBrakes} />
            <FeatureItem label="Alarme" checked={car.alarm} />
          </div>
        </div>

        {/* Footer com Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Interessado neste veículo?</h3>
          <p className="text-blue-100 mb-6">Entre em contato conosco e agende uma visita para conhecer o carro pessoalmente.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl">
              <Phone className="w-5 h-5 mr-2" />
              Ligar Agora
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800 font-bold py-3 px-8 rounded-xl">
              Agendar Visita
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const revalidate = 0;