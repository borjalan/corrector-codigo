// Librerías
import * as fs from 'fs';
import * as chalk from 'chalk';

// Tipos
import { Token } from '../types/Token';

// Constantes
import * as Params from '../Assets/Params';

// Variables
let pila: string = '';
let fichero: string = '';
let caracter: string = '';
let reservadas: string[] = Params.reservadas;

let punteroChar: number = 0;
let estado: number = 0;
let linea: number = 0;
let columna: number = 0;

let antiIgnore: boolean = false;

let caracteres: Array<[string, number, number]> = [];

// --------------------------------------------- Funciones públicas ---------------------------------------------

const setFichero = (path: string): void => {
  fichero = path;
};

const getToken = (): Token => {
  if (caracteres.length == 0) {
    caracteres = obtenerCaracteres(fs.readFileSync(fichero, 'utf8'));
  }

  if (caracteres[punteroChar][0] == undefined) {
    return {
      codigo: 'FINAL',
      atributo: { cadena: 'FINAL' },
      posicion: { linea: caracteres[punteroChar - 1][1], caracter: caracteres[punteroChar - 1][2] },
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
  const final: Token | undefined = checkfinal();
  if (final) return final;

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
      if (caracter == '\n' || caracter == '\t' || caracter == '\r' || caracter == ' ') {
        changeState(0);
        // return "<λ|del*|" + linea + "|" + columna + ">";
        break;
      } else if (caracter == '+') {
        changeState(0);
        return '<OP_SUM|+|' + linea + '|' + columna + '>';
      } else if (caracter == '!') {
        changeState(0);
        return '<OP_NEG|!|' + linea + '|' + columna + '>';
      } else if (caracter == ')') {
        changeState(0);
        return '<CIE_PAREN|)|' + linea + '|' + columna + '>';
      } else if (caracter == '(') {
        changeState(0);
        return '<APT_PAREN|(|' + linea + '|' + columna + '>';
      } else if (caracter == '{') {
        changeState(0);
        return '<APT_BLOCK|{|' + linea + '|' + columna + '>';
      } else if (caracter == '}') {
        changeState(0);
        return '<CIE_BLOCK|}|' + linea + '|' + columna + '>';
      } else if (caracter == ',') {
        changeState(0);
        return '<COMA|,|' + linea + '|' + columna + '>';
      } else if (caracter == ';') {
        changeState(0);
        return '<PTO_COMA|;|' + linea + '|' + columna + '>';
      } else if (caracter == '>') {
        changeState(0);
        return '<OP_MAY|>|' + linea + '|' + columna + '>';
      } else if (caracter == '=') {
        changeState(0);
        return '<OP_ASIG|=|' + linea + '|' + columna + '>';
      } else if (caracter == '/') {
        changeState(1);
      } else if (caracter == "'") {
        changeState(4);
      } else if (/[a-zA-Z]/.test(caracter)) {
        pila = caracter;
        changeState(16);
      } else if (caracter == '%') {
        changeState(19);
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
            "' no está reconocido por el procesador Léxico.\n",
          err => {
            if (err) throw err;
          }
        );
      }
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
            " el caracter '/' no debe estar solo.\n",
          err => {
            if (err) throw err;
          }
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
        return '<CADENA|' + cadena + '|' + linea + '|' + (columna - cadena.length) + '>';
      } else if (caracter == '\n' || caracter == '\r' || caracter == '\t') {
        changeState(0);
        fs.appendFileSync(
          'Errores.txt',
          '[ERROR LÉXICO](Linea: ' +
            linea +
            ', Columna: ' +
            columna +
            ' ):  No se puede introducir un salto de linea dentro de una cadena.\n',
          err => {
            if (err) throw err;
          }
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
        var palabra = pila;
        changeState(0);
        antiIgnore = true;
        if (reservadas.includes(palabra)) {
          return '<RESERVADA|' + palabra + '|' + linea + '|' + (columna - palabra.length) + '>';
        } else {
          return '<ID|' + palabra + '|' + linea + '|' + (columna - palabra.length) + '>';
        }
      }
      break;
    case 19:
      if (caracter == '=') {
        changeState(0);
        return '<OP_ASIGCRES|%=|' + linea + '|' + columna + '>';
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
            "' no se esperaba después de un '%'," +
            " se esperaba '=' para realizar una asignación restrictiva.\n",
          err => {
            if (err) throw err;
          }
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
        return '<NUM|' + num + '|' + linea + '|' + (columna - num.length) + '>';
      }
      break;
  }

  return logicaAutomata();
};

const changeState = (newState: number): void => {
  estado = newState;
  punteroChar++;
  if (newState == 0) pila = caracteres[punteroChar][0];
};

const checkfinal = (): Token => {
  let resultado: Token = { codigo: 'FINAL', atributo:{cadena: 'FINAL'} };
  if (caracteres.length - 1 <= punteroChar) {
    if (estado == 1) {
      fs.appendFileSync(
        'Errores.txt',
        '[ERROR LÉXICO](Linea: ' +
          linea +
          ', Columna: ' +
          columna +
          " ): El caracter '/' no debe estar solo.\n"
      );
    } else if (estado == 2 || estado == 3) {
      fs.appendFileSync(
        'Errores.txt',
        '[ERROR LÉXICO](Linea: ' +
          linea +
          ', Columna: ' +
          columna +
          ' ): Se esperaba que se cerrase el comentario.\n'
      );
      resultado = '<FINAL|FINAL>';
    } else if (estado == 4) {
      fs.appendFileSync(
        'Errores.txt',
        '[ERROR LÉXICO](Linea: ' +
          linea +
          ', Columna: ' +
          columna +
          ' ): Se esperaba que se cerrase la cadena.\n'
      );
      resultado = '<FINAL|FINAL>';
    } else if (estado == 16) {
      resultado = '<ID|' + pila + '|' + linea + '|' + (columna - pila.length) + '>';
    } else if (estado == 19) {
      fs.appendFileSync(
        'Errores.txt',
        '[ERROR LÉXICO](Linea: ' +
          linea +
          ', Columna: ' +
          columna +
          " ): El caracter '%' no debe estar solo.\n"
      );
      resultado = '<FINAL|FINAL>';
    } else if (estado == 21) {
      resultado = '<NUM|' + pila + '|' + linea + '|' + (columna - pila.length) + '>';
    } else {
      resultado = '<FINAL|FINAL>';
    }
    estado = 0;
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
