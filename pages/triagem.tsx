import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Paciente {
  id: number
  nome: string
  cpf: string
  nascimento: string
  fila_id?: number
}

interface Triagem {
  pressao: string
  temperatura: string
  batimentos: string
  risco: string
}

export default function Triagem() {
  const router = useRouter()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null)
  const [triagem, setTriagem] = useState<Triagem>({
    pressao: '',
    temperatura: '',
    batimentos: '',
    risco: ''
  })
  const [mensagem, setMensagem] = useState('')
  const [mensagemAcao, setMensagemAcao] = useState('')
  const [modalRemover, setModalRemover] = useState<{id: number, nome: string} | null>(null)
  const [motivoRemocao, setMotivoRemocao] = useState('')
  const motivoRef = useRef<HTMLTextAreaElement>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState('')

  useEffect(() => {
    carregarPacientes()
  }, [])

  const carregarPacientes = async () => {
    try {
      const response = await fetch('/api/pacientes/sem-triagem')
      console.log('Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('Pacientes carregados:', data)
        setPacientes(data)
      } else {
        console.error('Error loading patients:', response.statusText)
      }
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pacienteSelecionado) {
      setMensagem('Selecione um paciente primeiro')
      setTimeout(() => setMensagem(''), 3000)
      return
    }

    try {
      const response = await fetch('/api/triagem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pacienteId: pacienteSelecionado.id,
          filaId: pacienteSelecionado.fila_id,
          ...triagem
        }),
      })

      if (response.ok) {
        setMensagemSucesso('Triagem realizada com sucesso!')
        setTimeout(() => setMensagemSucesso(''), 3000)
        setTriagem({ pressao: '', temperatura: '', batimentos: '', risco: '' })
        setPacienteSelecionado(null)
        carregarPacientes()
      } else {
        const error = await response.json()
        setMensagem(error.error || 'Erro ao realizar triagem')
        setTimeout(() => setMensagem(''), 3000)
      }
    } catch (error) {
      setMensagem('Erro ao realizar triagem')
      setTimeout(() => setMensagem(''), 3000)
    }
  }

  const niveisRisco = [
    { valor: 'vermelho', label: 'Vermelho - Emergência' },
    { valor: 'laranja', label: 'Laranja - Muito Urgente' },
    { valor: 'amarelo', label: 'Amarelo - Urgente' },
    { valor: 'verde', label: 'Verde - Pouco Urgente' },
    { valor: 'azul', label: 'Azul - Não Urgente' }
  ]

  const getLabelRisco = (risco: string | null) => {
    if (!risco) return 'Sem Risco'
    
    const labels = {
      vermelho: 'Vermelho - Emergência',
      laranja: 'Laranja - Muito Urgente',
      amarelo: 'Amarelo - Urgente',
      verde: 'Verde - Pouco Urgente',
      azul: 'Azul - Não Urgente'
    }
    return labels[risco as keyof typeof labels] || risco
  }

  return (
    <>
      <Head>
        <title>Triagem - ClinicFlow</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-orange-600 hover:text-orange-800">
              ← Voltar ao Menu Principal
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">🏥 Triagem</h1>
            <button onClick={() => { localStorage.removeItem('user'); router.push('/login'); }} className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-colors duration-200 font-semibold">Sair</button>
          </div>

          {/* Mensagem de ação */}
          {mensagemAcao && (
            <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-yellow-100 border border-yellow-400 text-yellow-800 px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold animate-fadeIn">
              {mensagemAcao}
            </div>
          )}

          {/* Mensagem de sucesso */}
          {mensagemSucesso && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-100 border border-green-400 text-green-800 px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold animate-fadeIn">
              {mensagemSucesso}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lista de Pacientes */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-0">
                  Pacientes Aguardando Triagem ({pacientes.length})
                </h2>
                <button
                  onClick={() => {
                    if (pacientes.length > 0) {
                      setPacienteSelecionado(pacientes[0]);
                    } else {
                      setMensagemAcao('Não há pacientes aguardando triagem');
                      setTimeout(() => setMensagemAcao(''), 3000);
                    }
                  }}
                  disabled={pacientes.length === 0}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
                >
                  Próximo
                </button>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {pacientes.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum paciente aguardando triagem
                  </p>
                ) : (
                  pacientes.map((paciente, index) => (
                    <div
                      key={paciente.id}
                      onClick={() => setPacienteSelecionado(paciente)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        pacienteSelecionado?.id === paciente.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-800 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg border-2 border-gray-900">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">
                              {paciente.nome}
                            </div>
                            <div className="text-sm text-gray-600">CPF: {paciente.cpf}</div>
                          </div>
                        </div>
                        <button
                          className="ml-4 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                          onClick={e => {
                            e.stopPropagation();
                            setModalRemover({id: paciente.id, nome: paciente.nome});
                            setMotivoRemocao('');
                            setTimeout(() => motivoRef.current?.focus(), 100);
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Formulário de Triagem */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Avaliação de Triagem
              </h2>

              {pacienteSelecionado ? (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                  <div className="font-medium text-orange-800">
                    Paciente Selecionado: {pacienteSelecionado.nome}
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-gray-600">
                    Selecione um paciente para realizar a triagem
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pressão Arterial
                  </label>
                  <input
                    type="text"
                    value={triagem.pressao}
                    onChange={(e) => setTriagem({ ...triagem, pressao: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-600"
                    placeholder="Ex: 120/80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura (°C)
                  </label>
                  <input
                    type="text"
                    value={triagem.temperatura}
                    onChange={(e) => setTriagem({ ...triagem, temperatura: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-600"
                    placeholder="Ex: 36.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batimentos Cardíacos (bpm)
                  </label>
                  <input
                    type="text"
                    value={triagem.batimentos}
                    onChange={(e) => setTriagem({ ...triagem, batimentos: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-orange-600"
                    placeholder="Ex: 80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Risco *
                  </label>
                  <select
                    required
                    value={triagem.risco}
                    onChange={(e) => setTriagem({ ...triagem, risco: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-400 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-600"
                  >
                    <option value="" className="text-gray-500">Selecione o nível de risco</option>
                    {niveisRisco.map((nivel) => (
                      <option key={nivel.valor} value={nivel.valor} className="text-black">
                        {nivel.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!pacienteSelecionado}
                  className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Realizar Triagem
                </button>
              </form>

              {mensagem && (
                <div className={`mt-4 p-4 rounded-lg ${
                  mensagem.includes('successfully') 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {mensagem}
                </div>
              )}
            </div>
          </div>

          {/* Legenda de Cores */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              🎨 Legenda de Cores de Risco
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {niveisRisco.map((nivel) => (
                <div key={nivel.valor} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded-full bg-${nivel.valor === 'vermelho' ? 'red' : nivel.valor === 'laranja' ? 'orange' : nivel.valor === 'amarelo' ? 'yellow' : nivel.valor === 'verde' ? 'green' : 'blue'}-500`}></div>
                  <span className="text-sm text-gray-700">{nivel.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de motivo da remoção */}
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
                  await fetch(`/api/pacientes/${modalRemover.id}/remover`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ motivo: motivoRemocao })
                  });
                  setModalRemover(null);
                  setMotivoRemocao('');
                  carregarPacientes();
                }}
              >
                Confirmar Remoção
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 