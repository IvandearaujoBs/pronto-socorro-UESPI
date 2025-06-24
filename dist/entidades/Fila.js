"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fila = void 0;
const MinHeap_1 = require("./MinHeap");
class Fila {
    constructor() {
        this.filas = {
            laranja: new MinHeap_1.MinHeap((a, b) => a.tempoRestante() - b.tempoRestante()),
            amarelo: new MinHeap_1.MinHeap((a, b) => a.tempoRestante() - b.tempoRestante()),
            verde: new MinHeap_1.MinHeap((a, b) => a.tempoRestante() - b.tempoRestante()),
            azul: new MinHeap_1.MinHeap((a, b) => a.tempoRestante() - b.tempoRestante())
        };
    }
    entrar(paciente) {
        if (paciente.corRisco === "vermelho") {
            console.log(`${paciente.nome} (VERMELHO) será atendido imediatamente!`);
            return;
        }
        const cor = paciente.corRisco;
        this.filas[cor].insert(paciente);
        console.log(`${paciente.nome} (${cor.toUpperCase()}${paciente.prioridadeLegal ? ", PRIORIDADE LEGAL" : ""}) entrou na fila de ${cor}.`);
    }
    proximo() {
        const ordemCor = ["laranja", "amarelo", "verde", "azul"];
        for (const cor of ordemCor) {
            if (this.filas[cor].size() > 0) {
                return this.filas[cor].extractMin() || null;
            }
        }
        return null;
    }
    mostrar() {
        const ordemCor = ["laranja", "amarelo", "verde", "azul"];
        let total = 0;
        for (const cor of ordemCor) {
            const filaHeap = this.filas[cor];
            const fila = filaHeap.getSortedElements();
            if (fila.length > 0) {
                console.log(`--- Fila ${cor.toUpperCase()} ---`);
                fila.forEach((p, i) => {
                    const restante = Math.max(0, p.tempoRestante()).toFixed(1);
                    console.log(`${i + 1}. ${p.nome} (${p.corRisco?.toUpperCase()}${p.prioridadeLegal ? ", PRIORIDADE LEGAL" : ""}) - ${restante}s`);
                });
                total += fila.length;
            }
        }
        if (total === 0) {
            console.log("Nenhum paciente na fila.");
        }
    }
}
exports.Fila = Fila;
