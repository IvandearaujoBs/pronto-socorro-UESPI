const Database = require('better-sqlite3');
const path = require('path');

console.log('Updating maximum times in database...');

const dbPath = path.join(__dirname, 'src', 'database', 'db.sqlite');
const db = new Database(dbPath);

// Limpar tempos existentes
db.prepare('DELETE FROM tempos_maximos').run();

// Inserir novos tempos
db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('vermelho', 0);
db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('laranja', 10);
db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('amarelo', 60);
db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('verde', 120);
db.prepare('INSERT INTO tempos_maximos (risco, tempo_minutos) VALUES (?, ?)').run('azul', 240);

db.close();

console.log('\n🎉 Maximum times updated successfully!');
console.log('\n📋 Updated risk classification:');
console.log('🔴 Red (Emergency): 0 minutes - Immediate care, risk of death');
console.log('🟠 Orange (Urgency): 10 minutes - Can wait up to 10 minutes');
console.log('🟡 Yellow (Moderate Urgency): 60 minutes - Can wait up to 60 minutes');
console.log('🟢 Green (Less Urgent): 120 minutes - Can wait up to 120 minutes (2 hours)');
console.log('🔵 Blue (Not Urgent): 240 minutes - Can wait up to 240 minutes (4 hours)'); 