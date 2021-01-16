// Librerias
import * as fs from 'fs';
import chalk from 'chalk';

// Tipos
import { Token } from '../Types/Types';

// ---------------------------------------------------- Log -----------------------------------------------------
const eraseFileIfExist = (file: fs.PathLike) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log('Se eliminó el archivo: ' + file);
  }
};

const limpiarLogsAntiguos = () => {
  eraseFileIfExist('outputs/Tokens.txt');
  eraseFileIfExist('outputs/Errores.txt');
  eraseFileIfExist('outputs/TablaSimbolos.txt');
  eraseFileIfExist('outputs/Parse.txt');
};

const crearLogsNuevos = () => {
  fs.writeFileSync('outputs/Tokens.txt', '');
  fs.writeFileSync('outputs/Errores.txt', '');
  fs.writeFileSync('outputs/TablaSimbolos.txt', '');
  fs.writeFileSync('outputs/Parse.txt', '');
  fs.appendFileSync('outputs/Parse.txt', 'Ascendente ');
};

const escribirParse = (resultado: string): void => {
  if (resultado !== ('Desplazado' || 'Finalizado' || 'Error')) {
    fs.appendFileSync('outputs/Parse.txt', ' ' + resultado);
  }
};

// --------------------------------------------------- Tokens ---------------------------------------------------
const getTokenCode = (token: Token): string => {
  return token.codigo;
};

const getTokenLexem = (token: Token): string => {
  return token.atributo ? (token.atributo.cadena ? token.atributo.cadena : '') : '';
};

const writeTokenOnLog = (token: Token) => {
  let codigo = getTokenCode(token);
  let lexema = getTokenLexem(token);
  if (codigo != 'FINAL') {
    fs.appendFileSync('outputs/Tokens.txt', '<' + codigo + ',' + lexema + '>\n');
  }
};

const consolaToken = (token: Token) => {
  let codigo = getTokenCode(token);
  if (process.argv.includes('-lex') && codigo != 'FINAL') {
    console.log(chalk.bgGreen(JSON.stringify(token)));
  }
};

export { consolaToken, crearLogsNuevos, escribirParse, limpiarLogsAntiguos, writeTokenOnLog };
