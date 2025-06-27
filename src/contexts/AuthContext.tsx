import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface Usuario {
  id: number
  nome: string
  usuario: string
  tipo: 'atendente' | 'triador' | 'medico' | 'admin'
  ativo: boolean
  criado_em: string
}

interface AuthContextType {
  usuario: Usuario | null
  login: (usuario: string, senha: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se há um usuário salvo no localStorage
    const usuarioSalvo = localStorage.getItem('usuario')
    if (usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo))
      } catch (error) {
        console.error('Erro ao carregar usuário do localStorage:', error)
        localStorage.removeItem('usuario')
      }
    }
    setLoading(false)
  }, [])

  const login = async (usuario: string, senha: string) => {
    try {
      const response = await fetch('/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, senha }),
      })

      const data = await response.json()

      if (response.ok) {
        setUsuario(data.usuario)
        localStorage.setItem('usuario', JSON.stringify(data.usuario))
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.error }
      }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, message: 'Erro de conexão' }
    }
  }

  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  const value = {
    usuario,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 