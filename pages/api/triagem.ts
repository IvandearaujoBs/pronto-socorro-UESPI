import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
<<<<<<< HEAD
      const { pacienteId, filaId, pressao, temperatura, batimentos, risco } = req.body

      if (!pacienteId || !filaId || !risco) {
        return res.status(400).json({
          error: 'ID do paciente, fila e nível de risco são obrigatórios'
=======
      const { pacienteId, pressao, temperatura, batimentos, risco } = req.body

      if (!pacienteId || !risco) {
        return res.status(400).json({
          error: 'ID do paciente e nível de risco são obrigatórios'
>>>>>>> bf293c99938dfec20360efcd56ff8dde3f8cdb73
        })
      }

      db.prepare(`
<<<<<<< HEAD
        INSERT INTO triagem (paciente_id, fila_id, pressao, temperatura, batimentos, risco, data) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(pacienteId, filaId, pressao || null, temperatura || null, batimentos || null, risco, new Date().toISOString())
=======
        INSERT INTO triagem (paciente_id, pressao, temperatura, batimentos, risco, data) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(pacienteId, pressao || null, temperatura || null, batimentos || null, risco, new Date().toISOString())
>>>>>>> bf293c99938dfec20360efcd56ff8dde3f8cdb73

      db.prepare(`
        UPDATE fila 
        SET status = 'triagem_concluida' 
        WHERE paciente_id = ?
      `).run(pacienteId)

      res.status(201).json({ message: 'Triagem realizada com sucesso' })
    } catch (error) {
      console.error('Erro ao realizar triagem:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 