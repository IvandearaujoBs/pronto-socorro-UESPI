import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'
import { temposMaximos } from '../../src/constantes/temposMaximos'

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

function toBrasiliaDate(dateString: string) {
  const utcDate = new Date(dateString);
  const brasiliaOffset = -3 * 60; 
  return new Date(utcDate.getTime() + brasiliaOffset * 60000);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const filaCompleta = db.prepare(`
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
        LEFT JOIN historico_remocoes h ON p.id = h.paciente_id
        WHERE h.id IS NULL
        ORDER BY 
          CASE t.risco
            WHEN 'vermelho' THEN 1
            WHEN 'laranja' THEN 2
            WHEN 'amarelo' THEN 3
            WHEN 'verde' THEN 4
            WHEN 'azul' THEN 5
            ELSE 6
          END,
          t.data ASC,
          f.id ASC
      `).all() as FilaItem[]

      const agora = new Date();
      const agoraBrasilia = new Date(agora.getTime() + (-3 * 60 * 60000));
      

      const filaComTempo = filaCompleta.map(item => {
        let tempoMax = 99999;
        if (item.risco && temposMaximos[item.risco as keyof typeof temposMaximos] !== undefined) {
          tempoMax = temposMaximos[item.risco as keyof typeof temposMaximos];
        }
        const dataTriagem = item.data_triagem ? toBrasiliaDate(item.data_triagem) : null;
        let minutosEspera = 0;
        if (dataTriagem) {
          minutosEspera = Math.max(0, (agoraBrasilia.getTime() - dataTriagem.getTime()) / 60000);
        }
        const tempoEstourado = dataTriagem && tempoMax >= 0 && minutosEspera > tempoMax;
        return {
          ...item,
          tempoEstourado,
          minutosEspera: Math.round(minutosEspera),
          tempoMax
        }
      });

      const esperando = filaComTempo.filter(item => 
        item.status === 'esperando' || item.status === 'triagem_concluida'
      );
      
      const emAtendimento = filaComTempo.filter(item => 
        item.status === 'em_atendimento'
      );

      const esperandoFormatado = esperando.map((item: FilaItem) => ({
        id: item.id,
        nome: item.nome,
        risco: item.risco || 'sem-risco',
        status: item.status,
        data_triagem: item.data_triagem || null
      }));

      const emAtendimentoFormatado = emAtendimento.map((item: FilaItem) => ({
        id: item.id,
        nome: item.nome,
        risco: item.risco || 'sem-risco',
        status: item.status
      }));

      res.status(200).json({ esperando: esperandoFormatado, em_atendimento: emAtendimentoFormatado })
    } catch (error) {
      console.error('Erro ao buscar fila:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 