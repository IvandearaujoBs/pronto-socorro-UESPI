import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface PacienteFila {
  id: number
  paciente: {
    id: number
    nome: string
    cpf: string
    nascimento: string
  }
  triagem: {
    pressao: string
    temperatura: string
    batimentos: string
    risco: string
  }
  status: string
  chamada_em: string
  data_triagem: string
  minutosEspera: number
  tempoMax: number
}

export default function Fila() {
  const router = useRouter()
  const [fila, setFila] = useState<PacienteFila[]>([])
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    porRisco: {
      vermelho: 0,
      laranja: 0,
      amarelo: 0,
      verde: 0,
      azul: 0
    }
  })

  useEffect(() => {
    carregarFila()
    const interval = setInterval(carregarFila, 3000)
    return () => clearInterval(interval)
  }, [])

  const carregarFila = async () => {
    try {
      const response = await fetch('/api/fila')
      if (response.ok) {
        const data = await response.json()
        setFila(data)
        const stats = {
          total: data.length,
          porRisco: {
            vermelho: data.filter((item: PacienteFila) => item.triagem.risco === 'vermelho').length,
            laranja: data.filter((item: PacienteFila) => item.triagem.risco === 'laranja').length,
            amarelo: data.filter((item: PacienteFila) => item.triagem.risco === 'amarelo').length,
            verde: data.filter((item: PacienteFila) => item.triagem.risco === 'verde').length,
            azul: data.filter((item: PacienteFila) => item.triagem.risco === 'azul').length
          }
        }
        setEstatisticas(stats)
      }
    } catch (error) {
      console.error('Erro ao carregar fila:', error)
    }
  }

  const getCorRisco = (risco: string | null) => {
    if (!risco) return 'bg-gray-500'
    const cores = {
      vermelho: 'bg-red-500',
      laranja: 'bg-orange-500',
      amarelo: 'bg-yellow-500',
      verde: 'bg-green-500',
      azul: 'bg-blue-500',
      'sem-risco': 'bg-gray-500'
    }
    return cores[risco as keyof typeof cores] || 'bg-gray-500'
  }

  const getLabelRisco = (risco: string | null) => {
    if (!risco) return 'Sem Risco'
    const labels = {
      vermelho: 'Vermelho - Emergência',
      laranja: 'Laranja - Muito Urgente',
      amarelo: 'Amarelo - Urgente',
      verde: 'Verde - Pouco Urgente',
      azul: 'Azul - Não Urgente',
      'sem-risco': 'Sem Risco'
    }
    return labels[risco as keyof typeof labels] || risco
  }

  const getTempoMaximo = (risco: string | null) => {
    if (!risco) return 0
    const tempos = {
      vermelho: 0,
      laranja: 10,
      amarelo: 60,
      verde: 120,
      azul: 240
    }
    return tempos[risco as keyof typeof tempos] || 0
  }

  const isTempoEstourado = (chamadaEm: string, risco: string | null) => {
    const tempoMaximo = getTempoMaximo(risco)
    const agora = new Date()
    const chamada = new Date(chamadaEm)
    const diffMs = agora.getTime() - chamada.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return diffMins > tempoMaximo
  }

  // Função utilitária para converter para horário de Brasília
  function toBrasiliaDate(dateString: string) {
    const utcDate = new Date(dateString);
    // Ajusta para UTC-3
    const brasiliaOffset = -3 * 60; // minutos
    return new Date(utcDate.getTime() + brasiliaOffset * 60000);
  }

  return (
    <>
      <Head>
        <title>Fila de Atendimento - ClinicFlow</title>
        <meta name="description" content="Fila de espera em tempo real" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-block bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700 transition-colors duration-200 font-semibold">
              ← Voltar ao Menu Principal
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">📋 Fila</h1>
            <button onClick={() => { localStorage.removeItem('user'); router.push('/login'); }} className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-colors duration-200 font-semibold">Sair</button>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              📊 Estatísticas da Fila
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{estatisticas.total}</div>
                <div className="text-sm text-gray-600">Total na Fila</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-3xl font-bold text-red-600">{estatisticas.porRisco.vermelho}</div>
                <div className="text-sm text-gray-600">Vermelho</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{estatisticas.porRisco.laranja}</div>
                <div className="text-sm text-gray-600">Laranja</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-yellow-600">{estatisticas.porRisco.amarelo}</div>
                <div className="text-sm text-gray-600">Amarelo</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{estatisticas.porRisco.verde}</div>
                <div className="text-sm text-gray-600">Verde</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{estatisticas.porRisco.azul}</div>
                <div className="text-sm text-gray-600">Azul</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Lista de Pacientes na Fila
              </h2>
              <div className="text-sm text-gray-500">
                Atualizado em: {new Date().toLocaleTimeString()}
              </div>
            </div>
            {fila.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Fila Vazia!
                </h3>
                <p className="text-gray-600">
                  Não há pacientes aguardando atendimento no momento.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {fila.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 border rounded-lg cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg bg-white animate-fadeIn"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold shadow-md border-2 border-purple-700">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {item.paciente.nome}
                          </h3>
                          <p className="text-sm text-gray-600">
                            CPF: {item.paciente.cpf}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getCorRisco(item.triagem.risco)}`}>
                          {item.triagem.risco?.toUpperCase() || 'Sem Risco'}
                        </span>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${item.minutosEspera > item.tempoMax ? 'text-red-600' : 'text-gray-800'}`}> 
                            {item.tempoMax - item.minutosEspera > 0
                              ? `${item.tempoMax - item.minutosEspera} min restantes`
                              : 'Tempo estourado!'}
                          </div>
                          <div className="text-xs text-gray-500">
                            desde {toBrasiliaDate(item.chamada_em).toLocaleTimeString('pt-BR')}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Pressão:</span> {item.triagem.pressao || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Temperatura:</span> {item.triagem.temperatura || 'N/A'}°C
                      </div>
                      <div>
                        <span className="font-medium">Batimentos:</span> {item.triagem.batimentos || 'N/A'} bpm
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🎨 Legenda de Cores de Risco
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { risco: 'vermelho', label: 'Vermelho - Emergência' },
                { risco: 'laranja', label: 'Laranja - Muito Urgente' },
                { risco: 'amarelo', label: 'Amarelo - Urgente' },
                { risco: 'verde', label: 'Verde - Pouco Urgente' },
                { risco: 'azul', label: 'Azul - Não Urgente' },
                { risco: 'sem-risco', label: 'Sem Risco' }
              ].map((nivel) => (
                <div key={nivel.risco} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full ${getCorRisco(nivel.risco)}`}></div>
                  <span className="text-sm text-gray-700">{nivel.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 