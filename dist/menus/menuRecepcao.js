"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuRecepcao = menuRecepcao;
const Recepcao_1 = require("../entidades/Recepcao");
const data_1 = require("../data");
function menuRecepcao(rl) {
    const recepcao = new Recepcao_1.Recepcao(rl);
    console.log("\n--- MENU RECEPÇÃO ---");
    console.log("1 - Cadastrar Paciente");
    console.log("2 - Voltar");
    rl.question("Escolha uma opção: ", (op) => {
        if (op === "1") {
            recepcao.cadastrarPaciente((p) => {
                data_1.pacientes.push(p);
                console.log("Paciente cadastrado com sucesso.");
                menuRecepcao(rl);
            });
        }
        else {
            require("./menuPrincipal").menuPrincipal();
        }
    });
}
