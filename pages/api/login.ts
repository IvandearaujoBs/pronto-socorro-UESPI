import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  const { nome, funcao, senha } = req.body
  if (!nome || !funcao || !senha) {
    return res.status(400).json({ error: 'Nome, função e senha são obrigatórios' })
  }
  const user = db.prepare('SELECT * FROM users WHERE nome = ? AND funcao = ?').get(nome, funcao) as { id: number, nome: string, funcao: string, senha: string } | undefined
  if (!user) {
    return res.status(401).json({ error: 'Usuário ou função inválidos' })
  }
  const senhaOk = await bcrypt.compare(senha, user.senha)
  if (!senhaOk) {
    return res.status(401).json({ error: 'Senha incorreta' })
  }
  // Aqui você pode gerar um token de sessão ou cookie (a implementar)
  return res.status(200).json({ message: 'Login realizado com sucesso', user: { id: user.id, nome: user.nome, funcao: user.funcao } })
} 