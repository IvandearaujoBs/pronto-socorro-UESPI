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
    motivo_remocao?: string
  }>
  pacientesComTempoEstourado: Array<{
    id: number
    nome: string
    risco: string
    tempo_espera_minutos: number
    tempo_maximo_minutos: number
    tempo_estourado: boolean
  }>
  estatisticasPorRisco: Array<{
    risco: string
    total: number
    tempo_estourado: number
  }>
  totalTempoEstourado: number
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
        carregarDebug() // Recarregar dados
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
        <meta http-equiv="refresh" content="5" />
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
              {/* Resumo */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  📊 Resumo do Sistema
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">{debugData.totalTempoEstourado}</div>
                    <div className="text-sm text-gray-600">Tempo Estourado</div>
                  </div>
                </div>
              </div>

              {/* Estatísticas por Risco */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  ⏰ Estatísticas por Risco
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {debugData.estatisticasPorRisco.map((estatistica) => (
                    <div key={estatistica.risco} className="text-center p-4 rounded-lg border-2" style={{
                      backgroundColor: estatistica.risco === 'vermelho' ? '#fef2f2' :
                                      estatistica.risco === 'laranja' ? '#fff7ed' :
                                      estatistica.risco === 'amarelo' ? '#fefce8' :
                                      estatistica.risco === 'verde' ? '#f0fdf4' :
                                      estatistica.risco === 'azul' ? '#eff6ff' : '#f9fafb',
                      borderColor: estatistica.risco === 'vermelho' ? '#ef4444' :
                                  estatistica.risco === 'laranja' ? '#f97316' :
                                  estatistica.risco === 'amarelo' ? '#eab308' :
                                  estatistica.risco === 'verde' ? '#22c55e' :
                                  estatistica.risco === 'azul' ? '#3b82f6' : '#6b7280'
                    }}>
                      <div className="text-2xl font-bold" style={{
                        color: estatistica.risco === 'vermelho' ? '#dc2626' :
                               estatistica.risco === 'laranja' ? '#ea580c' :
                               estatistica.risco === 'amarelo' ? '#ca8a04' :
                               estatistica.risco === 'verde' ? '#16a34a' :
                               estatistica.risco === 'azul' ? '#2563eb' : '#374151'
                      }}>
                        {estatistica.total}
                      </div>
                      <div className="text-sm font-medium capitalize" style={{
                        color: estatistica.risco === 'vermelho' ? '#dc2626' :
                               estatistica.risco === 'laranja' ? '#ea580c' :
                               estatistica.risco === 'amarelo' ? '#ca8a04' :
                               estatistica.risco === 'verde' ? '#16a34a' :
                               estatistica.risco === 'azul' ? '#2563eb' : '#374151'
                      }}>
                        {estatistica.risco}
                      </div>
                      <div className="text-xs text-gray-600">
                        {estatistica.tempo_estourado} estourado(s)
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pacientes com Tempo Estourado */}
              {debugData.pacientesComTempoEstourado.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    ⚠️ Pacientes com Tempo Estourado
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left">Nome</th>
                          <th className="px-4 py-2 text-left">Risco</th>
                          <th className="px-4 py-2 text-left">Tempo de Espera</th>
                          <th className="px-4 py-2 text-left">Tempo Máximo</th>
                          <th className="px-4 py-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {debugData.pacientesComTempoEstourado.map((paciente) => (
                          <tr key={paciente.id} className={`border-b ${paciente.tempo_estourado ? 'bg-red-50' : ''}`}>
                            <td className="px-4 py-2 font-medium text-gray-900">{paciente.nome}</td>
                            <td className="px-4 py-2">
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
                            </td>
                            <td className="px-4 py-2">
                              <span className={`font-bold ${paciente.tempo_estourado ? 'text-red-600' : 'text-gray-600'}`}>
                                {paciente.tempo_espera_minutos} min
                              </span>
                            </td>
                            <td className="px-4 py-2 text-gray-600">
                              {paciente.tempo_maximo_minutos} min
                            </td>
                            <td className="px-4 py-2">
                              {paciente.tempo_estourado ? (
                                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                  ⚠️ TEMPO ESTOURADO
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  ✅ No prazo
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Status da Fila */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  📋 Status da Fila
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {debugData.filaPorStatus.map((item) => (
                    <div key={item.status} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{item.quantidade}</div>
                      <div className="text-sm text-gray-600">{item.status}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pacientes Detalhado */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  👥 Pacientes Detalhado
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-2 text-left">Nome</th>
                        <th className="px-4 py-2 text-left">Status da Fila</th>
                        <th className="px-4 py-2 text-left">Risco</th>
                        <th className="px-4 py-2 text-left">Motivo da Remoção</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debugData.pacientesDetalhado.map((paciente, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2 text-gray-900">{paciente.nome}</td>
                          <td className="px-4 py-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              paciente.status === 'esperando' ? 'bg-yellow-100 text-yellow-800' :
                              paciente.status === 'triagem_concluida' ? 'bg-green-100 text-green-800' :
                              paciente.status === 'em_atendimento' ? 'bg-blue-100 text-blue-800' :
                              paciente.status === 'atendido' ? 'bg-gray-100 text-gray-800' :
                              paciente.status === 'removido' ? 'bg-red-600 text-white font-bold' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {paciente.status === 'removido' ? 'Removido' : (paciente.status || 'Sem status')}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            {paciente.risco ? (
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
                            ) : 'Sem risco'}
                          </td>
                          <td className="px-4 py-2 text-sm text-red-700">
                            {paciente.status === 'removido' && paciente.motivo_remocao ? paciente.motivo_remocao : ''}
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