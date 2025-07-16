// src/app/cars/new/page.tsx
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
import { FuelType, Transmission, DirectionType, DriveType, RoofType } from '@prisma/client';

type FormData = z.infer<typeof carCreationSchema>;

// Helper para gerar as opções do select a partir de um Enum
const getEnumOptions = (enumObject: object) => Object.keys(enumObject);

export default function NewCarPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } =  useForm<FormData>({
    resolver: zodResolver(carCreationSchema),
    // CORREÇÃO: Inicialize todos os campos para evitar tipos 'undefined'
    defaultValues: {
      model: '',
      brand: '',
      year: new Date().getFullYear(),
      version: '',
      color: '',
      mileage: 0,
      price: 0,
      fuelType: FuelType.FLEX, // Um valor padrão razoável
      transmission: Transmission.AUTOMATIC,
      doors: 4,
      plateStart: '',
      engine: '',
      enginePower: '',
      direction: DirectionType.ELECTRIC,
      driveType: DriveType.FWD,
      roof: RoofType.NONE,
      airConditioning: false,
      electricWindows: false,
      leatherSeats: false,
      mediaCenter: false,
      reverseCamera: false,
      parkingSensor: false,
      alarm: false,
      absBrakes: false,
      ownerManual: false,
      backupKey: false,
      licensingUpToDate: false,
      airbags: 0,
      ownersCount: 1,
      wheels: '',
      tires: '',
      suspension: '',
      paintCondition: '',
      collisionHistory: '',
      documentSituation: '',
      images: [],
    },
  });

  
  // Observa o valor das imagens para mostrar erro
  const images = watch('images');

  const onSubmit = async (data: FormData) => {
    setError(null);
    console.log("1. Botão 'Anunciar' clicado, validação passou. Dados do formulário:", data); // <-- PONTO DE VERIFICAÇÃO 1

    try {
      const token = localStorage.getItem('token');
      console.log("2. Token pego do localStorage:", token); // <-- PONTO DE VERIFICAÇÃO 2

      if (!token) {
        setError("Erro: Você não está logado. Faça o login e tente novamente.");
        console.error("Token não encontrado no localStorage.");
        return; // Para a execução aqui
      }

      console.log("3. Enviando requisição para /api/cars..."); // <-- PONTO DE VERIFICAÇÃO 3

      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data),
      });

      console.log("4. Resposta recebida da API. Status:", response.status); // <-- PONTO DE VERIFICAÇÃO 4

      const responseData = await response.json(); // Tenta ler o corpo da resposta
      console.log("5. Corpo da resposta (JSON):", responseData); // <-- PONTO DE VERIFICAÇÃO 5

      if (!response.ok) {
        // Acessamos a propriedade 'error' que definimos na nossa API
        throw new Error(responseData.error || 'Falha ao criar o anúncio.');
      }

      const newCar = responseData;
      router.push(`/cars/${newCar.id}`);

    } catch (err: any) {
      console.error("ERRO NO BLOCO CATCH:", err); // <-- PONTO DE VERIFICAÇÃO DE ERRO
      setError(err.message);
    }
  };
  const onError = (errors: any) => {
    console.error("Validação falhou! Erros:", errors);
    setError("Por favor, corrija os erros no formulário antes de continuar.");
  };
  // Atualiza o valor do formulário quando as URLs das imagens mudam
  const handleImageUrlsChange = (urls: string[]) => {
    setValue('images', urls, { shouldValidate: true });
  };

  

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Anunciar Novo Veículo</h1>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8">
        
        {/* Seção de Imagens */}
        <div className="p-6 bg-white rounded-lg shadow-md">
           <h2 className="text-xl font-semibold mb-4">Fotos do Veículo</h2>
           <ImageUploader onUrlsChange={handleImageUrlsChange} />
           {errors.images && <p className="mt-2 text-sm text-red-500">{errors.images.message}</p>}
        </div>

        {/* Seção de Informações Principais */}
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
            {isSubmitting ? 'Salvando...' : 'Anunciar Veículo'}
          </Button>
        </div>
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </form>
    </div>
  );
}