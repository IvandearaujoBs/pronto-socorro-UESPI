# 🏗️ Arquitetura do Sistema ClinicFlow

## **Visão Geral**

O ClinicFlow é um sistema web para gerenciamento de fila de pronto socorro, construído com arquitetura moderna baseada em Next.js, seguindo padrões de desenvolvimento web atuais.

## **📐 Arquitetura Geral**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (SQLite)      │
│   React/TS      │    │   TypeScript    │    │   better-sqlite3│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## **🏛️ Padrão Arquitetural**

### **1. Arquitetura em Camadas**
- **Apresentação**: Páginas React/Next.js
- **Lógica de Negócio**: API Routes (handlers)
- **Persistência**: SQLite com better-sqlite3
- **Roteamento**: Next.js App Router

### **2. Padrão MVC Simplificado**
- **Model**: Banco de dados SQLite
- **View**: Componentes React
- **Controller**: API Routes

## **📁 Estrutura de Diretórios**

```
pronto-socorro-UESPI-main/
├── pages/                    # Páginas Next.js (Frontend)
│   ├── api/                  # API Routes (Backend)
│   │   ├── pacientes/        # Endpoints de pacientes
│   │   ├── triagem.ts        # API de triagem
│   │   ├── fila/             # Endpoints da fila
│   │   └── debug.ts          # API de debug
│   ├── index.tsx             # Página principal
│   ├── recepcao.tsx          # Módulo de recepção
│   ├── triagem.tsx           # Módulo de triagem
│   ├── medico.tsx            # Módulo médico
│   ├── fila.tsx              # Visualização da fila
│   └── debug.tsx             # Página de debug
├── src/                      # Código fonte
│   ├── constantes/           # Constantes do sistema
│   ├── database/             # Configuração do banco
│   └── TempoRestante.tsx     # Componente utilitário
├── styles/                   # Estilos globais
├── public/                   # Arquivos estáticos
└── package.json              # Dependências e scripts
```

## **🔧 Tecnologias Utilizadas**

### **Frontend**
- **Next.js 13+**: Framework React com SSR/SSG
- **React 19**: Biblioteca de interface
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Framework CSS utilitário

### **Backend**
- **Next.js API Routes**: Servidor backend integrado
- **better-sqlite3**: Driver SQLite para Node.js
- **TypeScript**: Tipagem estática

### **Banco de Dados**
- **SQLite**: Banco relacional embutido
- **Schema**: Tabelas para pacientes, triagem, fila, histórico

## **🔄 Fluxo de Dados**

### **1. Cadastro de Paciente**
```
Frontend (recepcao.tsx) 
    ↓ POST /api/pacientes
API Route (pacientes.ts)
    ↓ INSERT INTO pacientes
Database (SQLite)
    ↓ INSERT INTO fila
Status: 'esperando'
```

### **2. Triagem**
```
Frontend (triagem.tsx)
    ↓ POST /api/triagem
API Route (triagem.ts)
    ↓ INSERT INTO triagem
    ↓ UPDATE fila SET status = 'triagem_concluida'
Database (SQLite)
```

### **3. Atendimento**
```
Frontend (medico.tsx)
    ↓ POST /api/fila/proximo
API Route (proximo.ts)
    ↓ SELECT com ORDER BY prioridade
    ↓ UPDATE fila SET status = 'em_atendimento'
Database (SQLite)
```

## **🗄️ Modelo de Dados**

### **Tabelas Principais**

#### **pacientes**
```sql
CREATE TABLE pacientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  nascimento TEXT
);
```

#### **triagem**
```sql
CREATE TABLE triagem (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  paciente_id INTEGER,
  pressao TEXT,
  temperatura TEXT,
  batimentos TEXT,
  risco TEXT NOT NULL,
  data TEXT,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);
```

#### **fila**
```sql
CREATE TABLE fila (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  paciente_id INTEGER,
  status TEXT NOT NULL,
  chamada_em TEXT,
  FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);
```

## **🎯 Padrões de Design**

### **1. Component-Based Architecture**
- Componentes React reutilizáveis
- Separação de responsabilidades
- Props tipadas com TypeScript

### **2. RESTful API Design**
- Endpoints RESTful
- Métodos HTTP apropriados (GET, POST, PUT, DELETE)
- Respostas JSON padronizadas

### **3. State Management**
- React Hooks (useState, useEffect)
- Estado local por componente
- Comunicação via props e context

### **4. Error Handling**
- Try-catch em operações assíncronas
- Respostas de erro padronizadas
- Logs de erro no console

## **🔒 Segurança**

### **Validações**
- Validação de entrada no frontend
- Validação de dados na API
- Sanitização de dados SQL

### **Controle de Acesso**
- Validação de métodos HTTP
- Verificação de dados obrigatórios
- Controle de status de transações

## **⚡ Performance**

### **Otimizações**
- Queries SQL otimizadas
- Índices em campos de busca
- Paginação de resultados
- Cache de dados em memória

### **Monitoramento**
- Logs de operações
- Métricas de tempo de resposta
- Debug de queries SQL

## **🔄 Estados do Sistema**

### **Fluxo de Status**
```
Cadastro → 'esperando' → Triagem → 'triagem_concluida' → Atendimento → 'em_atendimento' → Finalização → 'atendido'
```

### **Priorização**
```
Vermelho (Emergência) → Laranja (Muito Urgente) → Amarelo (Urgente) → Verde (Pouco Urgente) → Azul (Não Urgente)
```

## **🚀 Deploy e Infraestrutura**

### **Desenvolvimento**
- Next.js dev server
- SQLite local
- Hot reload

### **Produção**
- Vercel/Netlify (recomendado)
- SQLite persistente
- Build otimizado

## **📊 Monitoramento e Debug**

### **Ferramentas**
- Console logs
- Página de debug (/debug)
- Queries de status
- Métricas de tempo

### **Logs**
- Operações de CRUD
- Erros de sistema
- Performance de queries
- Status de transações

## **🔮 Escalabilidade**

### **Possíveis Melhorias**
- Migração para PostgreSQL/MySQL
- Cache Redis
- Microserviços
- API Gateway
- Autenticação JWT
- Notificações em tempo real

---

*Esta arquitetura foi projetada para ser simples, eficiente e fácil de manter, seguindo boas práticas de desenvolvimento web moderno.* 