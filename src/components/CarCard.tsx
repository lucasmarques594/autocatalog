import { Car } from '@prisma/client';
import Image from 'next/image';
import { Heart, Share2, Eye, Calendar, Gauge, MapPin, Zap, Star } from 'lucide-react';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-blue-100">
      {/* Header do Card - Estilo Stories */}
      <div className="p-4 border-b border-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-sky-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {car.brand.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">{car.brand} {car.model}</h3>
              <p className="text-xs text-gray-500 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                Curitiba, PR
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-xs text-gray-600 ml-1">4.8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Imagem Principal */}
      <div className="relative h-64 w-full group">
        <Image
          src={(car.images as string[])[0] || '/placeholder.png'}
          alt={`${car.brand} ${car.model}`}
          width={400}
          height={256}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay com badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {car.year}
          </div>
          <div className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            Verificado
          </div>
        </div>

        {/* Botões de ação - aparecem no hover */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110">
            <Heart className="w-4 h-4 text-red-500" />
          </button>
          <button className="w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110">
            <Share2 className="w-4 h-4 text-blue-500" />
          </button>
        </div>

        {/* Indicador de múltiplas fotos */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded-full text-xs">
          +{((car.images as string[]).length - 1) || 0} fotos
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="p-5">
        {/* Título e Versão */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-800">{car.brand} {car.model}</h3>
          <p className="text-sm text-blue-600 font-medium">{car.version}</p>
        </div>

        {/* Especificações Rápidas */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{car.year}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Gauge className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">{car.mileage.toLocaleString('pt-BR')} km</span>
          </div>
        </div>

        {/* Destaques do Veículo */}
        <div className="flex flex-wrap gap-2 mb-4">
          {car.airConditioning && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              Ar Condicionado
            </span>
          )}
          {car.electricWindows && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
              Vidros Elétricos
            </span>
          )}
          {car.leatherSeats && (
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
              Bancos de Couro
            </span>
          )}
        </div>

        {/* Preço e Botão */}
        <div className="border-t border-blue-50 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price)}
              </p>
              <p className="text-xs text-gray-500">Preço à vista</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Entrada</p>
              <p className="text-sm font-semibold text-gray-700">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(car.price * 0.3)}
              </p>
            </div>
          </div>

          {/* Botão de Ação */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Ver Detalhes</span>
          </button>
        </div>

        {/* Footer com estatísticas */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-blue-50">
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span className="text-xs">128 visualizações</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span className="text-xs">23 curtidas</span>
            </div>
          </div>
          <div className="text-xs text-gray-400">
            há 2 dias
          </div>
        </div>
      </div>

      {/* Indicador de urgência */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-sky-500"></div>
    </div>
  );
};