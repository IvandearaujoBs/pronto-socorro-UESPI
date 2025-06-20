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

interface PacienteComTempo {
  id: number
  nome: string
  risco: string
  tempo_espera_minutos: number
  tempo_maximo_minutos: number
  tempo_estourado: boolean
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Criar tabela de tempos máximos se não existir
      db.exec(`
        CREATE TABLE IF NOT EXISTS tempos_maximos (
          risco TEXT PRIMARY KEY,
          tempo_minutos INTEGER NOT NULL
        );
      `);

      // Inserir tempos máximos padrão se não existirem
      const temposExistentes = db.prepare('SELECT COUNT(*) as count FROM tempos_maximos').get() as CountResult;
      if (temposExistentes.count === 0) {
        db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('vermelho', 0);
        db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('laranja', 10);
        db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('amarelo', 60);
        db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('verde', 120);
        db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('azul', 240);
        console.log('Default maximum times inserted')
      }

      // Verificar estado do banco
      const pacientes = db.prepare('SELECT COUNT(*) as total FROM pacientes').get() as CountResult
      const triagens = db.prepare('SELECT COUNT(*) as total FROM triagem').get() as CountResult
      const fila = db.prepare("SELECT COUNT(*) as total FROM fila WHERE status IN ('esperando', 'triagem_concluida')").get() as CountResult
      
      const filaDetalhada = db.prepare(`
        SELECT f.status, COUNT(*) as quantidade
        FROM fila f
        GROUP BY f.status
      `).all() as FilaStatus[]

      const pacientesComTriagem = db.prepare(`
        SELECT p.nome, 
               COALESCE(f.status, CASE WHEN h.id IS NOT NULL THEN 'removido' ELSE NULL END) as status, 
               t.risco, 
               h.motivo as motivo_remocao
        FROM pacientes p
        LEFT JOIN fila f ON f.id = (
          SELECT id FROM fila WHERE paciente_id = p.id ORDER BY id DESC LIMIT 1
        )
        LEFT JOIN triagem t ON p.id = t.paciente_id
        LEFT JOIN historico_remocoes h ON p.id = h.paciente_id
        ORDER BY p.id
      `).all() as PacienteDetalhado[]

      // Calcular pacientes com tempo estourado
      const pacientesComTempoEstourado = db.prepare(`
        SELECT 
          p.id,
          p.nome,
          t.risco,
          ROUND((julianday('now') - julianday(t.data)) * 24 * 60) as tempo_espera_minutos,
          tm.tempo_minutos as tempo_maximo_minutos,
          CASE 
            WHEN ROUND((julianday('now') - julianday(t.data)) * 24 * 60) > tm.tempo_minutos 
            THEN 1 
            ELSE 0 
          END as tempo_estourado
        FROM pacientes p
        INNER JOIN triagem t ON p.id = t.paciente_id
        INNER JOIN fila f ON p.id = f.paciente_id
        INNER JOIN tempos_maximos tm ON t.risco = tm.risco
        WHERE f.status IN ('esperando', 'triagem_concluida')
        ORDER BY tempo_estourado DESC, tempo_espera_minutos DESC
      `).all() as PacienteComTempo[]

      // Estatísticas por risco
      const estatisticasPorRisco = db.prepare(`
        SELECT 
          t.risco,
          COUNT(*) as total,
          SUM(CASE 
            WHEN ROUND((julianday('now') - julianday(t.data)) * 24 * 60) > tm.tempo_minutos 
            THEN 1 
            ELSE 0 
          END) as tempo_estourado
        FROM triagem t
        INNER JOIN fila f ON t.paciente_id = f.paciente_id
        INNER JOIN tempos_maximos tm ON t.risco = tm.risco
        WHERE f.status IN ('esperando', 'triagem_concluida')
        GROUP BY t.risco
        ORDER BY 
          CASE t.risco
            WHEN 'vermelho' THEN 1
            WHEN 'laranja' THEN 2
            WHEN 'amarelo' THEN 3
            WHEN 'verde' THEN 4
            WHEN 'azul' THEN 5
            ELSE 6
          END
      `).all()

      res.status(200).json({
        resumo: {
          pacientes: pacientes.total,
          triagens: triagens.total,
          fila: fila.total
        },
        filaPorStatus: filaDetalhada,
        pacientesDetalhado: pacientesComTriagem,
        pacientesComTempoEstourado: pacientesComTempoEstourado,
        estatisticasPorRisco: estatisticasPorRisco,
        totalTempoEstourado: pacientesComTempoEstourado.filter(p => p.tempo_estourado).length
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