import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const filaId = parseInt(req.query.id as string)
      db.prepare(`
        UPDATE fila 
        SET status = 'triagem_concluida' 
        WHERE id = ? AND status = 'em_atendimento'
      `).run(filaId)
      res.status(200).json({ message: 'Paciente devolvido para a fila com sucesso' })
    } catch (error) {
      console.error('Erro ao devolver paciente para a fila:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 