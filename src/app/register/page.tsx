'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

import { registrationSchema } from '@/lib/schemas';
import { Role } from '@prisma/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

type FormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch, // Para observar mudanças nos campos
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
  });

  // Observa o valor do campo 'role' para mostrar/esconder os campos condicionais
  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha no cadastro.');
      }

      // Se o cadastro foi bem-sucedido, redireciona para a página de login
      router.push('/login?status=success');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center text-primary">Crie sua Conta</h2>
        <p className="text-center text-gray-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Faça login
          </Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Conta</label>
            <select
              {...register('role')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            >
              <option value="">Selecione um tipo...</option>
              {/* Excluímos ADMIN e SELLER pois eles têm fluxos de criação diferentes */}
              <option value={Role.BUYER}>Quero Comprar</option>
              <option value={Role.INDIVIDUAL_SELLER}>Quero Vender (Pessoa Física)</option>
              <option value={Role.STORE}>Sou uma Loja (Pessoa Jurídica)</option>
            </select>
            {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
          </div>

          {/* Campos que aparecem para todos */}
          <Input label="Nome Completo" {...register('name')} error={errors.name?.message} />
          <Input label="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input label="Senha" type="password" {...register('password')} error={errors.password?.message} />
          <Input label="Telefone para Contato (com DDD)" {...register('phone')} error={errors.phone?.message} placeholder="(11) 99999-9999"/>
          <Input label="Endereço (Cidade - UF)" {...register('address')} error={errors.address?.message} placeholder="São Paulo - SP"/>
          
          {/* Campos Condicionais */}
          
          {/* Aparece para Vendedor Individual ou Comprador */}
          {(selectedRole === Role.INDIVIDUAL_SELLER || selectedRole === Role.BUYER) && (
            <div className="animate-fade-in">
              <Input label="CPF" {...register('cpf')} error={errors.cpf?.message} placeholder="000.000.000-00" />
            </div>
          )}

          {/* Aparece para Loja */}
          {selectedRole === Role.STORE && (
            <div className="space-y-6 animate-fade-in">
              <hr/>
              <h3 className="text-lg font-medium text-gray-800">Dados da Loja</h3>
              <Input label="Nome da Loja" {...register('storeName')} error={errors.storeName?.message} />
              <Input label="CNPJ" {...register('cnpj')} error={errors.cnpj?.message} placeholder="00.000.000/0001-00" />
              <Input label="Endereço da Loja (Opcional)" {...register('storeAddress')} error={errors.storeAddress?.message} />
              <Input label="Telefone para Contato (com DDD)" {...register('phone')} error={errors.phone?.message} placeholder="(11) 99999-9999"/>
              <Input label="Endereço (Cidade - UF)" {...register('address')} error={errors.address?.message} placeholder="São Paulo - SP"/>
            </div>
          )}

          {error && <p className="text-sm text-center text-red-600 bg-red-50 p-3 rounded-md">{error}</p>}
          
          <Button type="submit" className="w-full !py-3" disabled={isSubmitting}>
            {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
          </Button>
        </form>
      </div>
    </div>
  );
}

