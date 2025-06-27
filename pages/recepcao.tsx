import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import ProtectedRoute from '../src/components/ProtectedRoute'
import Header from '../src/components/Header'

interface Paciente {
  nome: string
  cpf: string
  nascimento: string
  sexo: string
  sus: string
}

export default function Recepcao() {
  const [paciente, setPaciente] = useState<Paciente>({
    nome: '',
    cpf: '',
    nascimento: '',
    sexo: '',
    sus: ''
  })
  const [mensagem, setMensagem] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Tentando cadastrar paciente:', paciente)
    
    try {
      const response = await fetch('/api/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paciente),
      })

      console.log('Response status:', response.status)
      if (response.ok) {
        setMensagem('Paciente cadastrado com sucesso!')
        setPaciente({ nome: '', cpf: '', nascimento: '', sexo: '', sus: '' })
      } else {
        const error = await response.json()
        console.log('Error response:', error)
        if (error.error === 'CPF já cadastrado') {
          setMensagem('Erro: CPF já cadastrado')
        } else {
          setMensagem(`Erro: ${error.error || error.message}`)
        }
      }
    } catch (error) {
      console.error('Error registering patient:', error)
      setMensagem('Erro ao cadastrar paciente')
    }
  }

  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cpf = e.target.value.replace(/\D/g, '')
    if (cpf.length <= 11) {
      setPaciente({ ...paciente, cpf })
    }
  }

  return (
    <ProtectedRoute allowedTypes={['atendente', 'admin']}>
      <>
        <Head>
          <title>Recepção - ClinicFlow</title>
        </Head>
        
        <Header />
        
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">👥 Recepção</h1>
                <p className="text-gray-600 mt-1">Cadastro e registro de pacientes</p>
              </div>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                ← Voltar ao Menu Principal
              </Link>
            </div>

            <div className="max-w-2xl mx-auto">
              {/* Formulário de Cadastro */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Cadastrar Novo Paciente
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      required
                      value={paciente.nome}
                      onChange={(e) => setPaciente({ ...paciente, nome: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Digite o nome completo"
                    />
                  </div>

                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                      CPF *
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      required
                      value={formatarCPF(paciente.cpf)}
                      onChange={handleCPFChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="000.000.000-00"
                      maxLength={14}
                    />
                  </div>

                  <div>
                    <label htmlFor="nascimento" className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      id="nascimento"
                      value={paciente.nascimento}
                      onChange={(e) => setPaciente({ ...paciente, nascimento: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  <div>
                    <label htmlFor="sexo" className="block text-sm font-medium text-gray-700 mb-2">
                      Sexo *
                    </label>
                    <select
                      id="sexo"
                      required
                      value={paciente.sexo}
                      onChange={(e) => setPaciente({ ...paciente, sexo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Selecione</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="sus" className="block text-sm font-medium text-gray-700 mb-2">
                      Número do SUS
                    </label>
                    <input
                      type="text"
                      id="sus"
                      value={paciente.sus}
                      onChange={(e) => setPaciente({ ...paciente, sus: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Digite o número do SUS"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                  >
                    Cadastrar Paciente
                  </button>
                </form>

                {mensagem && (
                  <div className={`mt-4 p-4 rounded-lg ${
                    mensagem.includes('sucesso') 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {mensagem}
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="mt-8 bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  ℹ️ Informações Importantes
                </h3>
                <ul className="text-blue-700 space-y-2 text-sm">
                  <li>• Todos os campos marcados com * são obrigatórios</li>
                  <li>• O CPF deve ser único no sistema</li>
                  <li>• Após o cadastro, o paciente será direcionado para triagem</li>
                  <li>• A data de nascimento é opcional mas recomendada</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </>
    </ProtectedRoute>
  )
} 