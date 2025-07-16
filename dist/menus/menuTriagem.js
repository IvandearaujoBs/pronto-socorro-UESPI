"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuTriagem = menuTriagem;
const Triagem_1 = require("../entidades/Triagem");
const data_1 = require("../data");
const Enfermeiro_1 = require("../entidades/Enfermeiro");
function menuTriagem(rl) {
    console.log("\n--- MENU TRIAGEM ---");
    console.log("1 - Realizar triagem");
    console.log("2 - Voltar");
    rl.question("Escolha uma opção: ", (op) => {
        if (op === "1") {
            const naoTriados = data_1.pacientes.filter((p) => !p.corRisco && !p.horaEntradaFila);
            if (naoTriados.length === 0) {
                console.log("Todos os pacientes já foram triados.");
                return menuTriagem(rl);
            }
            naoTriados.forEach((p, i) => console.log(`${i + 1} - ${p.nome}`));
            rl.question("Escolha o paciente para triagem: ", (idx) => {
                const paciente = naoTriados[parseInt(idx) - 1];
                if (!paciente)
                    return menuTriagem(rl);
                rl.question("ID do enfermeiro: ", (idStr) => {
                    rl.question("Nome do enfermeiro: ", (nome) => {
                        rl.question("COREN do enfermeiro: ", (coren) => {
                            const enfermeiro = new Enfermeiro_1.Enfermeiro(parseInt(idStr), nome, coren);
                            rl.question("Cor de risco (azul/verde/laranja/amarelo): ", (cor) => {
                                rl.question("Queixa principal: ", (queixa) => {
                                    rl.question("Temperatura (°C): ", (tempStr) => {
                                        rl.question("Pressão arterial: ", (pressao) => {
                                            rl.question("Frequência cardíaca (bpm): ", (fcStr) => {
                                                rl.question("Frequência respiratória (rpm): ", (frStr) => {
                                                    rl.question("Saturação (%): ", (satStr) => {
                                                        const triagem = new Triagem_1.Triagem(paciente, enfermeiro, parseFloat(tempStr), pressao, parseInt(fcStr), parseInt(frStr), parseInt(satStr), cor.toLowerCase(), queixa);
                                                        triagem.enviarParaFila(data_1.fila);
                                                        console.log(`${paciente.nome.toUpperCase()} (${cor.toUpperCase()}) entrou na fila.`);
                                                        menuTriagem(rl);
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }
        else {
            require("./menuPrincipal").menuPrincipal();
        }
    });
}
