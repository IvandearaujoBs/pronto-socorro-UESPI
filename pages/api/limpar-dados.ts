import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      db.prepare('DELETE FROM fila').run()
      db.prepare('DELETE FROM triagem').run()
      db.prepare('DELETE FROM pacientes').run()
      db.prepare('DELETE FROM historico_remocoes').run()
      db.prepare('DELETE FROM sqlite_sequence WHERE name IN (?, ?, ?, ?)').run('pacientes', 'triagem', 'fila', 'historico_remocoes')
      db.prepare("UPDATE fila SET status = 'atendido' WHERE status = 'em_atendimento'").run();
      db.prepare(`
        DELETE FROM fila 
        WHERE id NOT IN (
          SELECT MAX(id) 
          FROM fila 
          GROUP BY paciente_id
        )
      `).run();
      console.log('Banco de dados limpo com sucesso')
      res.status(200).json({ 
        message: 'Banco de dados limpo com sucesso',
        detalhes: {
          pacientes: 0,
          triagens: 0,
          fila: 0
        }
      })
    } catch (error) {
      console.error('Erro ao limpar banco:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 