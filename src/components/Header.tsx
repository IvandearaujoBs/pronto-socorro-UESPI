import React, { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { usuario, logout } = useAuth()
  const [mostrarMenu, setMostrarMenu] = useState(false)

  const getTipoLabel = (tipo: string) => {
    const labels = {
      atendente: '👥 Atendente',
      triador: '🏥 Triador',
      medico: '👨‍⚕️ Médico',
      admin: '⚙️ Administrador'
    }
    return labels[tipo as keyof typeof labels] || tipo
  }

  const getTipoCor = (tipo: string) => {
    const cores = {
      atendente: 'bg-blue-100 text-blue-800',
      triador: 'bg-orange-100 text-orange-800',
      medico: 'bg-green-100 text-green-800',
      admin: 'bg-purple-100 text-purple-800'
    }
    return cores[tipo as keyof typeof cores] || 'bg-gray-100 text-gray-800'
  }

  const handleLogout = () => {
    logout()
  }

  if (!usuario) return null

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Nome do Sistema */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-blue-900">
                ClinicFlow
              </h1>
            </Link>
            <div className="hidden md:block">
              <p className="text-sm text-gray-600">
                Sistema de Gerenciamento de Fila
              </p>
            </div>
          </div>

          {/* Informações do Usuário */}
          <div className="flex items-center space-x-4">
            {/* Informações do Usuário - Desktop */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {usuario.nome}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoCor(usuario.tipo)}`}>
                  {getTipoLabel(usuario.tipo)}
                </span>
              </div>
              
              {/* Botão de Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                <span>🚪</span>
                <span>Sair</span>
              </button>
            </div>

            {/* Menu Mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setMostrarMenu(!mostrarMenu)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="text-xl">☰</span>
              </button>
            </div>
          </div>
        </div>

        {/* Menu Mobile Expandido */}
        {mostrarMenu && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-3">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-900">
                  {usuario.nome}
                </p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTipoCor(usuario.tipo)}`}>
                  {getTipoLabel(usuario.tipo)}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
              >
                <span>🚪</span>
                <span>Sair do Sistema</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
} 