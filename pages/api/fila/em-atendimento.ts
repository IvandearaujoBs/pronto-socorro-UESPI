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
  data_triagem: string | null
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pacienteEmAtendimento = db.prepare(`
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
          t.risco,
          t.data as data_triagem
        FROM fila f
        INNER JOIN pacientes p ON f.paciente_id = p.id
        INNER JOIN triagem t ON p.id = t.paciente_id
        WHERE f.status = 'em_atendimento'
        LIMIT 1
      `).get() as FilaItem | undefined;

      if (!pacienteEmAtendimento) {
        return res.status(404).json({ paciente: null })
      }

      const pacienteFormatado = {
        id: pacienteEmAtendimento.id,
        paciente: {
          id: pacienteEmAtendimento.paciente_id,
          nome: pacienteEmAtendimento.nome,
          cpf: pacienteEmAtendimento.cpf,
          nascimento: pacienteEmAtendimento.nascimento
        },
        triagem: {
          pressao: pacienteEmAtendimento.pressao,
          temperatura: pacienteEmAtendimento.temperatura,
          batimentos: pacienteEmAtendimento.batimentos,
          risco: pacienteEmAtendimento.risco
        },
        status: 'em_atendimento',
        chamada_em: pacienteEmAtendimento.chamada_em,
        data_triagem: pacienteEmAtendimento.data_triagem
      }
      return res.status(200).json(pacienteFormatado)
    } catch (error) {
      console.error('Erro ao buscar paciente em atendimento:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 