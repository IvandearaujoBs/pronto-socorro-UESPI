import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

interface FilaItem {
  id: number
  paciente_id: number
  status: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    try {
      const filaId = parseInt(req.query.id as string)
      const { diagnostico, prescricao } = req.body

      // Verificar se o item da fila existe e está em atendimento
      const itemFila = db.prepare(`
        SELECT id, paciente_id, status 
        FROM fila 
        WHERE id = ?
      `).get(filaId) as FilaItem | undefined

      if (!itemFila) {
        return res.status(404).json({
          error: 'Item da fila não encontrado'
        })
      }

      if (itemFila.status !== 'em_atendimento') {
        return res.status(400).json({
          error: 'Paciente não está em atendimento'
        })
      }

      // Atualizar status para 'atendido'
      db.prepare(`
        UPDATE fila 
        SET status = 'atendido' 
        WHERE id = ?
      `).run(filaId)

      // Aqui você poderia salvar diagnóstico e prescrição em uma tabela separada
      // Por simplicidade, vamos apenas finalizar o atendimento
      console.log('Atendimento finalizado:', {
        pacienteId: itemFila.paciente_id,
        diagnostico,
        prescricao
      })

      res.status(200).json({
        message: 'Atendimento finalizado com sucesso'
      })
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 