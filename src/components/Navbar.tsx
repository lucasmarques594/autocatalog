// src/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { Button } from './ui/Button';
import { useEffect } from 'react';
import { useSession } from '@/hooks/use-session';
import { Car, LogOut, UserPlus, PlusCircle } from 'lucide-react';

export const Navbar = () => {
  const session = useSession();

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event("storage"));
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleStorageChange = () => { window.location.reload(); };
    window.addEventListener('storage', handleStorageChange);
    return () => { window.removeEventListener('storage', handleStorageChange); };
  }, []);

  return (
    <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors">
              <Car size={28} />
              <span>AutoCatalog</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            <Link href="/cars/new">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <PlusCircle className="w-4 h-4 mr-2" />
                Anunciar
              </Button>
            </Link>
            {session ? (
              <Button onClick={handleLogout} variant="secondary" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    <UserPlus className="w-4 h-4 mr-0 sm:mr-2" />
                    <span className="hidden sm:inline">Cadastre-se</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};