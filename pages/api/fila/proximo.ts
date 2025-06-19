import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

interface FilaItem {
  id: number
  status: string
  chamada_em: string
  paciente_id: number
  nome: string
  cpf: string
  nascimento: string
  pressao: string | null
  temperatura: string | null
  batimentos: string | null
  risco: string | null
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Buscar o próximo paciente da fila (prioridade por risco)
      const proximoPaciente = db.prepare(`
        SELECT 
          f.id,
          f.status,
          f.chamada_em,
          p.id as paciente_id,
          p.nome,
          p.cpf,
          p.nascimento,
          t.pressao,
          t.temperatura,
          t.batimentos,
          t.risco
        FROM fila f
        INNER JOIN pacientes p ON f.paciente_id = p.id
        INNER JOIN triagem t ON p.id = t.paciente_id
        WHERE f.status = 'triagem_concluida'
        ORDER BY 
          CASE t.risco
            WHEN 'vermelho' THEN 1
            WHEN 'laranja' THEN 2
            WHEN 'amarelo' THEN 3
            WHEN 'verde' THEN 4
            WHEN 'azul' THEN 5
            ELSE 6
          END,
          f.chamada_em ASC
        LIMIT 1
      `).get() as FilaItem | undefined

      if (!proximoPaciente) {
        return res.status(404).json({
          error: 'Nenhum paciente disponível para atendimento'
        })
      }

      // Atualizar status para 'em_atendimento'
      db.prepare(`
        UPDATE fila 
        SET status = 'em_atendimento' 
        WHERE id = ?
      `).run(proximoPaciente.id)

      // Formatar resposta
      const pacienteFormatado = {
        id: proximoPaciente.id,
        paciente: {
          id: proximoPaciente.paciente_id,
          nome: proximoPaciente.nome,
          cpf: proximoPaciente.cpf,
          nascimento: proximoPaciente.nascimento
        },
        triagem: {
          pressao: proximoPaciente.pressao,
          temperatura: proximoPaciente.temperatura,
          batimentos: proximoPaciente.batimentos,
          risco: proximoPaciente.risco
        },
        status: 'em_atendimento',
        chamada_em: proximoPaciente.chamada_em
      }

      res.status(200).json(pacienteFormatado)
    } catch (error) {
      console.error('Erro ao chamar próximo paciente:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 