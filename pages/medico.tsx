import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import ProtectedRoute from '../src/components/ProtectedRoute'
import Header from '../src/components/Header'

interface TriagemInfo {
  pressao?: string | null
  temperatura?: string | null
  batimentos?: string | null
  risco?: string | null
}

interface PacienteFila {
  id: number
  nome: string
  risco: string
  status: string
  triagem?: TriagemInfo
}

export default function Medico() {
  const [fila, setFila] = useState<PacienteFila[]>([])
  const [pacienteAtual, setPacienteAtual] = useState<PacienteFila | null>(null)
  const [diagnostico, setDiagnostico] = useState('')
  const [prescricao, setPrescricao] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [modalRemover, setModalRemover] = useState<{id: number, nome: string} | null>(null)
  const [motivoRemocao, setMotivoRemocao] = useState('')
  const motivoRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    carregarFila()
    return () => {
      if (pacienteAtual && pacienteAtual.status === 'em_atendimento') {
        fetch(`/api/fila/${pacienteAtual.id}/devolver`, { method: 'PUT' });
      }
    };
  }, [])

  const carregarFila = async () => {
    try {
      const response = await fetch('/api/fila')
      if (response.ok) {
        const data = await response.json()
        setFila(data.esperando)
      }
    } catch (error) {
      console.error('Error loading queue:', error)
    }
  }

  const chamarProximo = async () => {
    try {
      const response = await fetch('/api/fila/proximo', {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        // data pode não ter todos os campos, mas vamos garantir nome e risco
        setPacienteAtual({
          id: data.id,
          nome: data.paciente?.nome || data.nome || '',
          risco: data.triagem?.risco || data.risco || '',
          status: data.status || '',
          triagem: data.triagem
        })
        setDiagnostico('')
        setPrescricao('')
        carregarFila()
      } else {
        setMensagem('No patients in queue')
      }
    } catch (error) {
      setMensagem('Error calling next patient')
    }
  }

  const finalizarAtendimento = async () => {
    if (!pacienteAtual) return

    try {
      const response = await fetch(`/api/fila/${pacienteAtual.id}/finalizar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          diagnostico,
          prescricao
        }),
      })

      if (response.ok) {
        setMensagem('Paciente atendido com sucesso!')
        setPacienteAtual(null)
        setDiagnostico('')
        setPrescricao('')
        carregarFila()
      } else {
        setMensagem('Error completing appointment')
      }
    } catch (error) {
      setMensagem('Error completing appointment')
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

  return (
    <ProtectedRoute allowedTypes={['medico', 'admin']}>
      <>
        <Head>
          <title>Médico - ClinicFlow</title>
        </Head>
        
        <Header />
        
        <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">👨‍⚕️ Médico</h1>
                <p className="text-gray-600 mt-1">Atendimento e consultas</p>
              </div>
              <Link href="/" className="text-green-600 hover:text-green-800">
                ← Voltar ao Menu Principal
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Fila de Espera ({fila.length})
                  </h2>
                  <button
                    onClick={chamarProximo}
                    disabled={fila.length === 0}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Chamar Próximo
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {fila.filter(item => item.status !== 'em_atendimento').length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum paciente na fila
                    </p>
                  ) : (
                    fila.filter(item => item.status !== 'em_atendimento').map((item, index) => (
                      <div
                        key={item.id}
                        className="p-4 border rounded-lg bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md border-2 border-green-700">
                              {index + 1}
                            </div>
                            <span className="font-medium text-gray-800">
                              {item.nome}
                            </span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs text-white ${getCorRisco(item.risco)}`}>
                            {item.risco?.toUpperCase() || 'Sem Risco'}
                          </span>
                        </div>
                        <button
                          className="ml-4 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                          onClick={e => {
                            e.stopPropagation();
                            setModalRemover({id: item.id, nome: item.nome});
                            setMotivoRemocao('');
                            setTimeout(() => motivoRef.current?.focus(), 100);
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Atendimento Atual
                </h2>
                {pacienteAtual ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-800 mb-2">
                        Paciente: {pacienteAtual.nome}
                      </h3>
                      <div className="text-sm text-green-700 space-y-1">
                        <div>Risco: <span className={`px-2 py-1 rounded-full text-xs text-white ${getCorRisco(pacienteAtual.risco)}`}>{getLabelRisco(pacienteAtual.risco)}</span></div>
                      </div>
                    </div>
                    {/* Informações da Triagem */}
                    {('triagem' in pacienteAtual) && (
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-2">Informações da Triagem</h4>
                        <div className="text-sm text-blue-900 grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div><strong>Pressão:</strong> {pacienteAtual.triagem?.pressao || '-'}</div>
                          <div><strong>Temperatura:</strong> {pacienteAtual.triagem?.temperatura || '-'}</div>
                          <div><strong>Batimentos:</strong> {pacienteAtual.triagem?.batimentos || '-'}</div>
                          <div><strong>Risco:</strong> {getLabelRisco(pacienteAtual.triagem?.risco ?? null) || '-'}</div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Diagnóstico
                        </label>
                        <textarea
                          value={diagnostico}
                          onChange={(e) => setDiagnostico(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900"
                          placeholder="Descreva o diagnóstico..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Prescrição
                        </label>
                        <textarea
                          value={prescricao}
                          onChange={(e) => setPrescricao(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900"
                          placeholder="Descreva a prescrição..."
                        />
                      </div>
                      <button
                        onClick={finalizarAtendimento}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Finalizar Atendimento
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">👨‍⚕️</div>
                    <p>Nenhum paciente em atendimento</p>
                    <p className="text-sm">Clique em "Chamar Próximo" para iniciar um atendimento</p>
                  </div>
                )}
                {mensagem && (
                  <div className={`mt-4 p-4 rounded-lg transition-all duration-700 transform ${
                    mensagem.includes('successfully') 
                      ? 'bg-green-100 text-green-800 border border-green-200 animate-fadeIn' 
                      : 'bg-red-100 text-red-800 border border-red-200 animate-fadeIn'
                  }`}>
                    {mensagem}
                  </div>
                )}
              </div>
            </div>
          </div>
          {modalRemover && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-lg font-semibold mb-2">Remover paciente</h2>
                <p className="mb-2">Informe o motivo da remoção de <span className="font-bold">{modalRemover.nome}</span>:</p>
                <textarea
                  ref={motivoRef}
                  className="w-full border border-gray-300 rounded p-2 mb-4 text-gray-900"
                  rows={3}
                  value={motivoRemocao}
                  onChange={e => setMotivoRemocao(e.target.value)}
                  placeholder="Digite o motivo..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={() => setModalRemover(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-300"
                    disabled={!motivoRemocao.trim()}
                    onClick={async () => {
                      const response = await fetch(`/api/pacientes/${modalRemover.id}/remover`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ motivo: motivoRemocao })
                      });
                      if (response.ok) {
                        setMensagem('Paciente removido');
                        setTimeout(() => setMensagem(''), 3000); // Limpar mensagem após 3 segundos
                      }
                      setModalRemover(null);
                      setMotivoRemocao('');
                      carregarFila();
                    }}
                  >
                    Confirmar Remoção
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </>
    </ProtectedRoute>
  )
} 