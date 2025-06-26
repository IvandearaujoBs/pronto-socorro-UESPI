import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'
import { MinHeap, HeapItem } from '../../../src/MinHeap'
import { temposMaximos } from '../../../src/constantes/temposMaximos'

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
          t.risco
        FROM fila f
        INNER JOIN pacientes p ON f.paciente_id = p.id
        INNER JOIN triagem t ON p.id = t.paciente_id
        WHERE f.status = 'em_atendimento'
        LIMIT 1
      `).get() as FilaItem | undefined;

      if (pacienteEmAtendimento) {
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
          chamada_em: pacienteEmAtendimento.chamada_em
        }
        return res.status(200).json(pacienteFormatado);
      }

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
        WHERE f.status = 'triagem_concluida'
      `).all() as (FilaItem & { data_triagem: string | null })[]

      if (!filaCompleta || filaCompleta.length === 0) {
        return res.status(404).json({
          error: 'Nenhum paciente disponível para atendimento'
        })
      }
      function toBrasiliaDate(dateString: string) {
        const utcDate = new Date(dateString);
        const brasiliaOffset = -3 * 60;
        return new Date(utcDate.getTime() + brasiliaOffset * 60000);
      }
      class PacienteHeapItem implements HeapItem {
        prioridade: number;
        item: typeof filaCompleta[0];
        constructor(item: typeof filaCompleta[0]) {
          let riscoNum = 6;
          switch (item.risco) {
            case 'vermelho': riscoNum = 1; break;
            case 'laranja': riscoNum = 2; break;
            case 'amarelo': riscoNum = 3; break;
            case 'verde': riscoNum = 4; break;
            case 'azul': riscoNum = 5; break;
            default: riscoNum = 6;
          }
          let minutosEspera = 0;
          if (item.data_triagem) {
            const agora = new Date();
            const agoraBrasilia = new Date(agora.getTime() + (-3 * 60 * 60000));
            const dataTriagem = toBrasiliaDate(item.data_triagem);
            minutosEspera = Math.max(0, (agoraBrasilia.getTime() - dataTriagem.getTime()) / 60000);
          }
          this.prioridade = riscoNum * 10000 + Math.round(minutosEspera) * 10 + (item.id || 0);
          this.item = item;
        }
      }
      const heap = new MinHeap<PacienteHeapItem>();
      filaCompleta.forEach(item => heap.insert(new PacienteHeapItem(item)));
      const heapItem = heap.extractMin();
      if (!heapItem) {
        return res.status(404).json({
          error: 'Nenhum paciente disponível para atendimento'
        })
      }
      const proximoPaciente = heapItem.item;
      db.prepare(`
        UPDATE fila 
        SET status = 'em_atendimento' 
        WHERE id = ?
      `).run(proximoPaciente.id)
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