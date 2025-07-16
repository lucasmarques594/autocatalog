import { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { Role } from '@prisma/client';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

interface UserPayload {
  userId: string;
  role: Role;
}

export async function verifyAuth(request: NextRequest): Promise<UserPayload> {
  const token = request.headers.get('Authorization')?.split(' ')[1];

  if (!token) {
    throw new Error('Token de autenticação não encontrado');
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.userId || !payload.role) {
        throw new Error('Payload do token inválido');
    }
    return payload as UserPayload;
  } catch (err) {
    throw new Error('Token inválido ou expirado');
  }
}