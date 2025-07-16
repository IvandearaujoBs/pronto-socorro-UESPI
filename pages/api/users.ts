import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    // Listar todos os usuários (sem mostrar senha)
    try {
      const users = db.prepare('SELECT id, nome, funcao FROM users ORDER BY id').all()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar usuários' })
    }
  } else if (req.method === 'POST') {
    // Criar novo usuário
    try {
      const { nome, funcao, senha } = req.body
      if (!nome || !funcao || !senha) {
        return res.status(400).json({ error: 'Nome, função e senha são obrigatórios' })
      }
      const userExists = db.prepare('SELECT id FROM users WHERE nome = ? AND funcao = ?').get(nome, funcao)
      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe' })
      }
      const hash = await bcrypt.hash(senha, 10)
      const result = db.prepare('INSERT INTO users (nome, funcao, senha) VALUES (?, ?, ?)').run(nome, funcao, hash)
      res.status(201).json({ id: result.lastInsertRowid, nome, funcao })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar usuário' })
    }
  } else if (req.method === 'PUT') {
    // Editar usuário (nome, função, senha)
    try {
      const { id, nome, funcao, senha } = req.body
      if (!id || !nome || !funcao) {
        return res.status(400).json({ error: 'ID, nome e função são obrigatórios' })
      }
      if (senha) {
        const hash = await bcrypt.hash(senha, 10)
        db.prepare('UPDATE users SET nome = ?, funcao = ?, senha = ? WHERE id = ?').run(nome, funcao, hash, id)
      } else {
        db.prepare('UPDATE users SET nome = ?, funcao = ? WHERE id = ?').run(nome, funcao, id)
      }
      res.status(200).json({ message: 'Usuário atualizado com sucesso' })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
  } else if (req.method === 'DELETE') {
    // Excluir usuário
    try {
      const { id } = req.body
      if (!id) {
        return res.status(400).json({ error: 'ID é obrigatório' })
      }
      db.prepare('DELETE FROM users WHERE id = ?').run(id)
      res.status(200).json({ message: 'Usuário excluído com sucesso' })
    } catch (error) {
      res.status(500).json({ error: 'Erro ao excluir usuário' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 