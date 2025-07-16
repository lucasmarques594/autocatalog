import { z } from 'zod';
import { FuelType, Transmission, DirectionType, DriveType, RoofType } from '@prisma/client';
import { Role } from '@prisma/client';



export const carCreationSchema = z.object({
  model: z.string().min(1, 'Modelo é obrigatório'),
  brand: z.string().min(1, 'Marca é obrigatória'),
  year: z.number().int().min(1900, 'Ano inválido').max(new Date().getFullYear() + 1, 'Ano inválido'),
  version: z.string().min(1, 'Versão é obrigatória'),
  color: z.string().min(1, 'Cor é obrigatória'),
  mileage: z.number().int().min(0, 'Quilometragem não pode ser negativa'),
  price: z.number().min(0, "O preço não pode ser negativo"), 
  
  fuelType: z.nativeEnum(FuelType),
  transmission: z.nativeEnum(Transmission),
  doors: z.number().int().min(2).max(5),
  plateStart: z.string().length(3, 'Deve conter 3 letras'),
  engine: z.string().min(1, 'Motor é obrigatório'),
  enginePower: z.string().min(1, 'Potência é obrigatória'),
  direction: z.nativeEnum(DirectionType),
  driveType: z.nativeEnum(DriveType),
  roof: z.nativeEnum(RoofType),
  
  airConditioning: z.boolean(),
  electricWindows: z.boolean(),
  leatherSeats: z.boolean(),
  mediaCenter: z.boolean(),
  reverseCamera: z.boolean(),
  parkingSensor: z.boolean(),
  alarm: z.boolean(),
  absBrakes: z.boolean(),
  ownerManual: z.boolean(),
  backupKey: z.boolean(),
  licensingUpToDate: z.boolean(),

  airbags: z.number().int().min(0),
  ownersCount: z.number().int().min(1),
  
  wheels: z.string().min(1, 'Rodas é obrigatório'),
  tires: z.string().min(1, 'Pneus é obrigatório'),
  suspension: z.string().min(1, 'Suspensão é obrigatória'),
  paintCondition: z.string().min(1, 'Estado da pintura é obrigatório'),
  collisionHistory: z.string().min(1, 'Histórico de colisões é obrigatório'),
  documentSituation: z.string().min(1, 'Situação do documento é obrigatória'),
  
  images: z.array(z.string().url('URL da imagem inválida')).min(1, 'É necessário pelo menos uma imagem'),
});

export const registrationSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  
  role: z.nativeEnum(Role),
  
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  storeName: z.string().optional(),
  storeAddress: z.string().optional(),
})
.refine(data => {
  if (data.role === Role.STORE) {
    return !!data.cnpj && !!data.storeName;
  }
  return true;
}, {
  message: "CNPJ e Nome da Loja são obrigatórios para o perfil Loja.",
  path: ["cnpj"], // Onde mostrar o erro
})
.refine(data => {
    // Se for Vendedor ou Comprador, CPF é obrigatório
    if (data.role === Role.INDIVIDUAL_SELLER || data.role === Role.BUYER) {
        return !!data.cpf;
    }
    return true;
}, {
    message: "CPF é obrigatório para este perfil.",
    path: ["cpf"], // Onde mostrar o erro
});