'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { carCreationSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ImageUploader } from '@/components/ImageUploader';
import { FuelType, Transmission, DirectionType, DriveType, RoofType, Car } from '@prisma/client';

type FormData = z.infer<typeof carCreationSchema>;

const getEnumOptions = (enumObject: object) => Object.keys(enumObject);

// Props que o nosso formulário vai aceitar
interface CarFormProps {
  initialData?: Car | null; // Dados iniciais para o modo de edição
}

export const CarForm: React.FC<CarFormProps> = ({ initialData }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Determina se estamos no modo de edição
  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(carCreationSchema),
    // Se for modo de edição, use os dados iniciais. Senão, use os padrões.
    defaultValues: initialData ? {
      ...initialData,
      images: initialData.images as string[], // Casting para string[]
    } : {
      // Valores padrão para criação que já tínhamos
      model: '', brand: '', year: new Date().getFullYear(), version: '', color: '', mileage: 0, price: 0, fuelType: FuelType.FLEX, transmission: Transmission.AUTOMATIC, doors: 4, plateStart: '', engine: '', enginePower: '', direction: DirectionType.ELECTRIC, driveType: DriveType.FWD, roof: RoofType.NONE, airConditioning: false, electricWindows: false, leatherSeats: false, mediaCenter: false, reverseCamera: false, parkingSensor: false, alarm: false, absBrakes: false, ownerManual: false, backupKey: false, licensingUpToDate: false, airbags: 0, ownersCount: 1, wheels: '', tires: '', suspension: '', paintCondition: '', collisionHistory: '', documentSituation: '', images: [],
    },
  });

  const images = watch('images');

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Você não está logado.");
      }
      
      const response = await fetch(
        isEditMode ? `/api/cars/${initialData.id}` : '/api/cars',
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(data),
        }
      );

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || 'Ocorreu um erro.');
      }

      const savedCar = responseData;
      // Redireciona para a página do carro após salvar
      router.push(`/cars/${savedCar.id}`);
      router.refresh(); // Força a atualização dos dados na página de destino

    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleImageUrlsChange = (urls: string[]) => {
    setValue('images', urls, { shouldValidate: true });
  };
  
  const onError = (errors: any) => {
    console.error("Validação falhou! Erros:", errors);
    setError("Por favor, corrija os erros no formulário antes de continuar.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
      {/* TODO O JSX do formulário que estava em new/page.tsx vem aqui */}
      {/* Seção de Imagens */}
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Fotos do Veículo</h2>
        <ImageUploader onUrlsChange={handleImageUrlsChange} initialUrls={initialData?.images as string[] | undefined} />
        {errors.images && <p className="mt-2 text-sm text-red-500">{errors.images.message}</p>}
      </div>
<div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Informações Principais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Marca" {...register('brand')} error={errors.brand?.message} />
                <Input label="Modelo" {...register('model')} error={errors.model?.message} />
                <Input label="Versão" {...register('version')} error={errors.version?.message} />
                <Input label="Ano" type="number" {...register('year', {valueAsNumber: true})} error={errors.year?.message} />
                <Input label="Preço (R$)" type="number" step="0.01" {...register('price', {valueAsNumber: true})} error={errors.price?.message} />
                <Input label="Quilometragem (km)" type="number" {...register('mileage', {valueAsNumber: true})} error={errors.mileage?.message} />
                <Input label="Cor" {...register('color')} error={errors.color?.message} />
                <Input label="Começo da Placa (3 letras)" {...register('plateStart')} error={errors.plateStart?.message} />
                <Input label="Nº de Portas" type="number" {...register('doors', {valueAsNumber: true})} error={errors.doors?.message} />
            </div>
        </div>

        {/* Seção de Especificações Técnicas */}
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Especificações Técnicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Exemplo de Select */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Combustível</label>
                    <select {...register('fuelType')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                        {getEnumOptions(FuelType).map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    {errors.fuelType && <p className="mt-1 text-xs text-red-500">{errors.fuelType.message}</p>}
                </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700">Câmbio</label>
                    <select {...register('transmission')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm">
                        {getEnumOptions(Transmission).map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                    {errors.transmission && <p className="mt-1 text-xs text-red-500">{errors.transmission.message}</p>}
                </div>
                {/* Adicione outros selects para DirectionType, DriveType, RoofType... */}
                <Input label="Motor" {...register('engine')} error={errors.engine?.message} />
                <Input label="Potência do Motor" {...register('enginePower')} error={errors.enginePower?.message} />
            </div>
        </div>

        {/* Seção de Opcionais (Checkboxes) */}
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Opcionais e Itens de Série</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Exemplo de Checkbox */}
                <div className="flex items-center">
                    <input type="checkbox" {...register('airConditioning')} id="airConditioning" className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
                    <label htmlFor="airConditioning" className="ml-2 block text-sm text-gray-900">Ar Condicionado</label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" {...register('electricWindows')} id="electricWindows" className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
                    <label htmlFor="electricWindows" className="ml-2 block text-sm text-gray-900">Vidros Elétricos</label>
                </div>
                {/* Adicione outros checkboxes para leatherSeats, mediaCenter, etc. */}
            </div>
        </div>

        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Detalhes Adicionais e Documentação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Rodas" {...register('wheels')} error={errors.wheels?.message} />
                <Input label="Pneus" {...register('tires')} error={errors.tires?.message} />
                <Input label="Suspensão" {...register('suspension')} error={errors.suspension?.message} />
                <Input label="Estado da Pintura" {...register('paintCondition')} error={errors.paintCondition?.message} />
            </div>
            <div className="mt-4">
                <Input label="Histórico de Colisões" {...register('collisionHistory')} error={errors.collisionHistory?.message} />
            </div>
            <div className="mt-4">
                 <Input label="Situação do Documento" {...register('documentSituation')} error={errors.documentSituation?.message} />
            </div>
        </div>


      {/* Botão de Submissão */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : (isEditMode ? 'Atualizar Anúncio' : 'Anunciar Veículo')}
        </Button>
      </div>
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
    </form>
  );
};