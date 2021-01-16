// Librerías
import * as fs from 'fs';

// Tipos
import { Tipos, Token } from '../Types/Types';

// Params
import { erroresSemantico } from '../Assets/Params';

let pilaSemantico: Array<[string, string | Token]> = [['Z', 'axioma']];
let ex: [string, Token];
let declarando: Array<Token> = [];
let enFunción: boolean = false;
let iterations: number = 0;

// --------------------------------------------- Funciones públicas ---------------------------------------------

const evaluarReduccion = (regla: number, token: Token) => {
  switch (regla) {
    case 66:
      iterations = 2;
      while (iterations != 0) {
        ex = extraerPila();
        if (!evaluarTipo(ex[1], 'number')) {
        }
        iterations--;
      }
      break;
    case 67:
      ex = extraerPila();
      pilaSemantico.push(['V', ex[1]]);
      break;
    case 68:
      pilaSemantico.push(['W', token]);
      break;
    case 69:
      ex = extraerPila();
      pilaSemantico.push(['W', ex[1]]);
      break;
    case 70:
      pilaSemantico.push(['T', token]);
      break;
    case 71:
      pilaSemantico.push(['T', token]);
      break;
  }
};

// --------------------------------------------- Funciones privadas ---------------------------------------------

const extraerPila = (): [string, Token] => {
  const extracción = pilaSemantico.pop();
  if (extracción) {
    return extracción;
  }
  return ['?', 'Errror'];
};

const evaluarTipo = (token: Token, tipo: Tipos): boolean => {
  const lexema = token.atributo && token.atributo.cadena;
  switch (token.codigo) {
    case 'ID':
      // Buscar id en tablaLocal si toca
      // Buscar id en tablaGlobal
      // Evaluar si el tipo obtenido es el correcto
      return true;
    case 'RESERVADA':
      return lexema == ('true' || 'false') && tipo == 'boolean' ? true : false;
    case 'NUM':
      return tipo == 'number' ? true : false;
    case 'CADENA':
      return tipo == 'string' ? true : false;
    default:
      return false;
  }
};

const reportarError = (token: Token, regla: number): void => {
  const posicion: string = token.posicion
    ? '(Linea: ' + token.posicion.linea + ', Columna: ' + token.posicion.columna + ' ): '
    : '(Posición desconocida)';
  const error: string = '[ERROR SEMÁNTICO]' + posicion + erroresSemantico[regla];

  if (process.argv.includes('-sem')) {
    console.log(chalk.bgBlue(error));
  }
  fs.appendFileSync('outputs/Errores.txt', error);
};

export { evaluarReduccion };
