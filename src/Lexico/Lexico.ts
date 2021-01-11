// Librerías
import * as fs from 'fs';
import * as chalk from 'chalk';

// Tipos
import { Token } from '../types/types';

// Constantes
import { reservadas } from '../Assets/Params';

// Variables
let pila: string = '';
let caracter: string = '';

let punteroChar: number = 0;
let estado: number = 0;
let linea: number = 0;
let columna: number = 0;

let antiIgnore: boolean = false;

let auxTok: Token | undefined;
let caracteres: Array<[string, number, number]> = [];

// --------------------------------------------- Funciones públicas ---------------------------------------------

const setFichero = (path: string): void => {
  caracteres = obtenerCaracteres(fs.readFileSync(path, 'utf8'));
};

const getToken = (): Token => {
  if (!caracteres[punteroChar]) {
    return {
      codigo: 'FINAL',
      atributo: { cadena: 'FINAL' },
      posicion: { linea: caracteres[punteroChar - 1][1], columna: caracteres[punteroChar - 1][2] },
    };
  }

  return logicaAutomata();
};

const printCaracteres = (): void => {
  printBG('------------------Caracteres------------------');
  caracteres.forEach(([caracter, linea, columna]) => {
    if (caracter == '\r') {
      printG('[Línea: ' + linea + ', Columna: ' + columna + '] -> [' + '\\r' + ']');
    } else if (caracter == '\n') {
      printG('[Línea: ' + linea + ', Columna: ' + columna + '] -> [' + '\\n' + ']');
    } else {
      printG('[Línea: ' + linea + ', Columna: ' + columna + '] -> [' + caracter + ']');
    }
  });
  printBG('----------------------------------------------');
};

// --------------------------------------------- Funciones privadas ---------------------------------------------

const obtenerCaracteres = (texto: string): Array<[string, number, number]> => {
  let filas: string[] = texto.split('\n');
  let fila: number = 1;
  let columna: number = 1;
  let caracteresTemp: Array<[string, number, number]> = [];

  // Añadimos salto de línea al final de cada linea
  filas.forEach((linea: string) => {
    (linea + '\n').split('').forEach((char: string) => {
      caracteresTemp.push([char, fila, columna]);
      columna++;
    });
    columna = 1;
    fila++;
  });

  return caracteresTemp;
};

const logicaAutomata = (): Token => {
  auxTok = checkfinal();
  if (auxTok) return auxTok;

  caracter = caracteres[punteroChar][0];
  linea = caracteres[punteroChar][1];
  columna = caracteres[punteroChar][2];

  if (antiIgnore) {
    punteroChar--;
    caracter = caracteres[punteroChar][0];
    antiIgnore = false;
  }

  switch (estado) {
    case 0:
      auxTok = baseCaseCheck();
      if (auxTok) return auxTok;
      break;
    case 1:
      if (caracter == '*') {
        changeState(2);
      } else {
        changeState(0);
        antiIgnore = true;
        fs.appendFileSync(
          'Errores.txt',
          '[ERROR LÉXICO](Linea: ' +
            linea +
            ', Columna: ' +
            columna +
            " ): El caracter '" +
            caracter +
            "' no se esperaba después de un '/'," +
            " se esperaba '*' para comenzar un comentario," +
            " el caracter '/' no debe estar solo.\n"
        );
      }
      break;
    case 2:
      if (caracter == '*') {
        changeState(3);
      } else {
        changeState(2);
      }
      break;
    case 3:
      if (caracter == '/') {
        changeState(0);
      } else if (caracter == '*') {
        changeState(3);
      } else {
        changeState(2);
      }
      break;
    case 4:
      if (caracter == "'") {
        var cadena = pila + caracter;
        changeState(0);
        return {
          codigo: 'CADENA',
          atributo: { cadena: cadena },
          posicion: { linea: linea, columna: columna - cadena.length },
        };
      } else if (caracter == '\n' || caracter == '\r' || caracter == '\t') {
        changeState(0);
        fs.appendFileSync(
          'Errores.txt',
          '[ERROR LÉXICO](Linea: ' +
            linea +
            ', Columna: ' +
            columna +
            ' ):  No se puede introducir un salto de linea dentro de una cadena.\n'
        );
      } else {
        pila = pila + caracter;
        changeState(4);
      }
      break;
    case 16:
      if (/[a-zA-Z]/.test(caracter) || /[0-9]/.test(caracter) || caracter == '_') {
        pila = pila + caracter;
        changeState(16);
      } else {
        changeState(0);
        antiIgnore = true;
        if (reservadas.includes(pila)) {
          return {
            codigo: 'RESERVADA',
            atributo: { cadena: pila },
            posicion: { linea: linea, columna: columna - pila.length },
          };
        } else {
          return {
            codigo: 'ID',
            atributo: { nombre: pila, numero: 0 },
            posicion: { linea: linea, columna: columna - pila.length },
          };
        }
      }
      break;
    case 19:
      if (caracter == '=') {
        changeState(0);
        return {
          codigo: 'OP_ASIGCRES',
          atributo: { cadena: '%=' },
          posicion: { linea: linea, columna: columna },
        };
      } else {
        changeState(0);
        antiIgnore = true;
        fs.appendFileSync(
          'Errores.txt',
          '[ERROR LÉXICO](Linea: ' +
            linea +
            ', Columna: ' +
            columna +
            " ): El caracter '" +
            caracter +
            "El caracter '%' debe ir seguido de '=', operador no reconocido.\n"
        );
      }
      break;
    case 21:
      if (/[0-9]/.test(caracter)) {
        pila = pila + caracter;
        changeState(21);
      } else {
        var num = pila;
        changeState(0);
        antiIgnore = true;
        return {
          codigo: 'NUM',
          atributo: { cadena: num },
          posicion: { linea: linea, columna: columna - num.length },
        };
      }
      break;
  }

  return logicaAutomata();
};

const baseCaseCheck = (): Token | undefined => {
  switch (caracter) {
    case '\n' || '\t' || '\r' || ' ':
      changeState(0);
      break;
    case '+':
      changeState(0);
      return {
        codigo: 'OP_SUM',
        atributo: { cadena: '+' },
        posicion: { linea: linea, columna: columna },
      };
    case '!':
      changeState(0);
      return {
        codigo: 'OP_NEG',
        atributo: { cadena: '!' },
        posicion: { linea: linea, columna: columna },
      };
    case '(':
      changeState(0);
      return {
        codigo: 'APT_PAREN',
        atributo: { cadena: '(' },
        posicion: { linea: linea, columna: columna },
      };
    case ')':
      changeState(0);
      return {
        codigo: 'CIE_PAREN',
        atributo: { cadena: ')' },
        posicion: { linea: linea, columna: columna },
      };
    case '{':
      changeState(0);
      return {
        codigo: 'APT_BLOCK',
        atributo: { cadena: '{' },
        posicion: { linea: linea, columna: columna },
      };
    case '}':
      changeState(0);
      return {
        codigo: 'CIE_BLOCK',
        atributo: { cadena: '}' },
        posicion: { linea: linea, columna: columna },
      };
    case ',':
      changeState(0);
      return {
        codigo: 'COMA',
        atributo: { cadena: ',' },
        posicion: { linea: linea, columna: columna },
      };
    case ';':
      changeState(0);
      return {
        codigo: 'PTO_COMA',
        atributo: { cadena: ';' },
        posicion: { linea: linea, columna: columna },
      };
    case '>':
      changeState(0);
      return {
        codigo: 'OP_MAY',
        atributo: { cadena: '>' },
        posicion: { linea: linea, columna: columna },
      };
    case '=':
      changeState(0);
      return {
        codigo: 'OP_ASIG',
        atributo: { cadena: '=' },
        posicion: { linea: linea, columna: columna },
      };
    case '/':
      changeState(1);
      break;
    case "'":
      changeState(4);
      break;
    case '%':
      changeState(19);
      break;
    default: {
      if (/[a-zA-Z]/.test(caracter)) {
        pila = caracter;
        changeState(16);
      } else if (/[0-9]/.test(caracter)) {
        pila = caracter;
        changeState(21);
      } else {
        changeState(0);
        punteroChar++;
        antiIgnore = true;
        fs.appendFileSync(
          'Errores.txt',
          '[ERROR LÉXICO](Linea: ' +
            linea +
            ', Columna: ' +
            columna +
            " ): El caracter '" +
            caracter +
            "' no está reconocido por el procesador Léxico.\n"
        );
      }
    }
  }
};

const changeState = (newState: number): void => {
  estado = newState;
  punteroChar++;
  if (newState == 0) pila = caracteres[punteroChar][0];
};

const checkfinal = (): Token | undefined => {
  let resultado: Token = { codigo: 'FINAL', atributo: { cadena: 'FINAL' } };
  if (punteroChar >= caracteres.length - 1) {
    switch (estado) {
      case 1 | 2 | 3:
        fs.appendFileSync(
          'Errores.txt',
          '[ERROR LÉXICO](Linea: ' +
            linea +
            ', Columna: ' +
            columna +
            ' ): Se esperaba que se cerrase el comentario.\n'
        );
        break;
      case 4:
        fs.appendFileSync(
          'Errores.txt',
          '[ERROR LÉXICO](Linea: ' +
            linea +
            ', Columna: ' +
            columna +
            ' ): Se esperaba que se cerrase la cadena.\n'
        );
        break;
      case 16:
        resultado = {
          codigo: 'ID',
          atributo: { nombre: pila, numero: 0 },
          posicion: { linea: linea, columna: columna - pila.length },
        };
        break;
      case 19:
        fs.appendFileSync(
          'Errores.txt',
          '[ERROR LÉXICO](Linea: ' +
            linea +
            ', Columna: ' +
            columna +
            " ): El caracter '%' debe ir seguido de '=', operador no reconocido.\n"
        );
        break;
      case 21:
        resultado = {
          codigo: 'NUM',
          atributo: { nombre: pila, numero: 0 },
          posicion: { linea: linea, columna: columna - pila.length },
        };
        break;
    }
    changeState(0);
    return resultado;
  }
};

const printBG = (texto: string): void => {
  console.log(chalk.bgGreen(texto));
};

const printG = (texto: string): void => {
  console.log(chalk.green(texto));
};

export { getToken, setFichero, printCaracteres };
