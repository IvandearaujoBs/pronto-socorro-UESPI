import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Páginas que não precisam de autenticação
  const publicPages = ['/login']
  
  // Se for uma página pública, permitir acesso
  if (publicPages.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Se for a página raiz, permitir acesso (será redirecionado pelo componente)
  if (pathname === '/') {
    return NextResponse.next()
  }
  
  // Para todas as outras páginas, verificar se há token de autenticação
  // Como estamos usando localStorage no cliente, não podemos verificar aqui
  // O redirecionamento será feito pelos componentes ProtectedRoute
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
} 