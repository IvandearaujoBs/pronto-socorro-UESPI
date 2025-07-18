import React, { useState, useEffect, useRef } from 'react'
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
}

export default function Medico() {
  const router = useRouter()
  const [fila, setFila] = useState<PacienteFila[]>([])
  const [pacienteAtual, setPacienteAtual] = useState<PacienteFila | null>(null)
  const [diagnostico, setDiagnostico] = useState('')
  const [prescricao, setPrescricao] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [mensagemAcao, setMensagemAcao] = useState('')
  const [modalRemover, setModalRemover] = useState<{id: number, nome: string} | null>(null)
  const [motivoRemocao, setMotivoRemocao] = useState('')
  const motivoRef = useRef<HTMLTextAreaElement>(null)
  const [mensagemSucesso, setMensagemSucesso] = useState('')

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
        setFila(data)
      }
    } catch (error) {
      console.error('Error loading queue:', error)
    }
  }

  const chamarProximo = async () => {
    if (fila.length === 0) {
      setMensagemAcao('Nenhum paciente na fila de atendimento');
      setTimeout(() => setMensagemAcao(''), 3000);
      return;
    }
    try {
      const response = await fetch('/api/fila/proximo', {
        method: 'POST',
      })
      if (response.ok) {
        const data = await response.json()
        setPacienteAtual(data)
        setDiagnostico('')
        setPrescricao('')
        carregarFila()
        setMensagem('')
        setMensagemSucesso('Paciente chamado com sucesso!')
        setTimeout(() => setMensagemSucesso(''), 3000)
      } else {
        setMensagem('Nenhum paciente na fila')
        setTimeout(() => setMensagem(''), 3000)
      }
    } catch (error) {
      setMensagem('Erro ao chamar próximo paciente')
      setTimeout(() => setMensagem(''), 3000)
    }
  }

  const finalizarAtendimento = async () => {
    if (!pacienteAtual) {
      setMensagemAcao('Nenhum paciente em atendimento');
      setTimeout(() => setMensagemAcao(''), 3000);
      return;
    }
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
        setMensagemSucesso('Atendimento finalizado com sucesso!')
        setTimeout(() => setMensagemSucesso(''), 3000)
        setPacienteAtual(null)
        setDiagnostico('')
        setPrescricao('')
        carregarFila()
      } else {
        setMensagem('Erro ao finalizar atendimento')
        setTimeout(() => setMensagem(''), 3000)
      }
    } catch (error) {
      setMensagem('Erro ao finalizar atendimento')
      setTimeout(() => setMensagem(''), 3000)
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
      vermelho: 15,
      laranja: 10,
      amarelo: 5,
      verde: 2,
      azul: 1,
      'sem-risco': 0
    }
    return tempos[risco as keyof typeof tempos] || 0
  }

  // Componente para tempo regressivo
  function TempoRestante({ dataTriagem, tempoMaximoMinutos }: { dataTriagem: string, tempoMaximoMinutos: number }) {
    const [restante, setRestante] = useState("");
    useEffect(() => {
      function atualizar() {
        const triagem = new Date(dataTriagem);
        const limite = new Date(triagem.getTime() + tempoMaximoMinutos * 60000);
        const agora = new Date();
        const diff = Math.floor((limite.getTime() - agora.getTime()) / 1000);
        if (diff <= 0) {
          setRestante("Tempo esgotado");
        } else {
          const minutos = Math.floor(diff / 60);
          const segundos = diff % 60;
          setRestante(`Falta ${minutos}m ${segundos < 10 ? "0" : ""}${segundos}s`);
        }
      }
      atualizar();
      const timer = setInterval(atualizar, 1000);
      return () => clearInterval(timer);
    }, [dataTriagem, tempoMaximoMinutos]);
    const triagemFormatada = new Date(dataTriagem).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    return (
      <div className="text-xs text-gray-500">
        Triado às {triagemFormatada}<br />
        <span className={restante === "Tempo esgotado" ? "text-red-600 font-bold" : ""}>{restante}</span>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Médico - ClinicFlow</title>
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">👨‍⚕️ Médico</h1>
            <button onClick={() => { localStorage.removeItem('user'); router.push('/login'); }} className="ml-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition-colors duration-200 font-semibold">Sair</button>
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
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {fila.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    Nenhum paciente aguardando atendimento
                  </p>
                ) : (
                  fila.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg cursor-pointer transition-all duration-500 ease-in-out transform hover:scale-105 hover:shadow-lg bg-white animate-fadeIn"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-md border-2 border-green-700">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-800">
                            {item.paciente.nome}
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getCorRisco(item.triagem.risco)}`}>
                          {item.triagem.risco?.toUpperCase() || 'Sem Risco'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        CPF: {item.paciente.cpf}
                      </div>
                      <TempoRestante dataTriagem={item.data_triagem} tempoMaximoMinutos={getTempoMaximo(item.triagem.risco)} />
                      <div className="text-xs text-gray-500 mt-1">
                        Aguardando desde: {new Date(item.chamada_em).toLocaleTimeString()}
                      </div>
                      <button
                        className="ml-4 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                        onClick={e => {
                          e.stopPropagation();
                          setModalRemover({id: item.paciente.id, nome: item.paciente.nome});
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
                      Paciente: {pacienteAtual.paciente.nome}
                    </h3>
                    <div className="text-sm text-green-700 space-y-1">
                      <div>CPF: {pacienteAtual.paciente.cpf}</div>
                      <div>Nascimento: {pacienteAtual.paciente.nascimento}</div>
                      <div className="flex items-center space-x-2">
                        <span>Risco:</span>
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${getCorRisco(pacienteAtual.triagem.risco)}`}>
                          {getLabelRisco(pacienteAtual.triagem.risco)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Dados da Triagem</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm text-blue-700">
                      <div>
                        <span className="font-medium">Pressão:</span> {pacienteAtual.triagem.pressao}
                      </div>
                      <div>
                        <span className="font-medium">Temperatura:</span> {pacienteAtual.triagem.temperatura}°C
                      </div>
                      <div>
                        <span className="font-medium">Batimentos:</span> {pacienteAtual.triagem.batimentos} bpm
                      </div>
                    </div>
                  </div>
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
                    await fetch(`/api/pacientes/${modalRemover.id}/remover`, {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ motivo: motivoRemocao })
                    });
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
      </main>
    </>
  )
} 