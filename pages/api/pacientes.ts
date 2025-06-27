import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pacientes = db.prepare(`
        SELECT id, nome, cpf, nascimento, sexo, sus 
        FROM pacientes 
        ORDER BY nome
      `).all()

      res.status(200).json(pacientes)
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else if (req.method === 'POST') {
    try {
      const { nome, cpf, nascimento, sexo, sus } = req.body

      if (!nome || !cpf || !sexo) {
        return res.status(400).json({ error: 'Nome, CPF e sexo são obrigatórios' })
      }

      const pacienteExistente = db.prepare(
        'SELECT id FROM pacientes WHERE cpf = ?'
      ).get(cpf)

      if (pacienteExistente) {
        return res.status(409).json({ error: 'CPF já cadastrado' })
      }

      const result = db.prepare(`
        INSERT INTO pacientes (nome, cpf, nascimento, sexo, sus) 
        VALUES (?, ?, ?, ?, ?)
      `).run(nome, cpf, nascimento || null, sexo, sus || null)

      db.prepare(`
        INSERT INTO fila (paciente_id, status, chamada_em) 
        VALUES (?, 'esperando', CURRENT_TIMESTAMP)
      `).run(result.lastInsertRowid)

      res.status(201).json({
        message: 'Paciente cadastrado com sucesso',
        id: result.lastInsertRowid
      })
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 