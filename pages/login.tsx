import React, { useState } from 'react'
import { useRouter } from 'next/router'

const funcoes = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'atendente', label: 'Atendente' },
  { value: 'triador', label: 'Triador' },
  { value: 'medico', label: 'Médico' }
]

export default function Login() {
  const [nome, setNome] = useState('')
  const [funcao, setFuncao] = useState('atendente')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensagem('')
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, funcao, senha })
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user)) // Salva usuário no localStorage
        setMensagem('Login realizado com sucesso!')
        setTimeout(() => {
          if (funcao === 'administrador') router.push('/admin')
          else if (funcao === 'atendente') router.push('/recepcao')
          else if (funcao === 'triador') router.push('/triagem')
          else if (funcao === 'medico') router.push('/medico')
        }, 1000)
      } else {
        setMensagem(data.error || 'Erro ao fazer login')
      }
    } catch (err) {
      setMensagem('Erro ao conectar ao servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md animate-fadeIn">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-700">Login - ClinicFlow</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Funcionário</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
            <select value={funcao} onChange={e => setFuncao(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900">
              {funcoes.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition-all duration-200 font-semibold">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        {mensagem && (
          <div className={`mt-4 p-3 rounded-lg text-center ${mensagem.includes('sucesso') ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>{mensagem}</div>
        )}
      </div>
    </div>
  )
} 