"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.menuPrincipal = menuPrincipal;
const readline = __importStar(require("readline"));
const menuRecepcao_1 = require("./menuRecepcao");
const menuTriagem_1 = require("./menuTriagem");
const menuMedico_1 = require("./menuMedico");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function menuPrincipal() {
    console.log("\n--- SISTEMA DE PRONTO-SOCORRO ---");
    console.log("1 - Acessar Recepção");
    console.log("2 - Acessar Triagem");
    console.log("3 - Acessar Médico");
    console.log("0 - Sair");
    rl.question("Escolha o setor: ", (opcao) => {
        switch (opcao) {
            case "1":
                (0, menuRecepcao_1.menuRecepcao)(rl);
                break;
            case "2":
                (0, menuTriagem_1.menuTriagem)(rl);
                break;
            case "3":
                (0, menuMedico_1.menuMedico)(rl);
                break;
            case "0":
                rl.close();
                break;
            default:
                menuPrincipal();
        }
    });
}
