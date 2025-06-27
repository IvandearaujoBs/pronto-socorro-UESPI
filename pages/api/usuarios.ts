import type { NextApiRequest, NextApiResponse } from 'next'
import Database from 'better-sqlite3'
import path from 'path'
import bcrypt from 'bcryptjs'

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite')
const db = new Database(dbPath)

// Verificar se a tabela antiga existe e recriar se necessário
const verificarEstruturaTabela = () => {
  try {
    // Verificar se existe coluna 'email' (estrutura antiga)
    const colunas = db.prepare("PRAGMA table_info(usuarios)").all() as Array<{name: string}>
    const temEmail = colunas.some(col => col.name === 'email')
    
    if (temEmail) {
      console.log('Estrutura antiga detectada, recriando tabela...')
      // Dropar tabela antiga
      db.exec('DROP TABLE IF EXISTS usuarios')
    }
  } catch (error) {
    console.log('Tabela não existe, criando nova...')
  }
}

// Criar tabela de usuários se não existir
verificarEstruturaTabela()

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    usuario TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK(tipo IN ('atendente', 'triador', 'medico', 'admin')),
    cpf TEXT UNIQUE NOT NULL,
    nascimento TEXT NOT NULL,
    ativo BOOLEAN DEFAULT 1,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )
`)

// Inserir usuários padrão se não existirem
const verificarUsuariosPadrao = () => {
  const usuariosExistentes = db.prepare('SELECT COUNT(*) as count FROM usuarios').get() as { count: number }
  
  if (usuariosExistentes.count === 0) {
    const senhaPadrao = bcrypt.hashSync('123456', 10)
    
    const usuariosPadrao = [
      { nome: 'Atendente Padrão', usuario: 'atendente', senha: senhaPadrao, tipo: 'atendente', cpf: '11111111111', nascimento: '1990-01-01' },
      { nome: 'Triador Padrão', usuario: 'triador', senha: senhaPadrao, tipo: 'triador', cpf: '22222222222', nascimento: '1990-01-01' },
      { nome: 'Médico Padrão', usuario: 'medico', senha: senhaPadrao, tipo: 'medico', cpf: '33333333333', nascimento: '1990-01-01' },
      { nome: 'Administrador', usuario: 'admin', senha: senhaPadrao, tipo: 'admin', cpf: '44444444444', nascimento: '1990-01-01' }
    ]
    
    const stmt = db.prepare(`
      INSERT INTO usuarios (nome, usuario, senha, tipo, cpf, nascimento) 
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    usuariosPadrao.forEach(usuario => {
      stmt.run(usuario.nome, usuario.usuario, usuario.senha, usuario.tipo, usuario.cpf, usuario.nascimento)
    })
    
    console.log('Usuários padrão criados com sucesso!')
  }
}

verificarUsuariosPadrao()

// Função para validar CPF (11 dígitos e dígitos verificadores)
function validarCPF(cpf: string): boolean {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^([0-9])\1+$/.test(cpf)) return false;
  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(9, 10))) return false;
  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.substring(10, 11))) return false;
  return true;
}

// Função para validar data de nascimento
function validarDataNascimento(data: string): boolean {
  const nascimento = new Date(data);
  const hoje = new Date();
  if (isNaN(nascimento.getTime())) return false;
  if (nascimento > hoje) return false;
  const anos = hoje.getFullYear() - nascimento.getFullYear();
  if (anos > 210) return false;
  if (anos === 210) {
    // Se for exatamente 210 anos, checar mês e dia
    if (
      hoje.getMonth() < nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())
    ) {
      return false;
    }
  }
  return true;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Login
    try {
      const { usuario, senha } = req.body

      if (!usuario || !senha) {
        return res.status(400).json({ error: 'Usuário e senha são obrigatórios' })
      }

      const usuarioEncontrado = db.prepare(`
        SELECT id, nome, usuario, senha, tipo, ativo 
        FROM usuarios 
        WHERE usuario = ? AND ativo = 1
      `).get(usuario) as { id: number; nome: string; usuario: string; senha: string; tipo: string; ativo: boolean } | undefined

      if (!usuarioEncontrado) {
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }

      const senhaValida = bcrypt.compareSync(senha, usuarioEncontrado.senha)
      
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' })
      }

      // Retorna dados do usuário (sem a senha)
      const { senha: _, ...usuarioSemSenha } = usuarioEncontrado
      
      res.status(200).json({
        message: 'Login realizado com sucesso',
        usuario: usuarioSemSenha
      })
    } catch (error) {
      console.error('Erro no login:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else if (req.method === 'GET') {
    // Listar usuários (apenas admin)
    try {
      const usuarios = db.prepare(`
        SELECT id, nome, usuario, tipo, ativo, criado_em 
        FROM usuarios 
        ORDER BY nome
      `).all()

      res.status(200).json(usuarios)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      res.status(500).json({ error: 'Erro interno do servidor' })
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
} 