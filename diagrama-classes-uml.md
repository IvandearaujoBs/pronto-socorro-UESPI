# 📊 Diagrama de Classes UML - Sistema de Pronto Socorro UESPI

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    SISTEMA DE PRONTO SOCORRO UESPI                              │
│                                         DIAGRAMA DE CLASSES                                     │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           PACIENTE                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                                                   │
│ - nome: String                                                                                  │
│ - cpf: String                                                                                   │
│ - nascimento: String                                                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + cadastrar(nome: String, cpf: String, nascimento: String): Boolean                            │
│ + buscarPorCPF(cpf: String): Paciente                                                          │
│ + buscarPorId(id: Integer): Paciente                                                            │
│ + listarTodos(): List<Paciente>                                                                 │
│ + remover(motivo: String): Boolean                                                              │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            │ 1
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                           TRIAGEM                                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                                                   │
│ - paciente_id: Integer                                                                          │
│ - pressao: String                                                                               │
│ - temperatura: String                                                                           │
│ - batimentos: String                                                                            │
│ - risco: String                                                                                 │
│ - data: DateTime                                                                                │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + realizar(pacienteId: Integer, pressao: String, temperatura: String,                          │
│           batimentos: String, risco: String): Boolean                                          │
│ + buscarPorPaciente(pacienteId: Integer): Triagem                                              │
│ + listarPorRisco(risco: String): List<Triagem>                                                 │
│ + calcularTempoEspera(): Integer                                                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            │ 1
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                            FILA                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                                                   │
│ - paciente_id: Integer                                                                          │
│ - status: String                                                                                │
│ - chamada_em: DateTime                                                                          │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + adicionar(pacienteId: Integer): Boolean                                                       │
│ + atualizarStatus(id: Integer, status: String): Boolean                                        │
│ + buscarProximo(): Paciente                                                                     │
│ + listarPorStatus(status: String): List<Fila>                                                  │
│ + finalizarAtendimento(id: Integer): Boolean                                                   │
│ + devolverParaFila(id: Integer): Boolean                                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
                                            │
                                            │ 1
                                            │
                                            ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    HISTÓRICO_REMOÇÕES                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                                                   │
│ - paciente_id: Integer                                                                          │
│ - motivo: String                                                                                │
│ - data_remocao: DateTime                                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + registrarRemocao(pacienteId: Integer, motivo: String): Boolean                               │
│ + buscarPorPaciente(pacienteId: Integer): List<HistoricoRemocao>                               │
│ + listarTodas(): List<HistoricoRemocao>                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       TEMPOS_MÁXIMOS                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ - id: Integer                                                                                   │
│ - risco: String                                                                                 │
│ - tempo_minutos: Integer                                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + configurarTempo(risco: String, tempo: Integer): Boolean                                      │
│ + buscarTempoPorRisco(risco: String): Integer                                                  │
│ + listarTodos(): List<TempoMaximo>                                                              │
│ + verificarTempoExcedido(risco: String, tempoEspera: Integer): Boolean                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        SISTEMA                                                  │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ - database: Database                                                                            │
│ - minHeap: MinHeap<PacienteHeapItem>                                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + cadastrarPaciente(nome: String, cpf: String, nascimento: String): Boolean                    │
│ + realizarTriagem(pacienteId: Integer, dadosTriagem: Object): Boolean                          │
│ + chamarProximo(): Paciente                                                                     │
│ + finalizarAtendimento(filaId: Integer): Boolean                                               │
│ + removerPaciente(pacienteId: Integer, motivo: String): Boolean                                │
│ + obterFila(): Object                                                                           │
│ + obterEstatisticas(): Object                                                                   │
│ + limparDados(): Boolean                                                                        │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    PACIENTE_HEAP_ITEM                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ - prioridade: Integer                                                                           │
│ - item: Paciente                                                                                │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + calcularPrioridade(): Integer                                                                 │
│ + compararCom(outro: PacienteHeapItem): Integer                                                │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         MIN_HEAP                                                │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ - heap: Array<HeapItem>                                                                         │
│ - size: Integer                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + insert(item: HeapItem): void                                                                  │
│ + extractMin(): HeapItem                                                                        │
│ + isEmpty(): Boolean                                                                            │
│ + size(): Integer                                                                               │
│ - heapifyUp(index: Integer): void                                                               │
│ - heapifyDown(index: Integer): void                                                             │
│ - parent(index: Integer): Integer                                                               │
│ - leftChild(index: Integer): Integer                                                            │
│ - rightChild(index: Integer): Integer                                                           │
│ - swap(i: Integer, j: Integer): void                                                            │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         HEAP_ITEM                                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + prioridade: Integer                                                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│ + compararCom(outro: HeapItem): Integer                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        ENUMS                                                    │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│ RISCO:                                                                                          │
│ - VERMELHO = "vermelho"                                                                         │
│ - LARANJA = "laranja"                                                                           │
│ - AMARELO = "amarelo"                                                                           │
│ - VERDE = "verde"                                                                               │
│ - AZUL = "azul"                                                                                 │
│                                                                                                 │
│ STATUS_FILA:                                                                                    │
│ - ESPERANDO = "esperando"                                                                       │
│ - TRIAGEM_CONCLUIDA = "triagem_concluida"                                                       │
│ - EM_ATENDIMENTO = "em_atendimento"                                                             │
│ - ATENDIDO = "atendido"                                                                         │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    RELACIONAMENTOS                                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│ PACIENTE ────── 1 ────── * ────── TRIAGEM                                                      │
│ PACIENTE ────── 1 ────── * ────── FILA                                                         │
│ PACIENTE ────── 1 ────── * ────── HISTÓRICO_REMOÇÕES                                           │
│                                                                                                 │
│ SISTEMA ────── 1 ────── 1 ────── MIN_HEAP                                                      │
│ MIN_HEAP ────── * ────── 1 ────── PACIENTE_HEAP_ITEM                                           │
│ PACIENTE_HEAP_ITEM ────── 1 ────── 1 ────── PACIENTE                                           │
│                                                                                                 │
│ TEMPOS_MÁXIMOS ────── * ────── 1 ────── RISCO                                                  │
│ TRIAGEM ────── 1 ────── 1 ────── RISCO                                                         │
│ FILA ────── 1 ────── 1 ────── STATUS_FILA                                                      │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    CARDINALIDADES                                               │
├─────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                 │
│ 1 ────── * : Um para Muitos                                                                     │
│ 1 ────── 1 : Um para Um                                                                         │
│ * ────── * : Muitos para Muitos                                                                 │
│                                                                                                 │
│ Exemplos:                                                                                       │
│ - Um PACIENTE pode ter múltiplas TRIAGENS (histórico)                                          │
│ - Um PACIENTE pode ter múltiplos registros na FILA (histórico)                                 │
│ - Um PACIENTE pode ter múltiplas REMOÇÕES registradas                                          │
│ - Um SISTEMA tem uma MIN_HEAP para priorização                                                 │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
``` 