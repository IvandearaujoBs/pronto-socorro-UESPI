import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

interface User {
  id: number;
  nome: string;
  funcao: string;
}

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

export default function Admin() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [erro, setErro] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [formNome, setFormNome] = useState('')
  const [formFuncao, setFormFuncao] = useState('atendente')
  const [formSenha, setFormSenha] = useState('')
  const [formMsg, setFormMsg] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  // Controle de seção
  const [secao, setSecao] = useState<'usuarios' | 'debug'>('usuarios')

  // Estado para debug
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [debugLoading, setDebugLoading] = useState(true)
  const [debugError, setDebugError] = useState('')
  const [limpezaLoading, setLimpezaLoading] = useState(false)

  useEffect(() => {
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (!user) {
      router.replace('/login')
      return
    }
    const { funcao } = JSON.parse(user)
    if (funcao !== 'administrador') {
      router.replace('/')
    }
  }, [router])

  async function fetchUsers() {
    setLoading(true)
    setErro('')
    try {
      const res = await fetch('/api/users')
      if (!res.ok) throw new Error('Erro ao buscar usuários')
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      setErro('Erro ao buscar usuários')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  function handleLogout() {
    localStorage.removeItem('user')
    router.replace('/login')
  }

  async function handleNovoUsuario(e: React.FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    setFormMsg('')
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: formNome, funcao: formFuncao, senha: formSenha })
      })
      const data = await res.json()
      if (res.ok) {
        setFormMsg('Usuário cadastrado com sucesso!')
        setFormNome('')
        setFormFuncao('atendente')
        setFormSenha('')
        setShowForm(false)
        fetchUsers()
      } else {
        setFormMsg(data.error || 'Erro ao cadastrar usuário')
      }
    } catch (err) {
      setFormMsg('Erro ao conectar ao servidor')
    } finally {
      setFormLoading(false)
    }
  }

  // Mensagem de sucesso/erro some após 3 segundos
  useEffect(() => {
    if (formMsg) {
      const timer = setTimeout(() => setFormMsg(''), 3000)
      return () => clearTimeout(timer)
    }
  }, [formMsg])

  // Funções para os botões de ação
  function handleEditar(user: User) {
    alert(`Editar usuário: ${user.nome}`)
  }
  function handleRedefinirSenha(user: User) {
    alert(`Redefinir senha do usuário: ${user.nome}`)
  }
  function handleExcluir(user: User) {
    alert(`Excluir usuário: ${user.nome}`)
  }

  // Carregar dados de debug
  useEffect(() => {
    if (secao === 'debug') {
      carregarDebug()
    }
  }, [secao])

  const carregarDebug = async () => {
    setDebugLoading(true)
    setDebugError('')
    try {
      const response = await fetch('/api/debug')
      if (response.ok) {
        const data = await response.json()
        setDebugData(data)
      } else {
        setDebugError('Erro ao carregar dados de debug')
      }
    } catch (error) {
      setDebugError('Erro ao carregar dados de debug')
    } finally {
      setDebugLoading(false)
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-2">
      <Head>
        <title>Painel do Administrador - ClinicFlow</title>
      </Head>
      <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-lg p-8 flex flex-col gap-6">
        {/* Botão de logout no topo direito */}
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm font-semibold shadow"
        >Logout</button>
        {/* Título centralizado */}
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-2">Painel do Administrador</h1>
        {/* Abas de navegação */}
        <div className="flex gap-4 justify-center mb-4">
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold border-b-4 transition-all duration-200 ${secao === 'usuarios' ? 'border-blue-600 text-blue-800 bg-blue-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setSecao('usuarios')}
          >Usuários</button>
          <button
            className={`px-6 py-2 rounded-t-lg font-semibold border-b-4 transition-all duration-200 ${secao === 'debug' ? 'border-green-600 text-green-800 bg-green-50' : 'border-transparent text-gray-600 bg-gray-100 hover:bg-gray-200'}`}
            onClick={() => setSecao('debug')}
          >Debug</button>
        </div>
        {/* Seção Usuários */}
        {secao === 'usuarios' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2 relative z-10">
              <h2 className="text-lg font-semibold text-gray-900">Usuários cadastrados</h2>
              <button
                type="button"
                onClick={() => {
                  setShowForm(true);
                }}
                style={{ zIndex: 9999, pointerEvents: 'auto', position: 'relative' }}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                + Novo Usuário
              </button>
            </div>
            {showForm && (
              <form onSubmit={handleNovoUsuario} className="mb-2 p-4 border rounded bg-gray-50 flex flex-col md:flex-row gap-2 items-center relative z-20">
                <input type="text" placeholder="Nome" value={formNome} onChange={e => setFormNome(e.target.value)} required className="flex-1 px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                <select value={formFuncao} onChange={e => setFormFuncao(e.target.value)} className="flex-1 px-3 py-2 border rounded text-gray-900">
                  <option value="administrador" className="text-gray-900">Administrador</option>
                  <option value="atendente" className="text-gray-900">Atendente</option>
                  <option value="triador" className="text-gray-900">Triador</option>
                  <option value="medico" className="text-gray-900">Médico</option>
                </select>
                <input type="password" placeholder="Senha" value={formSenha} onChange={e => setFormSenha(e.target.value)} required className="flex-1 px-3 py-2 border rounded text-gray-900 placeholder-gray-500" />
                <div className="flex flex-col gap-1">
                  <button type="submit" disabled={formLoading} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">{formLoading ? 'Salvando...' : 'Salvar'}</button>
                  <button type="button" onClick={() => { setShowForm(false); setFormMsg('') }} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded font-semibold">Cancelar</button>
                </div>
                {formMsg && <div className={`mt-2 text-center w-full ${formMsg.includes('sucesso') ? 'text-green-700' : 'text-red-700'} text-base font-semibold`}>{formMsg}</div>}
              </form>
            )}
            {loading ? (
              <div className="text-center py-4 text-gray-900">Carregando usuários...</div>
            ) : erro ? (
              <div className="text-red-600 text-center py-4 text-base font-semibold">{erro}</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border mt-2 text-sm md:text-base">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="py-2 px-2 border text-gray-900">ID</th>
                      <th className="py-2 px-2 border text-gray-900">Nome</th>
                      <th className="py-2 px-2 border text-gray-900">Função</th>
                      <th className="py-2 px-2 border text-gray-900">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="text-center hover:bg-gray-50 transition">
                        <td className="py-2 px-2 border text-gray-900">{user.id}</td>
                        <td className="py-2 px-2 border text-gray-900">{user.nome}</td>
                        <td className="py-2 px-2 border capitalize text-gray-900">{user.funcao}</td>
                        <td className="py-2 px-2 border flex flex-col gap-2 md:flex-row md:justify-center">
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-semibold border border-yellow-600"
                            onClick={() => handleEditar(user)}
                          >Editar</button>
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold border border-blue-700"
                            onClick={() => handleRedefinirSenha(user)}
                          >Redefinir Senha</button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold border border-red-700"
                            onClick={() => handleExcluir(user)}
                          >Excluir</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        {/* Seção Debug */}
        {secao === 'debug' && (
          <>
            {debugLoading ? (
              <div className="text-center py-4 text-gray-900">Carregando dados de debug...</div>
            ) : debugError ? (
              <div className="text-red-600 text-center py-4 text-base font-semibold">{debugError}</div>
            ) : debugData && (
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
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      🧑‍⚕️ Pacientes Detalhado
                    </h2>
                    <button
                      onClick={limparDados}
                      disabled={limpezaLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {limpezaLoading ? 'Limpando...' : '🗑️ Limpar Dados'}
                    </button>
                  </div>
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
          </>
        )}
      </div>
    </div>
  )
} 