# 📊 Documentação do Diagrama Relacional - Sistema de Pronto Socorro UESPI

## 🎯 Visão Geral

Este documento descreve o diagrama relacional completo do sistema de gerenciamento de fila de pronto socorro da UESPI. O sistema utiliza um banco de dados SQLite com 5 tabelas principais que gerenciam todo o fluxo de atendimento médico.

## 🗄️ Estrutura do Banco de Dados

### 📋 Tabelas Principais

#### 1. **pacientes** - Entidade Central
```sql
CREATE TABLE pacientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    cpf TEXT UNIQUE NOT NULL,
    nascimento TEXT
);
```

**Propósito**: Armazena informações básicas dos pacientes
- **id**: Identificador único auto-incrementado
- **nome**: Nome completo do paciente (obrigatório)
- **cpf**: CPF único para evitar duplicatas (obrigatório)
- **nascimento**: Data de nascimento (opcional)

**Relacionamentos**:
- 1:N com `triagem`
- 1:N com `fila`
- 1:N com `historico_remocoes`

#### 2. **triagem** - Avaliação Médica
```sql
CREATE TABLE triagem (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER NOT NULL,
    pressao TEXT,
    temperatura TEXT,
    batimentos TEXT,
    risco TEXT NOT NULL,
    data TEXT NOT NULL,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);
```

**Propósito**: Registra dados da triagem médica inicial
- **id**: Identificador único
- **paciente_id**: Referência ao paciente (FK)
- **pressao**: Pressão arterial (opcional)
- **temperatura**: Temperatura corporal (opcional)
- **batimentos**: Frequência cardíaca (opcional)
- **risco**: Classificação de risco (obrigatório)
- **data**: Data/hora da triagem

**Classificação de Risco**:
- 🔴 **Vermelho**: Emergência (0 min)
- 🟠 **Laranja**: Muito Urgente (10 min)
- 🟡 **Amarelo**: Urgente (60 min)
- 🟢 **Verde**: Pouco Urgente (120 min)
- 🔵 **Azul**: Não Urgente (240 min)

#### 3. **fila** - Controle de Atendimento
```sql
CREATE TABLE fila (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER NOT NULL,
    status TEXT NOT NULL,
    chamada_em TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);
```

**Propósito**: Controla o status e posição do paciente na fila
- **id**: Identificador único
- **paciente_id**: Referência ao paciente (FK)
- **status**: Status atual na fila (obrigatório)
- **chamada_em**: Timestamp da última chamada

**Estados Possíveis**:
1. `esperando` - Aguardando triagem
2. `triagem_concluida` - Triagem realizada, aguardando atendimento
3. `em_atendimento` - Sendo atendido pelo médico
4. `atendido` - Atendimento finalizado

#### 4. **historico_remocoes** - Auditoria
```sql
CREATE TABLE historico_remocoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    paciente_id INTEGER NOT NULL,
    motivo TEXT NOT NULL,
    data_remocao TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);
```

**Propósito**: Registra pacientes removidos da fila
- **id**: Identificador único
- **paciente_id**: Referência ao paciente (FK)
- **motivo**: Justificativa da remoção (obrigatório)
- **data_remocao**: Data/hora da remoção

#### 5. **tempos_maximos** - Configuração
```sql
CREATE TABLE tempos_maximos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    risco TEXT UNIQUE NOT NULL,
    tempo_minutos INTEGER NOT NULL
);
```

**Propósito**: Configuração dos tempos máximos por risco
- **id**: Identificador único
- **risco**: Classificação de risco (único)
- **tempo_minutos**: Tempo máximo em minutos

## 🔗 Relacionamentos

### Diagrama de Relacionamentos
```
pacientes (1) ←→ (N) triagem
pacientes (1) ←→ (N) fila
pacientes (1) ←→ (N) historico_remocoes
```

### Detalhamento dos Relacionamentos

1. **pacientes → triagem**: Um paciente pode ter múltiplas triagens (histórico)
2. **pacientes → fila**: Um paciente pode ter múltiplos registros na fila (histórico)
3. **pacientes → historico_remocoes**: Um paciente pode ter múltiplas remoções registradas

## 📈 Índices e Otimização

### Índices Criados
```sql
-- Pacientes
CREATE INDEX idx_pacientes_cpf ON pacientes(cpf);
CREATE INDEX idx_pacientes_nome ON pacientes(nome);

-- Triagem
CREATE INDEX idx_triagem_paciente_id ON triagem(paciente_id);
CREATE INDEX idx_triagem_risco ON triagem(risco);

-- Fila
CREATE INDEX idx_fila_paciente_id ON fila(paciente_id);
CREATE INDEX idx_fila_status ON fila(status);
CREATE INDEX idx_fila_chamada_em ON fila(chamada_em);

-- Histórico
CREATE INDEX idx_historico_paciente_id ON historico_remocoes(paciente_id);
```

### Benefícios dos Índices
- **Busca por CPF**: O(1) em vez de O(n)
- **Filtros por status**: Otimização de queries de fila
- **Ordenação temporal**: Performance em listagens cronológicas
- **Joins**: Aceleração de relacionamentos

## 🔄 Fluxo de Dados

### 1. Cadastro de Paciente
```
INSERT INTO pacientes (nome, cpf, nascimento) VALUES (?, ?, ?)
INSERT INTO fila (paciente_id, status) VALUES (?, 'esperando')
```

### 2. Triagem
```
INSERT INTO triagem (paciente_id, pressao, temperatura, batimentos, risco, data) VALUES (?, ?, ?, ?, ?, ?)
UPDATE fila SET status = 'triagem_concluida' WHERE paciente_id = ?
```

### 3. Atendimento
```
UPDATE fila SET status = 'em_atendimento' WHERE id = ?
```

### 4. Finalização
```
UPDATE fila SET status = 'atendido' WHERE id = ?
```

## 🎯 Views Úteis

### 1. **v_fila_completa**
View que combina todas as informações necessárias para exibição da fila:
- Dados do paciente
- Informações da triagem
- Status atual
- Tempos máximos

### 2. **v_pacientes_sem_triagem**
Identifica pacientes que ainda não passaram pela triagem:
- Filtra por status 'esperando'
- Exclui pacientes já triados
- Remove pacientes com histórico de remoção

### 3. **v_estatisticas_fila**
Fornece estatísticas em tempo real:
- Contadores por status
- Distribuição por classificação de risco
- Totais gerais

## 🔒 Integridade e Constraints

### Constraints de Dados
```sql
-- Triagem
CHECK (risco IN ('vermelho', 'laranja', 'amarelo', 'verde', 'azul'))

-- Fila
CHECK (status IN ('esperando', 'triagem_concluida', 'em_atendimento', 'atendido'))

-- Tempos Máximos
CHECK (risco IN ('vermelho', 'laranja', 'amarelo', 'verde', 'azul'))
CHECK (tempo_minutos >= 0)
```

### Triggers de Integridade
1. **tr_fila_unica_paciente**: Garante que um paciente só tenha um registro ativo na fila
2. **tr_fila_update_timestamp**: Atualiza timestamp quando status muda

## 🚀 Queries Principais

### 1. Fila Ordenada por Prioridade
```sql
SELECT f.*, p.*, t.*, tm.tempo_minutos
FROM fila f
INNER JOIN pacientes p ON f.paciente_id = p.id
INNER JOIN triagem t ON p.id = t.paciente_id
LEFT JOIN tempos_maximos tm ON t.risco = tm.risco
LEFT JOIN historico_remocoes h ON p.id = h.paciente_id
WHERE h.id IS NULL
ORDER BY 
    CASE t.risco
        WHEN 'vermelho' THEN 1
        WHEN 'laranja' THEN 2
        WHEN 'amarelo' THEN 3
        WHEN 'verde' THEN 4
        WHEN 'azul' THEN 5
        ELSE 6
    END,
    f.chamada_em ASC;
```

### 2. Pacientes sem Triagem
```sql
SELECT p.*, f.status, f.chamada_em
FROM pacientes p
INNER JOIN fila f ON p.id = f.paciente_id
LEFT JOIN triagem t ON p.id = t.paciente_id
LEFT JOIN historico_remocoes h ON p.id = h.paciente_id
WHERE f.status IN ('esperando', 'triagem_concluida')
    AND t.id IS NULL 
    AND h.id IS NULL
ORDER BY f.chamada_em ASC;
```

## 📊 Métricas e Monitoramento

### Indicadores de Performance
- **Tempo médio de espera** por classificação de risco
- **Taxa de ocupação** da fila
- **Distribuição** de pacientes por status
- **Tempo de triagem** médio

### Alertas Automáticos
- Pacientes com tempo de espera excedido
- Fila com muitos pacientes de alto risco
- Tempo médio de atendimento elevado

## 🔮 Considerações para Escalabilidade

### Possíveis Melhorias
1. **Particionamento**: Separar dados históricos em tabelas particionadas
2. **Cache**: Implementar cache Redis para consultas frequentes
3. **Replicação**: Múltiplas instâncias para alta disponibilidade
4. **Backup**: Estratégia de backup automático

### Migração para Outros SGBDs
- **PostgreSQL**: Melhor suporte a JSON e consultas complexas
- **MySQL**: Maior compatibilidade com ferramentas existentes
- **MongoDB**: Flexibilidade para dados não estruturados

---

## 📝 Como Usar os Arquivos

### 1. **diagrama-relacional.puml**
- Abra em um editor que suporte PlantUML
- Gere o diagrama visual
- Use para documentação e apresentações

### 2. **schema-completo.sql**
- Execute no SQLite para criar o banco
- Contém toda a estrutura necessária
- Inclui dados iniciais e configurações

### 3. **DOCUMENTACAO_DIAGRAMA.md**
- Referência completa do sistema
- Guia para desenvolvedores
- Base para manutenção e evolução

---

*Este diagrama relacional foi projetado para ser eficiente, escalável e fácil de manter, seguindo as melhores práticas de modelagem de dados.* 