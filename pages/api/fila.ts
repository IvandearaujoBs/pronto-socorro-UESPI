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
  return Math.max(0, (date1.getTime() - date2.getTime()) / 60000);
}

function toBrasiliaDate(dateString: string) {
  // Converte a string do banco (geralmente UTC) para Date no fuso de Brasília (UTC-3)
  const utcDate = new Date(dateString);
  // Ajusta para UTC-3
  const brasiliaOffset = -3 * 60; // minutos
  return new Date(utcDate.getTime() + brasiliaOffset * 60000);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      
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
      const filaComTempo = fila.map(item => {
        let tempoMax = 99999;
        if (item.risco && temposMaximos[item.risco as keyof typeof temposMaximos] !== undefined) {
          tempoMax = temposMaximos[item.risco as keyof typeof temposMaximos];
        }
        const dataTriagem = item.data_triagem ? toBrasiliaDate(item.data_triagem) : null;
        let minutosEspera = 0;
        if (dataTriagem) {
          minutosEspera = Math.max(0, (agoraBrasilia.getTime() - dataTriagem.getTime()) / 60000);
        }
        // Log para depuração
        console.log(`Paciente: ${item.nome}, Cor: ${item.risco}, Data triagem: ${item.data_triagem}, Data Brasília: ${dataTriagem}, Agora Brasília: ${agoraBrasilia}, Minutos espera: ${minutosEspera}, Tempo máximo: ${tempoMax}`);
        const tempoEstourado = dataTriagem && tempoMax >= 0 && minutosEspera > tempoMax;
        return {
          ...item,
          tempoEstourado,
          minutosEspera: Math.round(minutosEspera),
          tempoMax
        }
      });


      filaComTempo.sort((a, b) => {
        if (a.tempoEstourado && !b.tempoEstourado) return -1;
        if (!a.tempoEstourado && b.tempoEstourado) return 1;
        
        if (a.tempoEstourado && b.tempoEstourado) {
          return (a.data_triagem && b.data_triagem) ? (new Date(a.data_triagem).getTime() - new Date(b.data_triagem).getTime()) : 0;
        }
        
        const ordemCor = ['vermelho','laranja','amarelo','verde','azul'];
        const idxA = ordemCor.indexOf(a.risco || 'azul');
        const idxB = ordemCor.indexOf(b.risco || 'azul');
        if (idxA !== idxB) return idxA - idxB;
        
        return (a.data_triagem && b.data_triagem) ? (new Date(a.data_triagem).getTime() - new Date(b.data_triagem).getTime()) : 0;
      });

      // Filtrar pacientes de risco vermelho para não aparecerem na fila
      const filaSemVermelho = filaComTempo.filter(item => item.risco !== 'vermelho');

      const filaFormatada = filaSemVermelho.map(item => ({
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

      // Buscar pacientes esperando
      const esperando = db.prepare(`
        SELECT 
          f.id,
          f.status,
          f.chamada_em,
          p.id as paciente_id,
          p.nome,
          t.risco,
          t.data as data_triagem
        FROM fila f
        INNER JOIN pacientes p ON f.paciente_id = p.id
        INNER JOIN triagem t ON p.id = t.paciente_id
        LEFT JOIN historico_remocoes h ON p.id = h.paciente_id
        WHERE f.status IN ('esperando', 'triagem_concluida') AND h.id IS NULL
          AND f.id = (
            SELECT MAX(f2.id) FROM fila f2 WHERE f2.paciente_id = f.paciente_id
          )
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
      `).all() as FilaItem[];
      const esperandoFormatado = esperando.map((item: FilaItem) => ({
        id: item.id,
        nome: item.nome,
        risco: item.risco || 'sem-risco',
        status: item.status,
        data_triagem: item.data_triagem || ''
      }))

      // Buscar pacientes em atendimento
      const emAtendimento = db.prepare(`
        SELECT 
          f.id,
          f.status,
          f.chamada_em,
          p.id as paciente_id,
          p.nome,
          t.risco,
          t.data as data_triagem
        FROM fila f
        INNER JOIN pacientes p ON f.paciente_id = p.id
        INNER JOIN triagem t ON p.id = t.paciente_id
        LEFT JOIN historico_remocoes h ON p.id = h.paciente_id
        WHERE f.status = 'em_atendimento' AND h.id IS NULL
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
      `).all() as FilaItem[];
      const emAtendimentoFormatado = emAtendimento.map((item: FilaItem) => ({
        id: item.id,
        nome: item.nome,
        risco: item.risco || 'sem-risco',
        status: item.status
      }))

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