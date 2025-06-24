import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

interface DebugData {
  resumo: {
    pacientes: number
    triagens: number
    fila: number
  }
  filaPorStatus: Array<{
    status: string
    quantidade: number
  }>
  pacientesDetalhado: Array<{
    nome: string
    status: string | null
    risco: string | null
  }>
}

export default function Debug() {
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [limpezaLoading, setLimpezaLoading] = useState(false)

  useEffect(() => {
    carregarDebug()
  }, [])

  const carregarDebug = async () => {
    try {
      const response = await fetch('/api/debug')
      if (response.ok) {
        const data = await response.json()
        setDebugData(data)
      } else {
        setError('Erro ao carregar dados de debug')
      }
    } catch (error) {
      setError('Erro ao carregar dados de debug')
    } finally {
      setLoading(false)
    }
  }

  const limparDados = async () => {
    if (!confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      return
    }
    setLimpezaLoading(true)
    try {
      const response = await fetch('/api/limpar-dados', {
        method: 'POST'
      })
      if (response.ok) {
        alert('Dados limpos com sucesso!')
        carregarDebug()
      } else {
        alert('Erro ao limpar dados')
      }
    } catch (error) {
      alert('Erro ao limpar dados')
    } finally {
      setLimpezaLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Carregando...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Debug - ClinicFlow</title>
      </Head>
      <main className="min-h-screen bg-gray-100 p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold text-gray-800">Debug - ClinicFlow</h1>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
                ← Voltar ao Menu Principal
              </Link>
              <button
                onClick={limparDados}
                disabled={limpezaLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {limpezaLoading ? 'Limpando...' : '🗑️ Limpar Dados'}
              </button>
            </div>
          </div>
          {debugData && (
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  📊 Resumo do Sistema
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">{debugData.resumo.pacientes}</div>
                    <div className="text-sm text-gray-600">Pacientes Cadastrados</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">{debugData.resumo.triagens}</div>
                    <div className="text-sm text-gray-600">Triagens Realizadas</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-purple-600">{debugData.resumo.fila}</div>
                    <div className="text-sm text-gray-600">Itens na Fila</div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  📋 Fila por Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  {debugData.filaPorStatus.map((item) => (
                    <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800">{item.quantidade}</div>
                      <div className="text-sm text-gray-600">{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  🧑‍⚕️ Pacientes Detalhado
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Nome</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Risco</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debugData.pacientesDetalhado.map((paciente, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="px-4 py-2 font-medium text-gray-900">{paciente.nome}</td>
                          <td className="px-4 py-2 text-gray-700">{paciente.status}</td>
                          <td className="px-4 py-2">
                            {paciente.risco && (
                              <span className={`px-2 py-1 rounded-full text-xs text-white ${
                                paciente.risco === 'vermelho' ? 'bg-red-500' :
                                paciente.risco === 'laranja' ? 'bg-orange-500' :
                                paciente.risco === 'amarelo' ? 'bg-yellow-500' :
                                paciente.risco === 'verde' ? 'bg-green-500' :
                                paciente.risco === 'azul' ? 'bg-blue-500' :
                                'bg-gray-500'
                              }`}>
                                {paciente.risco}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
} 