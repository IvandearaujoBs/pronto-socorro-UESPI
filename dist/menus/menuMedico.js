"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuMedico = menuMedico;
const data_1 = require("../data");
const Medico_1 = require("../entidades/Medico");
const Consulta_1 = require("../entidades/Consulta");
const data_2 = require("../entidades/data");
function menuMedico(rl) {
    console.log("\n--- LOGIN DO MÉDICO ---");
    rl.question("Nome do médico: ", (nome) => {
        rl.question("CRM do médico: ", (crm) => {
            rl.question("Especialidade do médico: ", (especialidade) => {
                const medico = new Medico_1.Medico(nome, crm, especialidade);
                exibirMenuMedico(rl, medico);
            });
        });
    });
}
function exibirMenuMedico(rl, medico) {
    console.log("\n--- MENU MÉDICO ---");
    console.log("1 - Atender Próximo Paciente");
    console.log("2 - Ver Fila");
    console.log("3 - Voltar");
    console.log("4 - Ver histórico de consultas");
    rl.question("Escolha uma opção: ", (op) => {
        switch (op) {
            case "1":
                const paciente = data_1.fila.proximo();
                if (paciente) {
                    console.log(`\nDr(a). ${medico.nome} está atendendo ${paciente.nome}`);
                    rl.question("Diagnóstico: ", (diagnostico) => {
                        rl.question("Medicação: ", (medicacao) => {
                            rl.question("Exames solicitados: ", (exames) => {
                                const consulta = new Consulta_1.Consulta(medico, paciente, diagnostico, medicacao, exames);
                                data_2.consultas.push(consulta);
                                consulta.exibirResumo();
                                exibirMenuMedico(rl, medico);
                            });
                        });
                    });
                }
                else {
                    console.log("Nenhum paciente na fila.");
                    exibirMenuMedico(rl, medico);
                }
                break;
            case "2":
                data_1.fila.mostrar();
                exibirMenuMedico(rl, medico);
                break;
            case "4":
                mostrarConsultasDoMedico(medico);
                exibirMenuMedico(rl, medico);
                break;
            default:
                require("./menuPrincipal").menuPrincipal();
        }
    });
}
function mostrarConsultasDoMedico(medico) {
    const consultasDoMedico = data_2.consultas.filter(c => c.medico.crm === medico.crm);
    if (consultasDoMedico.length === 0) {
        console.log(`\nDr(a). ${medico.nome} ainda não realizou nenhuma consulta.`);
    }
    else {
        console.log(`\n--- Histórico de Consultas do Dr(a). ${medico.nome} ---`);
        consultasDoMedico.forEach(c => c.exibirResumo());
    }
}
