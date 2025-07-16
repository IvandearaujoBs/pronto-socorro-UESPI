import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pacientes = db.prepare(`
        SELECT p.id, p.nome, p.cpf, p.nascimento, f.id as fila_id
        FROM pacientes p
        INNER JOIN fila f ON p.id = f.paciente_id
        LEFT JOIN triagem t ON t.fila_id = f.id
        LEFT JOIN historico_remocoes h ON p.id = h.paciente_id
        WHERE f.status = 'esperando' AND t.id IS NULL AND h.id IS NULL
        ORDER BY f.id
      `).all()

      const todosPacientesFila = db.prepare(`
        SELECT p.id, p.nome, f.status, t.id as triagem_id, h.id as remocao_id
        FROM pacientes p
        LEFT JOIN fila f ON p.id = f.paciente_id
        LEFT JOIN triagem t ON p.id = t.paciente_id
        LEFT JOIN historico_remocoes h ON p.id = h.paciente_id
        ORDER BY p.id
      `).all()
      
      console.log('Todos os pacientes na fila:', todosPacientesFila)
      console.log('Pacientes sem triagem encontrados:', pacientes.length)
      console.log('Pacientes:', pacientes)

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