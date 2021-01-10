import { reglas, actionsGoto } from '../Assets/Params';
import { Action, Token } from '../types/types';

let pilaSintactico: Array<string | number> = ['$', 0];

// --------------------------------------------- Funciones públicas ---------------------------------------------

const parse = (token: Token): string | number => {
  const accion: string = actionsGoto[estadoActual][columnaAcciones];
  const columnaAcciones: number = obtenerColumnaAcciones(token);

  let estadoActual: number = parseInt(obtenerEstadoActual());

  if (esDesplazamiento(accion)) {
    const desplazamiento: number = valorNum(accion);
    pilaSintactico.push(columnaAcciones);
    pilaSintactico.push(desplazamiento);
    return 'Desplazado';
  } else if (esReducción(accion)) {
    const numRegla: number = valorNum(accion);
    const produccionesRegla: number = obtenerNumProducciones(accion);
    const columnaRegla: number = getColumnaRegla(numRegla);
    aplicarReduccion(produccionesRegla);
    estadoActual = obtenerEstadoActual();
    pilaSintactico.push(numRegla);
    pilaSintactico.push(parseInt(actionsGoto[estadoActual][columnaRegla]));
    return numRegla;
  } else if (esAceptar(accion)) {
    return 'Finalizado';
  } else {
    return generarError(token);
  }
};

// --------------------------------------------- Funciones privadas ---------------------------------------------

const getColumnaRegla = (numRegla: number): number => {
  const letraRegla: string = reglas[numRegla][0];
  switch (letraRegla) {
    case 'Z':
      return 26;
    case 'A':
      return 27;
    case 'B':
      return 28;
    case 'C':
      return 29;
    case 'D':
      return 30;
    case 'E':
      return 31;
    case 'F':
      return 32;
    case 'G':
      return 33;
    case 'H':
      return 34;
    case 'I':
      return 35;
    case 'J':
      return 36;
    case 'K':
      return 37;
    case 'L':
      return 38;
    case 'M':
      return 39;
    case 'N':
      return 40;
    case 'O':
      return 41;
    case 'P':
      return 42;
    case 'Q':
      return 43;
    case 'R':
      return 44;
    case 'S':
      return 45;
    case 'T':
      return 46;
    case 'U':
      return 47;
    case 'V':
      return 48;
    case 'W':
      return 49;
    default:
      return 0;
  }
};

const obtenerEstadoActual = () => {
  return pilaSintactico[pilaSintactico.length - 1];
};

const obtenerColumnaAcciones = (token: Token): number => {
  const codigo = token.codigo;
  const lexema = token.atributo.cadena;
  // TODO Añadir nuevas reservadas
  switch (true) {
    case codigo == 'RESERVADA' && lexema == 'var':
      return 0;
    case codigo == 'ID':
      return 1;
    case codigo == 'PTO_COMA':
      return 2;
    case codigo == 'RESERVADA' && lexema == 'do':
      return 3;
    case codigo == 'APT_BLOCK':
      return 4;
    case codigo == 'CIE_BLOCK':
      return 5;
    case codigo == 'RESERVADA' && lexema == 'while':
      return 6;
    case codigo == 'APT_PAREN':
      return 7;
    case codigo == 'CIE_PAREN':
      return 8;
    case codigo == 'RESERVADA' && lexema == 'if':
      return 9;
    case codigo == 'RESERVADA' && lexema == 'return':
      return 10;
    case codigo == 'OP_ASIG':
      return 11;
    case codigo == 'OP_ASIGCRES':
      return 12;
    case codigo == 'RESERVADA' && lexema == 'print':
      return 13;
    case codigo == 'RESERVADA' && lexema == 'input':
      return 14;
    case codigo == 'RESERVADA' && lexema == 'function':
      return 15;
    case codigo == 'RESERVADA' && lexema == 'string':
      return 16;
    case codigo == 'RESERVADA' && lexema == 'int':
      return 17;
    case codigo == 'RESERVADA' && lexema == 'bool':
      return 18;
    case codigo == 'COMA':
      return 19;
    case codigo == 'OP_NEG':
      return 20;
    case codigo == 'OP_MAY':
      return 21;
    case codigo == 'NUM':
      return 22;
    case codigo == 'OP_SUM':
      return 23;
    case codigo == 'CADENA':
      return 24;
    case codigo == 'FINAL':
      return 25;
    default:
      return 25;
  }
};

const esDesplazamiento = (action: Action): boolean => {
  if (!action) return false;
  return action.split('')[0] == 's';
};

const esReducción = (action: Action): boolean => {
  if (!action) return false;
  return action.split('')[0] == 'r';
};

const esAceptar = (action: Action): boolean => {
  if (!action) return false;
  return action == 'acc';
};

const valorNum = (action: Action): number => {
  return parseInt(action.substr(1, action.length - 1));
};

const obtenerNumProducciones = (action: Action): number => {
  const numeroRegla: number = valorNum(action);
  const producciones: Array<string> = reglas[numeroRegla][1].split(' ');

  let numProducciones: number = producciones.length;
  
  if (producciones.includes('λ')) {
    numProducciones--;
  }
  return numProducciones;
};

const aplicarReduccion = (extracciones: number): void => {
  let counter: number = extracciones * 2;
  while (counter != 0) {
    pilaSintactico.pop();
    counter--;
  }
};

export { parse };
