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

function minutosEntre(date1: Date, date2: Date) {
  return (date1.getTime() - date2.getTime()) / 60000;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Buscar pacientes na fila com dados de triagem (apenas com triagem concluída)
      const fila = db.prepare(`
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
        WHERE f.status IN ('esperando', 'triagem_concluida') AND h.id IS NULL
      `).all() as FilaItem[]

      // Calcular se o paciente estourou o tempo
      const agora = new Date();
      const filaComTempo = fila.map(item => {
        let tempoMax = 99999;
        if (item.risco && temposMaximos[item.risco as keyof typeof temposMaximos] !== undefined) {
          tempoMax = temposMaximos[item.risco as keyof typeof temposMaximos];
        }
        const dataTriagem = item.data_triagem ? new Date(item.data_triagem) : null;
        let minutosEspera = 0;
        if (dataTriagem) {
          minutosEspera = minutosEntre(agora, dataTriagem);
        }
        const tempoEstourado = dataTriagem && tempoMax >= 0 && minutosEspera > tempoMax;
        return {
          ...item,
          tempoEstourado,
          minutosEspera,
          tempoMax
        }
      });

      // Ordenar: 1) tempo estourado (mais antigo primeiro), 2) cor, 3) data triagem
      filaComTempo.sort((a, b) => {
        // Se apenas um estourou o tempo, ele tem prioridade
        if (a.tempoEstourado && !b.tempoEstourado) return -1;
        if (!a.tempoEstourado && b.tempoEstourado) return 1;
        
        // Se ambos estouraram o tempo, mais antigo primeiro
        if (a.tempoEstourado && b.tempoEstourado) {
          return (a.data_triagem && b.data_triagem) ? (new Date(a.data_triagem).getTime() - new Date(b.data_triagem).getTime()) : 0;
        }
        
        // Se nenhum estourou, ordem normal de cor
        const ordemCor = ['vermelho','laranja','amarelo','verde','azul'];
        const idxA = ordemCor.indexOf(a.risco || 'azul');
        const idxB = ordemCor.indexOf(b.risco || 'azul');
        if (idxA !== idxB) return idxA - idxB;
        
        // Dentro da mesma cor, mais antigo primeiro
        return (a.data_triagem && b.data_triagem) ? (new Date(a.data_triagem).getTime() - new Date(b.data_triagem).getTime()) : 0;
      });

      // Formatar os dados para o frontend
      const filaFormatada = filaComTempo.map(item => ({
        id: item.id,
        paciente: {
          id: item.paciente_id,
          nome: item.nome,
          cpf: item.cpf,
          nascimento: item.nascimento
        },
        triagem: {
          pressao: item.pressao || '',
          temperatura: item.temperatura || '',
          batimentos: item.batimentos || '',
          risco: item.risco || 'sem-risco'
        },
        status: item.status,
        chamada_em: item.chamada_em,
        tempoEstourado: item.tempoEstourado,
        minutosEspera: item.minutosEspera,
        tempoMax: item.tempoMax
      }))

      res.status(200).json(filaFormatada)
    } catch (error) {
      console.error('Erro ao buscar fila:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 