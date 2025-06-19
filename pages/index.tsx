import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface Estatisticas {
  resumo: {
    pacientes: number
    triagens: number
    fila: number
  }
  totalTempoEstourado: number
}

export default function Home() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarEstatisticas()
    const interval = setInterval(carregarEstatisticas, 5000) // Atualizar a cada 5 segundos
    return () => clearInterval(interval)
  }, [])

  const carregarEstatisticas = async () => {
    try {
      const response = await fetch('/api/debug')
      if (response.ok) {
        const data = await response.json()
        setEstatisticas(data)
      }
    } catch (error) {
      console.error('Error loading statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sistema de Fila - Pronto Socorro</title>
        <meta name="description" content="Sistema de gerenciamento de fila do pronto socorro" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🏥 Sistema de Fila - Pronto Socorro
            </h1>
            <p className="text-xl text-gray-600">
              Gerencie pacientes, triagem e atendimento médico
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Recepção */}
            <Link href="/recepcao" className="group">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-blue-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Recepção</h2>
                  <p className="text-gray-600 text-sm">
                    Cadastro e registro de pacientes
                  </p>
                </div>
              </div>
            </Link>

            {/* Triagem */}
            <Link href="/triagem" className="group">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-orange-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏥</div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Triagem</h2>
                  <p className="text-gray-600 text-sm">
                    Avaliação de risco e priorização
                  </p>
                </div>
              </div>
            </Link>

            {/* Médico */}
            <Link href="/medico" className="group">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-green-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">👨‍⚕️</div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Médico</h2>
                  <p className="text-gray-600 text-sm">
                    Atendimento e consultas
                  </p>
                </div>
              </div>
            </Link>

            {/* Fila */}
            <Link href="/fila" className="group">
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-purple-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">📋</div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Fila</h2>
                  <p className="text-gray-600 text-sm">
                    Visualizar fila de espera
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Estatísticas Rápidas */}
          <div className="mt-12 bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              📊 Estatísticas Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {loading ? '...' : estatisticas?.resumo.fila || 0}
                </div>
                <div className="text-sm text-gray-600">Pacientes na Fila</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {loading ? '...' : estatisticas?.resumo.triagens || 0}
                </div>
                <div className="text-sm text-gray-600">Triagens Realizadas</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {loading ? '...' : estatisticas?.resumo.pacientes || 0}
                </div>
                <div className="text-sm text-gray-600">Total de Pacientes</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">
                  {loading ? '...' : estatisticas?.totalTempoEstourado || 0}
                </div>
                <div className="text-sm text-gray-600">Tempo Estourado</div>
              </div>
            </div>
            
            {/* Link para Debug */}
            <div className="mt-6 text-center">
              <Link href="/debug" className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <span className="mr-2">🐛</span>
                Debug do Sistema
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 