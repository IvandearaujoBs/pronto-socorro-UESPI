"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Paciente = void 0;
const temposMaximos_1 = require("../constantes/temposMaximos");
class Paciente {
    constructor(id, nome, nascimento, sexo, SUS, cpf, telefone, prioridadeLegal, corRisco) {
        this.id = id;
        this.nome = nome;
        this.nascimento = nascimento;
        this.sexo = sexo;
        this.SUS = SUS;
        this.cpf = cpf;
        this.telefone = telefone;
        this.prioridadeLegal = prioridadeLegal;
        this.corRisco = corRisco;
    }
    entrarNaFila(corRisco) {
        this.corRisco = corRisco;
        this.horaEntradaFila = Date.now();
    }
    tempoRestante() {
        if (!this.corRisco || !this.horaEntradaFila)
            return Infinity;
        const decorrido = (Date.now() - this.horaEntradaFila) / 1000;
        return temposMaximos_1.temposMaximos[this.corRisco] - decorrido;
    }
    atrasoAbsoluto() {
        const resto = this.tempoRestante();
        return resto < 0 ? Math.abs(resto) : 0;
    }
}
exports.Paciente = Paciente;
