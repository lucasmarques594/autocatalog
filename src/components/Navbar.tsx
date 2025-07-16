'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { useEffect, useState } from 'react';

export const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Uma forma simples de ler o cookie
    const cookieToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
    setToken(cookieToken || null);
  }, []);
  
  const handleLogout = () => {
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;'; // Deleta o cookie
      setToken(null);
      window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              AutoCatalog
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/cars/new" className="text-gray-600 hover:text-primary">
              Anunciar Veículo
            </Link>
            {token ? (
              <Button onClick={handleLogout} variant="secondary">
                Sair
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Cadastre-se</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};