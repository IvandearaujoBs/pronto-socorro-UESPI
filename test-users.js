const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.sqlite');
const db = new Database(dbPath);

console.log('Testing users table...');

// Verificar se a tabela existe
const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'").get();
console.log('Users table exists:', !!tableExists);

// Listar usuários existentes
const users = db.prepare('SELECT * FROM users').all();
console.log('Existing users:', users);

// Testar criação de um usuário
try {
  const stmt = db.prepare('INSERT INTO users (name, email) VALUES (?, ?)');
  const info = stmt.run('Teste User', 'teste@email.com');
  console.log('User created with ID:', info.lastInsertRowid);
} catch (error) {
  console.log('Error creating user:', error.message);
}

db.close(); 