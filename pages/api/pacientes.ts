import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pacientes = db.prepare(`
        SELECT id, nome, cpf, nascimento 
        FROM pacientes 
        ORDER BY nome
      `).all()

      res.status(200).json(pacientes)
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else if (req.method === 'POST') {
    try {
      const { nome, cpf, nascimento } = req.body

      if (!nome || !cpf) {
        return res.status(400).json({ error: 'Nome e CPF são obrigatórios' })
      }

<<<<<<< HEAD
      // Validação de CPF
      function isCpfValido(cpf) {
        cpf = cpf.replace(/\D/g, '')
        if (cpf.length !== 11) return 'CPF deve conter exatamente 11 números.'
        if (/^(\d)\1{10}$/.test(cpf)) return 'CPF inválido: não pode conter todos os dígitos iguais.'
        let soma = 0
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i)
        let resto = (soma * 10) % 11
        if (resto === 10 || resto === 11) resto = 0
        if (resto !== parseInt(cpf.charAt(9))) return 'CPF inválido.'
        soma = 0
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i)
        resto = (soma * 10) % 11
        if (resto === 10 || resto === 11) resto = 0
        if (resto !== parseInt(cpf.charAt(10))) return 'CPF inválido.'
        return true
      }
      const cpfValidation = isCpfValido(cpf)
      if (cpfValidation !== true) {
        return res.status(400).json({ error: cpfValidation })
      }

      // Verificar se CPF já existe
      const pacienteExistente = db.prepare(
        'SELECT id FROM pacientes WHERE cpf = ?'
      ).get(cpf) as { id: number } | undefined

      if (pacienteExistente && pacienteExistente.id) {
        const filaExistente = db.prepare(
          "SELECT id FROM fila WHERE paciente_id = ? AND status IN ('esperando', 'triagem_concluida')"
        ).get(pacienteExistente.id) as { id: number } | undefined
        if (!filaExistente) {
          db.prepare(`
            INSERT INTO fila (paciente_id, status, chamada_em)
            VALUES (?, 'esperando', CURRENT_TIMESTAMP)
          `).run(pacienteExistente.id)
        }
        return res.status(200).json({
          message: 'Paciente já cadastrado. Reutilizado e adicionado à fila.',
          id: pacienteExistente.id
        })
=======
      // Verificar se CPF já existe
      const pacienteExistente = db.prepare(
        'SELECT id FROM pacientes WHERE cpf = ?'
      ).get(cpf)

      if (pacienteExistente) {
        return res.status(409).json({ error: 'CPF já cadastrado' })
>>>>>>> bf293c99938dfec20360efcd56ff8dde3f8cdb73
      }

      // Inserir novo paciente AQUI
      const result = db.prepare(`
        INSERT INTO pacientes (nome, cpf, nascimento) 
        VALUES (?, ?, ?)
      `).run(nome, cpf, nascimento || null)

      // Adicionar à fila automaticamente
      db.prepare(`
        INSERT INTO fila (paciente_id, status, chamada_em) 
        VALUES (?, 'esperando', CURRENT_TIMESTAMP)
      `).run(result.lastInsertRowid)

      res.status(201).json({
        message: 'Paciente cadastrado com sucesso',
        id: result.lastInsertRowid
      })
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 