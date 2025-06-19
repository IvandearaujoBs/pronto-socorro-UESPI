import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Buscar pacientes que ainda não passaram pela triagem
      const pacientes = db.prepare(`
        SELECT p.id, p.nome, p.cpf, p.nascimento
        FROM pacientes p
        LEFT JOIN triagem t ON p.id = t.paciente_id
        WHERE t.id IS NULL
        ORDER BY p.nome
      `).all()

      res.status(200).json(pacientes)
    } catch (error) {
      console.error('Erro ao buscar pacientes sem triagem:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 