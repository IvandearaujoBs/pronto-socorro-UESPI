import React, { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/router'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedTypes?: string[]
  redirectTo?: string
}

export default function ProtectedRoute({ 
  children, 
  allowedTypes = [], 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { usuario, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // Se não estiver logado, redirecionar para login
      if (!usuario) {
        router.push(redirectTo)
        return
      }

      // Se há tipos permitidos especificados, verificar se o usuário tem permissão
      if (allowedTypes.length > 0 && !allowedTypes.includes(usuario.tipo)) {
        // Redirecionar para a página apropriada baseada no tipo do usuário
        switch (usuario.tipo) {
          case 'atendente':
            router.push('/recepcao')
            break
          case 'triador':
            router.push('/triagem')
            break
          case 'medico':
            router.push('/medico')
            break
          case 'admin':
            router.push('/')
            break
          default:
            router.push('/')
        }
        return
      }
    }
  }, [usuario, loading, allowedTypes, redirectTo, router])

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não estiver logado, não renderizar nada (será redirecionado)
  if (!usuario) {
    return null
  }

  // Se há tipos permitidos e o usuário não tem permissão, não renderizar nada
  if (allowedTypes.length > 0 && !allowedTypes.includes(usuario.tipo)) {
    return null
  }

  // Renderizar o conteúdo protegido
  return <>{children}</>
} 