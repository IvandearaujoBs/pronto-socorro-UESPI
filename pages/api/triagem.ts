import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { pacienteId, pressao, temperatura, batimentos, risco } = req.body

      if (!pacienteId || !risco) {
        return res.status(400).json({
          error: 'ID do paciente e nível de risco são obrigatórios'
        })
      }

      // Verificar se paciente existe
      const paciente = db.prepare(
        'SELECT id FROM pacientes WHERE id = ?'
      ).get(pacienteId)

      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' })
      }

      // Verificar se já existe triagem para este paciente
      const triagemExistente = db.prepare(
        'SELECT id FROM triagem WHERE paciente_id = ?'
      ).get(pacienteId)

      if (triagemExistente) {
        return res.status(409).json({
          error: 'Paciente já possui triagem realizada'
        })
      }

      // Inserir triagem
      db.prepare(`
        INSERT INTO triagem (paciente_id, pressao, temperatura, batimentos, risco) 
        VALUES (?, ?, ?, ?, ?)
      `).run(pacienteId, pressao || null, temperatura || null, batimentos || null, risco)

      // Atualizar status da fila para 'triagem_concluida'
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