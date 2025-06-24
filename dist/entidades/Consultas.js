"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Consulta = void 0;
class Consulta {
    constructor(medico, paciente, diagnostico, medicacao, exames) {
        this.medico = medico;
        this.paciente = paciente;
        this.diagnostico = diagnostico;
        this.medicacao = medicacao;
        this.exames = exames;
        this.id = Consulta.contador++;
    }
    exibirResumo() {
        console.log(`\n--- Consulta #${this.id} ---`);
        console.log(`Paciente: ${this.paciente.nome}`);
        console.log(`Médico: Dr(a). ${this.medico.nome} (${this.medico.especialidade})`);
        console.log(`Diagnóstico: ${this.diagnostico}`);
        console.log(`Medicação: ${this.medicacao}`);
        console.log(`Exames: ${this.exames}`);
    }
}
exports.Consulta = Consulta;
Consulta.contador = 1;
