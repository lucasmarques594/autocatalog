'use client';

import { useSession } from '@/hooks/use-session';
import Link from 'next/link';
import { Button } from './ui/Button';
import { Role } from '@prisma/client';

interface EditButtonWrapperProps {
  carId: string;
  carCreatorId: string;
}

export const EditButtonWrapper: React.FC<EditButtonWrapperProps> = ({ carId, carCreatorId }) => {
  const session = useSession();

  if (!session) {
    return null; // Se não há sessão, não mostra o botão
  }

  // Mostra o botão se o ID do usuário da sessão for o mesmo do criador do carro
  // OU se o usuário for um ADMIN
  const canEdit = session.userId === carCreatorId || session.role === Role.ADMIN;

  if (!canEdit) {
    return null; // Se não tiver permissão, não mostra o botão
  }

  return (
    <Link href={`/cars/${carId}/edit`}>
      <Button variant="secondary">Editar</Button>
    </Link>
  );
};