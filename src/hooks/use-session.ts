'use client'; // Hooks são para o lado do cliente

import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 

interface Session {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken: Session = jwtDecode(token);
        setSession(decodedToken);
      }
    } catch (error) {
      console.error('Falha ao decodificar o token:', error);
      setSession(null);
    }
  }, []);

  return session;
}