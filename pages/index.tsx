import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'

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
    const interval = setInterval(carregarEstatisticas, 10000) // Atualizar a cada 10 segundos para melhorar performance
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
        <title>ClinicFlow - Emergency Queue Management</title>
        <meta name="description" content="Sistema de gerenciamento de fila do pronto socorro" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-12">
            {/* <Image
              src="/logo.png"
              alt="ClinicFlow Logo"
              width={600}
              height={150}
              className="mx-auto mb-6 mix-blend-multiply"
              priority
            /> */}
            <h1 className="text-5xl font-bold text-blue-900 mb-2">
              ClinicFlow
            </h1>
            <p className="text-xl text-gray-600">
              emergency queue management system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Recepção */}
            <Link href="/recepcao" className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="text-center">
                  <div className="text-4xl mb-4">👥</div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">Recepção</h2>
                  <p className="text-gray-600 text-sm">
                    Cadastro e registro de pacientes
                  </p>
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
      <footer className="w-full bg-gradient-to-br from-purple-50 to-indigo-100 py-4 text-center text-sm text-gray-600 border-0">
        <div>
          <strong>ClinicFlow</strong> — Sistema de Gerenciamento de Fila do Pronto Socorro<br />
          Projeto acadêmico desenvolvido por: <strong>Ivanildo Araujo</strong>, <strong>Jefferson Melo</strong> e <strong>Adonias Terceiro</strong><br />
          Direitos reservados © {new Date().getFullYear()}<br />
          Intuito: Otimizar o atendimento e triagem de pacientes segundo o Protocolo de Manchester.<br />
          Contato: <a href="https://wa.me/5586995880501" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">WhatsApp: (86) 99588-0501</a>
        </div>
      </footer>
    </>
  )
} 