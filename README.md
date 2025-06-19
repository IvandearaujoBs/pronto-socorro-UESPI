# 🏥 Sistema de Fila - Pronto Socorro

Sistema de gerenciamento de fila para pronto socorro com interface web moderna.

## 🚀 Funcionalidades

- **Recepção**: Cadastro de pacientes
- **Triagem**: Avaliação de risco com sistema de cores
- **Médico**: Atendimento e finalização de consultas
- **Fila**: Visualização em tempo real da fila de espera
- **Priorização**: Sistema automático de priorização por risco
- **Sistema de Tempos**: Monitoramento de tempos máximos por nível de risco
- **Debug**: Página de monitoramento e estatísticas em tempo real

## 🎨 Interface

Interface moderna e responsiva com:
- Design limpo e intuitivo
- Cores diferenciadas por nível de risco
- Atualização em tempo real
- Estatísticas visuais
- Navegação fácil entre módulos

## 🛠️ Tecnologias

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Banco de Dados**: SQLite com better-sqlite3
- **Estilização**: Tailwind CSS

## 📦 Instalação e Configuração

### Pré-requisitos

Antes de começar, você precisa ter instalado no seu computador:

1. **Node.js** (versão 16 ou superior)
   - Baixe em: https://nodejs.org/
   - Para verificar se está instalado: `node --version`

2. **Git** (para baixar o projeto)
   - Baixe em: https://git-scm.com/
   - Para verificar se está instalado: `git --version`

### Passo a Passo da Instalação

#### 1. Baixar o Projeto

```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd FilaProntoSocorro
```

#### 2. Instalar Dependências

```bash
# Instalar todas as bibliotecas necessárias
npm install
```

#### 3. Rodar o Sistema

```bash
# Iniciar o servidor de desenvolvimento
npm run dev
```

O sistema estará disponível em: **http://localhost:3000**

### 🎯 Como Usar o Sistema

#### Páginas Principais

1. **Página Inicial** (`/`)
   - Visão geral do sistema
   - Estatísticas em tempo real
   - Links para todas as páginas

2. **Recepção** (`/recepcao`)
   - Cadastrar novos pacientes
   - Preencher: Nome, CPF, Data de Nascimento
   - Pacientes entram automaticamente na fila

3. **Triagem** (`/triagem`)
   - Avaliar pacientes sem triagem
   - Preencher: Pressão, Temperatura, Batimentos
   - Definir nível de risco (Vermelho, Laranja, Amarelo, Verde, Azul)

4. **Médico** (`/medico`)
   - Ver pacientes na fila
   - Chamar próximo paciente
   - Finalizar atendimento com diagnóstico e prescrição

5. **Fila** (`/fila`)
   - Visualizar todos os pacientes na fila
   - Ver ordem de prioridade
   - Status de cada paciente

6. **Debug** (`/debug`)
   - Monitorar estado do banco de dados
   - Ver estatísticas detalhadas
   - Identificar problemas
   - Limpar dados do banco

### 🚨 Sistema de Tempos por Risco

O sistema monitora automaticamente os tempos de espera conforme a classificação de risco:

- **🔴 Vermelho (Emergência)**: 0 minutos - Atendimento imediato, risco de morte
- **🟠 Laranja (Urgência)**: 10 minutos - Pode aguardar até 10 minutos
- **🟡 Amarelo (Urgência Moderada)**: 60 minutos - Pode aguardar até 60 minutos
- **🟢 Verde (Pouco Urgente)**: 120 minutos - Pode aguardar até 120 minutos (2 horas)
- **🔵 Azul (Não Urgente)**: 240 minutos - Pode aguardar até 240 minutos (4 horas)

Pacientes que ultrapassam o tempo aparecem destacados na página de debug.

### 🌐 Acesso Remoto

Para acessar de outros computadores na rede:

1. O sistema mostra o IP da rede no terminal
2. Acesse: `http://[IP_DA_REDE]:3000`
3. Exemplo: `http://192.168.1.100:3000`

### 📋 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Gera versão de produção
npm run start:next   # Inicia servidor de produção

# Sistema CLI original
npm start            # Executa versão terminal do sistema

# Limpeza
rm -rf .next         # Limpa cache do Next.js
rm -rf node_modules  # Remove dependências
```

## 📊 Estrutura do Banco

- **pacientes**: Dados dos pacientes
- **triagem**: Avaliações de triagem
- **fila**: Status e controle da fila
- **users**: Usuários do sistema
- **tempos_maximos**: Configuração de tempos por nível de risco

## 🔧 Desenvolvimento

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run start:next`: Inicia o servidor de produção
- `npm start`: Executa o sistema CLI original

### Estrutura de Arquivos

```
├── pages/                 # Páginas Next.js
│   ├── api/              # APIs do backend
│   ├── index.tsx         # Página principal
│   ├── recepcao.tsx      # Módulo de recepção
│   ├── triagem.tsx       # Módulo de triagem
│   ├── medico.tsx        # Módulo médico
│   ├── fila.tsx          # Visualização da fila
│   └── debug.tsx         # Página de debug
├── styles/               # Estilos globais
├── src/                  # Código original do sistema
└── public/               # Arquivos estáticos
```

## 🎯 Próximas Melhorias

- [ ] Autenticação de usuários
- [ ] Relatórios e estatísticas
- [ ] Notificações em tempo real
- [ ] Integração com sistemas hospitalares
- [ ] App mobile
- [ ] Backup automático do banco

## 📝 Licença

Este projeto está sob a licença ISC. 