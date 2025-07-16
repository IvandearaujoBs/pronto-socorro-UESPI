const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

(async () => {
  const nome = 'admin';
  const funcao = 'administrador';
  const senha = 'admin123';
  const hash = await bcrypt.hash(senha, 10);
  const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite');
  const db = new Database(dbPath);
  const existe = db.prepare('SELECT * FROM users WHERE nome = ? AND funcao = ?').get(nome, funcao);
  if (!existe) {
    db.prepare('INSERT INTO users (nome, funcao, senha) VALUES (?, ?, ?)').run(nome, funcao, hash);
    console.log('Usuário administrador criado com sucesso!');
  } else {
    console.log('Usuário administrador já existe.');
  }
  db.close();
})(); 