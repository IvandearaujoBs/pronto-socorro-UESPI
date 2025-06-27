# 📊 Diagrama de Casos de Uso UML - Sistema de Pronto Socorro UESPI

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    SISTEMA DE PRONTO SOCORRO UESPI                              │
│                                         DIAGRAMA DE CASOS DE USO                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                 │
│                                    ┌─────────────────┐                                          │
│                                    │   RECEPCIONISTA │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   CADASTRAR     │                                          │
│                                    │   PACIENTE      │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   REMOVER       │                                          │
│                                    │   PACIENTE      │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   CONSULTAR     │                                          │
│                                    │   PACIENTES     │                                          │
│                                    └─────────────────┘                                          │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                 │
│                                    ┌─────────────────┐                                          │
│                                    │   ENFERMEIRO    │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   REALIZAR      │                                          │
│                                    │   TRIAGEM       │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   CONSULTAR     │                                          │
│                                    │   PACIENTES     │                                          │
│                                    │   SEM TRIAGEM   │                                          │
│                                    └─────────────────┘                                          │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                 │
│                                    ┌─────────────────┐                                          │
│                                    │     MÉDICO      │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   CHAMAR        │                                          │
│                                    │   PRÓXIMO       │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   FINALIZAR     │                                          │
│                                    │   ATENDIMENTO   │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   DEVOLVER      │                                          │
│                                    │   PARA FILA     │                                          │
│                                    └─────────────────┘                                          │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                 │
│                                    ┌─────────────────┐                                          │
│                                    │   ADMINISTRADOR │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   CONFIGURAR    │                                          │
│                                    │   TEMPOS MÁXIMOS│                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   LIMPAR        │                                          │
│                                    │   DADOS         │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   CONSULTAR     │                                          │
│                                    │   ESTATÍSTICAS  │                                          │
│                                    └─────────────────┘                                          │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                 │
│                                    ┌─────────────────┐                                          │
│                                    │   VISUALIZADOR  │                                          │
│                                    │   DE FILA       │                                          │
│                                    └─────────────────┘                                          │
│                                             │                                                    │
│                                             │                                                    │
│                                    ┌─────────────────┐                                          │
│                                    │   VISUALIZAR    │                                          │
│                                    │   FILA          │                                          │
│                                    └─────────────────┘                                          │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CASOS DE USO DETALHADOS                                     │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│ 1. CADASTRAR PACIENTE                                                                            │
│    - Ator: Recepcionista                                                                         │
│    - Pré-condições: Sistema operacional                                                         │
│    - Fluxo Principal:                                                                            │
│      1. Recepcionista acessa módulo de cadastro                                                 │
│      2. Sistema solicita dados do paciente (nome, CPF, nascimento)                              │
│      3. Recepcionista informa os dados                                                          │
│      4. Sistema valida CPF único                                                                │
│      5. Sistema insere paciente no banco                                                        │
│      6. Sistema adiciona paciente à fila com status "esperando"                                │
│      7. Sistema confirma cadastro realizado                                                     │
│    - Pós-condições: Paciente cadastrado e na fila                                               │
│    - Fluxos Alternativos:                                                                        │
│      - CPF já cadastrado: Sistema informa erro                                                  │
│      - Dados inválidos: Sistema solicita correção                                               │
│                                                                                                 │
│ 2. REALIZAR TRIAGEM                                                                              │
│    - Ator: Enfermeiro                                                                            │
│    - Pré-condições: Paciente cadastrado na fila                                                 │
│    - Fluxo Principal:                                                                            │
│      1. Enfermeiro acessa módulo de triagem                                                     │
│      2. Sistema lista pacientes aguardando triagem                                              │
│      3. Enfermeiro seleciona paciente                                                           │
│      4. Sistema solicita dados vitais (pressão, temperatura, batimentos)                       │
│      5. Enfermeiro informa dados vitais                                                         │
│      6. Sistema solicita classificação de risco                                                 │
│      7. Enfermeiro classifica risco (vermelho/laranja/amarelo/verde/azul)                      │
│      8. Sistema registra triagem                                                                │
│      9. Sistema atualiza status da fila para "triagem_concluida"                               │
│      10. Sistema confirma triagem realizada                                                     │
│    - Pós-condições: Triagem registrada e paciente na fila de atendimento                       │
│    - Fluxos Alternativos:                                                                        │
│      - Risco vermelho: Sistema marca como atendido imediatamente                               │
│      - Dados incompletos: Sistema solicita informações obrigatórias                            │
│                                                                                                 │
│ 3. CHAMAR PRÓXIMO                                                                                │
│    - Ator: Médico                                                                                │
│    - Pré-condições: Pacientes com triagem concluída na fila                                     │
│    - Fluxo Principal:                                                                            │
│      1. Médico solicita próximo paciente                                                        │
│      2. Sistema calcula prioridades baseadas em risco e tempo de espera                        │
│      3. Sistema ordena fila por prioridade                                                      │
│      4. Sistema seleciona paciente de maior prioridade                                          │
│      5. Sistema atualiza status para "em_atendimento"                                          │
│      6. Sistema retorna dados do paciente selecionado                                           │
│      7. Médico recebe informações do paciente                                                   │
│    - Pós-condições: Paciente em atendimento                                                     │
│    - Fluxos Alternativos:                                                                        │
│      - Fila vazia: Sistema informa que não há pacientes                                         │
│      - Apenas pacientes sem triagem: Sistema solicita triagem primeiro                          │
│                                                                                                 │
│ 4. FINALIZAR ATENDIMENTO                                                                         │
│    - Ator: Médico                                                                                │
│    - Pré-condições: Paciente em atendimento                                                     │
│    - Fluxo Principal:                                                                            │
│      1. Médico finaliza atendimento                                                             │
│      2. Sistema atualiza status para "atendido"                                                │
│      3. Sistema remove paciente da fila ativa                                                   │
│      4. Sistema confirma finalização                                                            │
│    - Pós-condições: Atendimento finalizado e paciente removido da fila                          │
│    - Fluxos Alternativos:                                                                        │
│      - Erro na finalização: Sistema mantém status anterior                                      │
│                                                                                                 │
│ 5. REMOVER PACIENTE                                                                              │
│    - Ator: Recepcionista                                                                         │
│    - Pré-condições: Paciente na fila                                                             │
│    - Fluxo Principal:                                                                            │
│      1. Recepcionista seleciona paciente para remoção                                           │
│      2. Sistema solicita motivo da remoção                                                      │
│      3. Recepcionista informa motivo                                                            │
│      4. Sistema registra remoção no histórico                                                   │
│      5. Sistema remove paciente da fila                                                         │
│      6. Sistema remove dados da triagem                                                         │
│      7. Sistema confirma remoção                                                                │
│    - Pós-condições: Paciente removido com motivo registrado                                     │
│    - Fluxos Alternativos:                                                                        │
│      - Motivo não informado: Sistema solicita motivo obrigatório                               │
│      - Paciente em atendimento: Sistema solicita finalização primeiro                           │
│                                                                                                 │
│ 6. VISUALIZAR FILA                                                                               │
│    - Ator: Visualizador de Fila                                                                  │
│    - Pré-condições: Sistema operacional                                                         │
│    - Fluxo Principal:                                                                            │
│      1. Sistema busca dados da fila                                                             │
│      2. Sistema calcula tempos de espera                                                        │
│      3. Sistema ordena por prioridade                                                           │
│      4. Sistema exibe fila ordenada                                                             │
│      5. Sistema atualiza em tempo real                                                          │
│    - Pós-condições: Fila visualizada e atualizada                                               │
│    - Fluxos Alternativos:                                                                        │
│      - Fila vazia: Sistema exibe mensagem de fila vazia                                         │
│      - Erro de conexão: Sistema exibe dados em cache                                            │
│                                                                                                 │
│ 7. CONFIGURAR TEMPOS MÁXIMOS                                                                     │
│    - Ator: Administrador                                                                         │
│    - Pré-condições: Acesso administrativo                                                       │
│    - Fluxo Principal:                                                                            │
│      1. Administrador acessa configurações                                                      │
│      2. Sistema exibe tempos atuais por risco                                                   │
│      3. Administrador modifica tempos                                                           │
│      4. Sistema valida valores                                                                   │
│      5. Sistema atualiza configurações                                                          │
│      6. Sistema confirma alterações                                                             │
│    - Pós-condições: Tempos máximos atualizados                                                  │
│    - Fluxos Alternativos:                                                                        │
│      - Valores inválidos: Sistema solicita correção                                             │
│      - Sem permissão: Sistema nega acesso                                                       │
│                                                                                                 │
│ 8. CONSULTAR ESTATÍSTICAS                                                                        │
│    - Ator: Administrador                                                                         │
│    - Pré-condições: Acesso administrativo                                                       │
│    - Fluxo Principal:                                                                            │
│      1. Administrador solicita estatísticas                                                     │
│      2. Sistema calcula métricas                                                                │
│      3. Sistema exibe relatórios                                                                │
│      4. Sistema atualiza dados em tempo real                                                    │
│    - Pós-condições: Estatísticas visualizadas                                                   │
│    - Fluxos Alternativos:                                                                        │
│      - Sem dados: Sistema exibe mensagem de dados insuficientes                                 │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    RELACIONAMENTOS ENTRE ATORES                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│ GENERALIZAÇÃO:                                                                                  │
│ - Recepcionista, Enfermeiro, Médico, Administrador são especializações de Usuário              │
│                                                                                                 │
│ ASSOCIAÇÃO:                                                                                     │
│ - Todos os atores podem consultar a fila                                                        │
│ - Recepcionista e Administrador podem gerenciar pacientes                                       │
│ - Enfermeiro e Médico podem acessar dados médicos                                               │
│                                                                                                 │
│ INCLUSÃO (<<include>>):                                                                          │
│ - Chamar Próximo inclui Consultar Fila                                                          │
│ - Finalizar Atendimento inclui Consultar Fila                                                   │
│ - Realizar Triagem inclui Consultar Pacientes                                                   │
│                                                                                                 │
│ EXTENSÃO (<<extend>>):                                                                           │
│ - Remover Paciente pode estender Consultar Pacientes                                            │
│ - Configurar Tempos pode estender Consultar Estatísticas                                        │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
``` 