// Librerias
import * as fs from 'fs';
import * as chalk from 'chalk';

// Tipos
import { Token } from '../types/types';

// ---------------------------------------------------- Log -----------------------------------------------------
const eraseFileIfExist = (file: fs.PathLike) => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log('Se eliminó el archivo: ' + file);
  }
};

const limpiarLogsAntiguos = () => {
  eraseFileIfExist('Tokens.txt');
  eraseFileIfExist('Errores.txt');
  eraseFileIfExist('TablaSimbolos.txt');
  eraseFileIfExist('Parse.txt');
};

const crearLogsNuevos = () => {
  fs.writeFileSync('Tokens.txt', '');
  fs.writeFileSync('Errores.txt', '');
  fs.writeFileSync('TablaSimbolos.txt', '');
  fs.writeFileSync('Parse.txt', '');
  fs.appendFileSync('Parse.txt', 'Ascendente ');
};

const escribirParse = resultado => {
  if (!isNaN(resultado)) {
    fs.appendFileSync('Parse.txt', resultado + ' ');
  } else if (resultado != 'Desplazado' && resultado != 'Finalizado') {
    fs.appendFileSync('Errores.txt', resultado);
  }
};

// --------------------------------------------------- Tokens ---------------------------------------------------
const getTokenCode = (token: Token): string => {
  return token.codigo;
};

const getTokenLexem = (token: Token): string => {
  return token.atributo.cadena ? token.atributo.cadena : '';
};

const writeTokenOnLog = (token: Token) => {
  var codigo = getTokenCode(token);
  var lexema = getTokenLexem(token);
  if (codigo != 'FINAL') {
    fs.appendFileSync('Tokens.txt', '<' + codigo + ',' + lexema + '>\n');
  }
};

const consolaToken = (token: Token) => {
  if (process.argv.includes('-t')) {
    console.log(chalk.bgGreen(token));
  }
};

export { consolaToken, crearLogsNuevos, escribirParse, limpiarLogsAntiguos, writeTokenOnLog };
