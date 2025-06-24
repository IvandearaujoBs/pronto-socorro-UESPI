import type { NextApiRequest, NextApiResponse } from 'next';
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite');
const db = new Database(dbPath);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
      const pacienteId = parseInt(req.query.id as string);
      const { motivo } = req.body;
      if (!motivo) {
        return res.status(400).json({ error: 'Motivo é obrigatório' });
      }
      db.exec(`
        CREATE TABLE IF NOT EXISTS historico_remocoes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          paciente_id INTEGER,
          motivo TEXT,
          data_remocao TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
      db.prepare('INSERT INTO historico_remocoes (paciente_id, motivo) VALUES (?, ?)')
        .run(pacienteId, motivo);
      db.prepare('DELETE FROM fila WHERE paciente_id = ?').run(pacienteId);
      db.prepare('DELETE FROM triagem WHERE paciente_id = ?').run(pacienteId);
      res.status(200).json({ message: 'Paciente removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover paciente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 