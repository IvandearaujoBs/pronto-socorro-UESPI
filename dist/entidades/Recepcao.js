"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recepcao = void 0;
const Paciente_1 = require("./Paciente");
class Recepcao {
    constructor(rl) {
        this.rl = rl;
    }
    cadastrarPaciente(callback) {
        this.rl.question("Nome: ", (nome) => {
            this.rl.question("Data de nascimento (dd-mm-yyyy): ", (nascimento) => {
                this.rl.question("Sexo (1 - masculino | 2 - feminino): ", (sexo) => {
                    this.rl.question("Nº do cartão SUS: ", (sus) => {
                        this.rl.question("CPF: ", (cpf) => {
                            this.rl.question("Telefone: ", (telefone) => {
                                this.rl.question("É prioritário legal (s/n)? ", (prior) => {
                                    const prioridadeLegal = prior.toLowerCase() === "s";
                                    const sexoFormatado = sexo === "2" ? "feminino" : "masculino";
                                    const nascimentoTimestamp = new Date(nascimento).getTime();
                                    const paciente = new Paciente_1.Paciente(Date.now(), nome, nascimentoTimestamp, sexoFormatado, parseInt(sus), cpf, telefone, prioridadeLegal);
                                    callback(paciente);
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}
exports.Recepcao = Recepcao;
