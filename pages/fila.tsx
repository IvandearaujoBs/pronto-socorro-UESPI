import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

const temposMaximos: Record<string, number> = {
  vermelho: 0,
  laranja: 10,
  amarelo: 50,
  verde: 120,
  azul: 240,
  'sem-risco': 0
};

interface PacienteFila {
  id: number
  nome: string
  risco: string
  status: string
  data_triagem?: string // Adicionado para contagem regressiva
}

interface FilaApiResponse {
  esperando: PacienteFila[]
  em_atendimento: PacienteFila[]
}

function TempoRestante({ dataTriagem, risco, onTempoEsgotado }: { dataTriagem: string, risco: string, onTempoEsgotado?: (esgotado: boolean) => void }) {
  const [restante, setRestante] = useState('');
  const [esgotado, setEsgotado] = useState(false);

  useEffect(() => {
    function atualizar() {
      const tempoMax = temposMaximos[risco] || 0;
      const triagem = new Date(dataTriagem);
      const agora = new Date();
      const diff = Math.floor((agora.getTime() - triagem.getTime()) / 60000); // minutos passados
      const faltam = tempoMax - diff;
      if (faltam <= 0) {
        setRestante('Tempo esgotado');
        setEsgotado(true);
        if (onTempoEsgotado) onTempoEsgotado(true);
      } else {
        setRestante(`Faltam ${faltam} min`);
        setEsgotado(false);
        if (onTempoEsgotado) onTempoEsgotado(false);
      }
    }
    atualizar();
    const timer = setInterval(atualizar, 10000); // atualiza a cada 10s
    return () => clearInterval(timer);
  }, [dataTriagem, risco]);

  return <span className={esgotado ? 'text-red-600 font-bold' : ''}>{restante}</span>;
}

export default function Fila() {
  const [esperando, setEsperando] = useState<PacienteFila[]>([])
  const [emAtendimento, setEmAtendimento] = useState<PacienteFila[]>([])
  const [tempoEsgotado, setTempoEsgotado] = useState<{[id: number]: boolean}>({})

  useEffect(() => {
    carregarFila()
    const interval = setInterval(carregarFila, 3000)
    return () => clearInterval(interval)
  }, [])

  const carregarFila = async () => {
    try {
      const response = await fetch('/api/fila')
      if (response.ok) {
        const data: FilaApiResponse = await response.json()
        setEsperando(data.esperando)
        setEmAtendimento(data.em_atendimento)
      }
    } catch (error) {
      console.error('Erro ao carregar fila:', error)
    }
  }

  const chamarPaciente = async (id: number) => {
    // Aqui você pode implementar a chamada do paciente, por exemplo, via API
    // ou redirecionar para a tela do médico
    // Exemplo: window.location.href = '/medico';
    // Ou chamar a API de chamar próximo, se necessário
    alert(`Paciente ${id} chamado!`)
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
    <>
      <Head>
        <title>Fila de Atendimento - ClinicFlow</title>
        <meta name="description" content="Fila de espera em tempo real" />
      </Head>
      <main className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="text-purple-600 hover:text-purple-800">
              ← Voltar ao Menu Principal
            </Link>
            <h1 className="text-3xl font-bold text-gray-800">📋 Fila de Atendimento</h1>
          </div>

          {/* Pacientes em atendimento */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              🩺 Em Atendimento
            </h2>
            {emAtendimento.length === 0 ? (
              <div className="text-center text-gray-600">Nenhum paciente está sendo atendido no momento.</div>
            ) : (
              <ul className="space-y-2">
                {emAtendimento.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <span className={`w-4 h-4 rounded-full inline-block ${getCorRisco(item.risco)}`}></span>
                    <span className="font-semibold text-gray-800">{item.nome}</span>
                    <span className="text-sm text-gray-600">({getLabelRisco(item.risco)})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pacientes esperando */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              ⏳ Aguardando Atendimento
            </h2>
            {esperando.length === 0 ? (
              <div className="text-center text-gray-600">Nenhum paciente aguardando na fila.</div>
            ) : (
              <ol className="space-y-2">
                {esperando.map((item, idx) => (
                  <li key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <span className="w-8 text-center font-bold text-purple-700">{idx + 1}</span>
                    <span className={`w-4 h-4 rounded-full inline-block ${getCorRisco(item.risco)}`}></span>
                    <span className="font-semibold text-gray-800">{item.nome}</span>
                    <span className="text-sm text-gray-600">({getLabelRisco(item.risco)})</span>
                    {item.data_triagem && (
                      <TempoRestante
                        dataTriagem={item.data_triagem}
                        risco={item.risco}
                        onTempoEsgotado={esgotado => setTempoEsgotado(prev => ({ ...prev, [item.id]: esgotado }))}
                      />
                    )}
                    {tempoEsgotado[item.id] && (
                      <button
                        className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-bold"
                        onClick={() => chamarPaciente(item.id)}
                      >
                        Chamar
                      </button>
                    )}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </main>
    </>
  )
} 