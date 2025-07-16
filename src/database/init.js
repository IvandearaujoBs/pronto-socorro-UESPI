const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite');
const db = new Database(dbPath);

// Criação das tabelas principais
// Pacientes
// Triagem
// Fila
// Tempos máximos
// Remoções
// Histórico de Remoções

db.exec(`
CREATE TABLE IF NOT EXISTS pacientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  data_nascimento TEXT, -- agora aceita nulo
  nascimento TEXT -- coluna extra para compatibilidade
);

CREATE TABLE IF NOT EXISTS triagem (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fila_id INTEGER NOT NULL,
  paciente_id INTEGER NOT NULL,
  pressao TEXT,
  temperatura TEXT,
  batimentos TEXT,
  risco TEXT,
  data TEXT,
  FOREIGN KEY(fila_id) REFERENCES fila(id),
  FOREIGN KEY(paciente_id) REFERENCES pacientes(id)
);

CREATE TABLE IF NOT EXISTS fila (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  paciente_id INTEGER NOT NULL,
  status TEXT,
  prioridade INTEGER,
  chamada_em TEXT,
  FOREIGN KEY(paciente_id) REFERENCES pacientes(id)
);

CREATE TABLE IF NOT EXISTS tempos_maximos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  risco TEXT,
  tempo_maximo INTEGER
);

CREATE TABLE IF NOT EXISTS remocoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  paciente_id INTEGER,
  motivo TEXT,
  data_remocao TEXT,
  FOREIGN KEY(paciente_id) REFERENCES pacientes(id)
);

CREATE TABLE IF NOT EXISTS historico_remocoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  paciente_id INTEGER,
  motivo TEXT,
  data_remocao TEXT,
  FOREIGN KEY(paciente_id) REFERENCES pacientes(id)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  funcao TEXT NOT NULL, -- 'administrador', 'atendente', 'triador', 'medico'
  senha TEXT NOT NULL
);
`);

console.log('Banco de dados inicializado com sucesso!');
db.close(); 