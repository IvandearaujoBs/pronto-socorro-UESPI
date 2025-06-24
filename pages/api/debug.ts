import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

interface CountResult {
  total: number
  count?: number
}

interface FilaStatus {
  status: string
  quantidade: number
}

interface PacienteDetalhado {
  nome: string
  status: string | null
  risco: string | null
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pacientes = db.prepare('SELECT COUNT(*) as total FROM pacientes').get() as CountResult
      const triagens = db.prepare('SELECT COUNT(*) as total FROM triagem').get() as CountResult
      const fila = db.prepare("SELECT COUNT(*) as total FROM fila WHERE status IN ('esperando', 'triagem_concluida')").get() as CountResult
      
      const filaDetalhada = db.prepare(`
        SELECT f.status, COUNT(*) as quantidade
        FROM fila f
        GROUP BY f.status
      `).all() as FilaStatus[]

      const pacientesComTriagem = db.prepare(`
        SELECT DISTINCT p.nome, 
               CASE 
                 WHEN h.id IS NOT NULL THEN 'excluido'
                 WHEN t.risco = 'vermelho' THEN 'atendido'
                 WHEN f.status = 'atendido' THEN 'atendido'
                 WHEN f.status = 'triagem_concluida' THEN 'aguardando atendimento'
                 WHEN f.status IS NOT NULL THEN f.status
                 ELSE 'esperando'
               END as status, 
               t.risco
        FROM pacientes p
        LEFT JOIN (
          SELECT DISTINCT paciente_id, status
          FROM fila 
          WHERE id IN (
            SELECT MAX(id) 
            FROM fila 
            GROUP BY paciente_id
          )
        ) f ON p.id = f.paciente_id
        LEFT JOIN triagem t ON p.id = t.paciente_id
        LEFT JOIN historico_remocoes h ON p.id = h.paciente_id
        ORDER BY p.id
      `).all() as PacienteDetalhado[]

      res.status(200).json({
        resumo: {
          pacientes: pacientes.total,
          triagens: triagens.total,
          fila: fila.total
        },
        filaPorStatus: filaDetalhada,
        pacientesDetalhado: pacientesComTriagem
      })
    } catch (error) {
      console.error('Erro no debug:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 