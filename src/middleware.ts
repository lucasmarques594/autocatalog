import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // 'jose' é uma lib mais moderna e segura para JWTs

// Instale a dependência: npm install jose
// (Adicionei no comando inicial, mas caso tenha pulado)

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value; // Supondo que você salve o token em cookies

  if (!token) {
    // Redireciona para o login se não houver token e a rota for protegida
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verifica o token
    const { payload } = await jwtVerify(token, secret);
    
    // Você pode adicionar lógicas baseadas no 'role' aqui
    // Ex: const { role } = payload;
    // if (request.nextUrl.pathname.startsWith('/admin') && role !== 'ADMIN') {
    //   return NextResponse.redirect(new URL('/unauthorized', request.url));
    // }
    
    // Se o token for válido, continue para a rota solicitada
    return NextResponse.next();
  } catch (err) {
    // Se o token for inválido, redireciona para o login
    console.error('Token inválido:', err);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Configuração do Matcher: Define quais rotas serão protegidas pelo middleware
export const config = {
  matcher: [
    '/cars/new', // Proteger a página de anúncio
    '/dashboard/:path*', // Proteger um futuro dashboard
    // Não inclua '/api/auth/...' aqui, pois elas precisam ser públicas
    // Para proteger rotas de API, faremos a verificação dentro da própria rota.
  ],
};