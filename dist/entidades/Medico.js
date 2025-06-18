"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Medico = void 0;
class Medico {
    constructor(nome, crm, especialidade) {
        this.nome = nome;
        this.crm = crm;
        this.especialidade = especialidade;
    }
    atender(paciente) {
        console.log(`Dr(a). ${this.nome} está atendendo ${paciente.nome}`);
    }
}
exports.Medico = Medico;
