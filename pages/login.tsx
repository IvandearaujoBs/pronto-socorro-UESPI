import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useAuth } from '../src/contexts/AuthContext'
import { useRouter } from 'next/router'

export default function Login() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [modoCadastro, setModoCadastro] = useState(false)
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('atendente')
  const [cpf, setCpf] = useState('')
  const [nascimento, setNascimento] = useState('')
  
  const { login, usuario: usuarioLogado } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Se já estiver logado, redirecionar para a página apropriada
    if (usuarioLogado) {
      redirecionarPorTipo(usuarioLogado.tipo)
    }
  }, [usuarioLogado])

  const redirecionarPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'atendente':
        router.push('/recepcao')
        break
      case 'triador':
        router.push('/triagem')
        break
      case 'medico':
        router.push('/medico')
        break
      case 'admin':
        router.push('/')
        break
      default:
        router.push('/')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem('')

    if (modoCadastro) {
      // Validação básica frontend
      if (!nome || !usuario || !senha || !tipo || !cpf || !nascimento) {
        setMensagem('Preencha todos os campos obrigatórios.')
        setLoading(false)
        return
      }
      try {
        const response = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, usuario, senha, tipo, cpf, nascimento })
        })
        const data = await response.json()
        if (response.ok) {
          setMensagem('Usuário cadastrado com sucesso! Faça login.')
          setModoCadastro(false)
          setNome('')
          setTipo('atendente')
          setCpf('')
          setNascimento('')
        } else {
          setMensagem(data.error || 'Erro ao cadastrar usuário')
        }
      } catch (error) {
        setMensagem('Erro de conexão')
      }
      setLoading(false)
      return
    }

    const resultado = await login(usuario, senha)
    
    if (resultado.success) {
      setMensagem(resultado.message)
      // O redirecionamento será feito pelo useEffect
    } else {
      setMensagem(resultado.message)
    }
    
    setLoading(false)
  }

  const getCredenciaisPadrao = () => {
    const credenciais = [
      { tipo: 'Atendente', usuario: 'atendente', senha: '123456' },
      { tipo: 'Triador', usuario: 'triador', senha: '123456' },
      { tipo: 'Médico', usuario: 'medico', senha: '123456' },
      { tipo: 'Administrador', usuario: 'admin', senha: '123456' }
    ]
    
    return credenciais.map((cred, index) => (
      <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
        <strong>{cred.tipo}:</strong> {cred.usuario} / {cred.senha}
      </div>
    ))
  }

  return (
    <>
      <Head>
        <title>Login - ClinicFlow</title>
        <meta name="description" content="Sistema de gerenciamento de fila do pronto socorro" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              ClinicFlow
            </h1>
            <p className="text-lg text-gray-600">
              Sistema de Gerenciamento de Fila
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Pronto Socorro UESPI
            </p>
          </div>

          {/* Card de Login */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              🔐 Acesso ao Sistema
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {modoCadastro && (
                <>
                  {/* Campo Nome */}
                  <div>
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      id="nome"
                      required={modoCadastro}
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors"
                      placeholder="Digite seu nome completo"
                      disabled={loading}
                    />
                  </div>
                  {/* Campo Tipo */}
                  <div>
                    <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de usuário
                    </label>
                    <select
                      id="tipo"
                      value={tipo}
                      onChange={(e) => setTipo(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors"
                      disabled={loading}
                    >
                      <option value="atendente">Atendente</option>
                      <option value="triador">Triador</option>
                      <option value="medico">Médico</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  {/* Campo CPF */}
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                      CPF
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      required={modoCadastro}
                      value={cpf}
                      onChange={(e) => setCpf(e.target.value.replace(/\D/g, ''))}
                      maxLength={11}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors"
                      placeholder="Digite o CPF (somente números)"
                      disabled={loading}
                    />
                  </div>
                  {/* Campo Nascimento */}
                  <div>
                    <label htmlFor="nascimento" className="block text-sm font-medium text-gray-700 mb-2">
                      Data de nascimento
                    </label>
                    <input
                      type="date"
                      id="nascimento"
                      required={modoCadastro}
                      value={nascimento}
                      onChange={(e) => setNascimento(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors"
                      disabled={loading}
                    />
                  </div>
                </>
              )}
              {/* Campo Usuário */}
              <div>
                <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 mb-2">
                  👤 Usuário
                </label>
                <input
                  type="text"
                  id="usuario"
                  required
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors"
                  placeholder="Digite seu usuário"
                  disabled={loading}
                />
              </div>
              {/* Campo Senha */}
              <div>
                <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                  🔒 Senha
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    id="senha"
                    required
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 transition-colors"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {mostrarSenha ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>
              {/* Botão de Login/Cadastro */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {modoCadastro ? 'Cadastrando...' : 'Entrando...'}
                  </span>
                ) : (
                  modoCadastro ? '📝 Cadastrar' : '🚀 Entrar no Sistema'
                )}
              </button>
            </form>
            {/* Alternar entre login e cadastro */}
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-blue-700 hover:underline text-sm"
                onClick={() => { setModoCadastro(!modoCadastro); setMensagem('') }}
                disabled={loading}
              >
                {modoCadastro ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
              </button>
            </div>

            {/* Mensagem de Erro/Sucesso */}
            {mensagem && (
              <div className={`mt-4 p-4 rounded-lg text-center ${
                mensagem.includes('sucesso') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {mensagem}
              </div>
            )}

            {/* Informações de Acesso */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg hidden">
              {/* BLOCO OCULTO: Credenciais de Teste */}
              <h3 className="text-sm font-semibold text-blue-800 mb-3">
                ℹ️ Credenciais de Teste
              </h3>
              <div className="space-y-1">
                {getCredenciaisPadrao()}
              </div>
              <p className="text-xs text-blue-600 mt-3">
                Use qualquer uma das credenciais acima para testar o sistema
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-sm text-gray-500">
            <p>
              <strong>ClinicFlow</strong> — Sistema de Gerenciamento de Fila do Pronto Socorro<br />
              Desenvolvido por: <strong>Ivanildo Araujo</strong>, <strong>Jefferson Melo</strong> e <strong>Adonias Terceiro</strong><br />
              © {new Date().getFullYear()} - Todos os direitos reservados
            </p>
          </div>
        </div>
      </main>
    </>
  )
} 