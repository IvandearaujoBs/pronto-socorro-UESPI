"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Triagem = void 0;
class Triagem {
    constructor(paciente, enfermeiro, temperatura, pressao, frequenciaCardiaca, frequenciaRespiratoria, saturacao, cor, queixa) {
        this.paciente = paciente;
        this.enfermeiro = enfermeiro;
        this.temperatura = temperatura;
        this.pressao = pressao;
        this.frequenciaCardiaca = frequenciaCardiaca;
        this.frequenciaRespiratoria = frequenciaRespiratoria;
        this.saturacao = saturacao;
        this.cor = cor;
        this.queixa = queixa;
    }
    enviarParaFila(fila) {
        this.paciente.entrarNaFila(this.cor);
        fila.entrar(this.paciente);
    }
}
exports.Triagem = Triagem;
