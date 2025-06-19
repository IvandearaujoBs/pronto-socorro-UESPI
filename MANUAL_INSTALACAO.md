# 🏥 Manual de Instalação - Sistema de Fila Pronto Socorro

## 📋 Pré-requisitos

Antes de começar, você precisa ter instalado no seu computador:

### 1. Node.js
- **O que é**: É o programa que permite rodar aplicações JavaScript
- **Como instalar**: 
  1. Acesse [nodejs.org](https://nodejs.org)
  2. Baixe a versão "LTS" (recomendada)
  3. Execute o arquivo baixado e siga as instruções
  4. **Importante**: Marque a opção "Add to PATH" durante a instalação

### 2. Git (opcional, mas recomendado)
- **O que é**: Programa para baixar códigos da internet
- **Como instalar**:
  1. Acesse [git-scm.com](https://git-scm.com)
  2. Baixe e instale seguindo as instruções

## 🚀 Como Instalar e Rodar o Sistema

### Passo 1: Baixar o Projeto

**Opção A - Se você tem Git:**
```bash
git clone [URL_DO_REPOSITORIO]
cd FilaProntoSocorro
```

**Opção B - Se você não tem Git:**
1. Baixe o arquivo ZIP do projeto
2. Extraia em uma pasta
3. Abra o terminal/prompt na pasta extraída

### Passo 2: Abrir o Terminal

**Windows:**
1. Pressione `Windows + R`
2. Digite `cmd` e pressione Enter
3. Navegue até a pasta do projeto:
   ```bash
   cd C:\caminho\para\FilaProntoSocorro
   ```

**Mac/Linux:**
1. Abra o Terminal
2. Navegue até a pasta do projeto:
   ```bash
   cd /caminho/para/FilaProntoSocorro
   ```

### Passo 3: Instalar as Dependências

No terminal, execute:
```bash
npm install
```

**O que isso faz**: Baixa todos os programas necessários para o sistema funcionar
**Tempo**: Pode demorar alguns minutos na primeira vez

### Passo 4: Rodar o Sistema

No terminal, execute:
```bash
npm run dev
```

**O que acontece**:
- O sistema vai iniciar
- Você verá mensagens como "Ready in X.Xs"
- O sistema estará disponível em: `http://localhost:3000`

### Passo 5: Acessar o Sistema

1. Abra seu navegador (Chrome, Firefox, Edge, etc.)
2. Digite na barra de endereços: `http://localhost:3000`
3. Pressione Enter

## 🎯 Como Usar o Sistema

### Página Inicial
- **Estatísticas em tempo real**: Mostra quantos pacientes estão na fila, triagens realizadas, etc.
- **Menu principal**: Acesso às diferentes áreas do sistema

### 1. Recepção
- **O que faz**: Cadastra novos pacientes
- **Como usar**:
  1. Clique em "Recepção"
  2. Preencha nome, CPF e data de nascimento
  3. Clique em "Cadastrar Paciente"

### 2. Triagem
- **O que faz**: Avalia o risco do paciente
- **Como usar**:
  1. Clique em "Triagem"
  2. Selecione um paciente da lista
  3. Preencha os dados (pressão, temperatura, batimentos)
  4. Escolha o nível de risco (vermelho, laranja, amarelo, verde, azul)
  5. Clique em "Realizar Triagem"

### 3. Médico
- **O que faz**: Atende os pacientes
- **Como usar**:
  1. Clique em "Médico"
  2. Clique em "Chamar Próximo Paciente"
  3. Preencha diagnóstico e prescrição
  4. Clique em "Finalizar Atendimento"

### 4. Fila
- **O que faz**: Mostra todos os pacientes na fila
- **Como usar**:
  1. Clique em "Fila"
  2. Veja a lista de pacientes organizados por prioridade

### 5. Debug
- **O que faz**: Mostra estatísticas detalhadas e pacientes com tempo estourado
- **Como usar**:
  1. Clique em "Debug do Sistema" na página inicial
  2. Veja estatísticas por risco e alertas de tempo

## ⏰ Sistema de Tempos por Risco

O sistema monitora automaticamente os tempos de espera:

- **🔴 Vermelho**: 0 minutos (atendimento imediato)
- **🟠 Laranja**: 10 minutos
- **🟡 Amarelo**: 60 minutos (1 hora)
- **🟢 Verde**: 120 minutos (2 horas)
- **🔵 Azul**: 240 minutos (4 horas)

**Alertas**: Pacientes que ultrapassam o tempo aparecem destacados em vermelho.

## 🛠️ Solução de Problemas

### Erro: "npm não é reconhecido"
**Solução**: Reinstale o Node.js marcando "Add to PATH"

### Erro: "Port 3000 is in use"
**Solução**: O sistema vai automaticamente usar a porta 3001 ou 3002

### Erro: "Cannot find module"
**Solução**: Execute novamente `npm install`

### Sistema não carrega
**Solução**:
1. Feche o terminal
2. Abra novamente
3. Navegue até a pasta do projeto
4. Execute `npm run dev`

### Banco de dados com erro
**Solução**:
1. Acesse `http://localhost:3000/debug`
2. Clique em "Limpar Dados"
3. Comece novamente

## 📱 Acesso Remoto

Para acessar de outros computadores na mesma rede:
1. Veja o endereço IP no terminal (ex: `http://192.168.1.100:3000`)
2. Use esse endereço em outros computadores da rede

## 🔧 Comandos Úteis

```bash
# Parar o sistema
Ctrl + C (no terminal)

# Reiniciar o sistema
npm run dev

# Limpar cache (se houver problemas)
npm run build
npm run dev

# Ver versão do Node.js
node --version

# Ver versão do npm
npm --version
```

## 📞 Suporte

Se encontrar problemas:
1. Verifique se o Node.js está instalado corretamente
2. Certifique-se de estar na pasta correta do projeto
3. Execute `npm install` novamente
4. Reinicie o terminal e tente novamente

## 🎉 Pronto!

Agora você tem um sistema completo de gerenciamento de fila para pronto socorro rodando no seu computador! 

**Lembre-se**: Mantenha o terminal aberto enquanto usar o sistema. Para parar, pressione `Ctrl + C` no terminal. 