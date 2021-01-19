// Librerías
import * as fs from 'fs';
import chalk from 'chalk';

// Tipos
import { Tipos, Token } from '../Types/Types';

// Params
import { erroresSemantico } from '../Assets/Params';

let pilaSemantico: Array<[string, Tipos | Token]>;
let ex: [string, Token];
let declarando: Array<Token> = [];
let enFunción: boolean = false;
let iterations: number = 0;

// --------------------------------------------- Funciones públicas ---------------------------------------------

const evaluarReduccion = (regla: number, token: Token): void => {
  switch (regla) {
    case 0:
    // TODO: Escribir tablas
    case 1:
    // TODO: -----     -----     -----     -----     Nada (Revisar: Añadir algo tras sentencia)
    case 2:
    // TODO: -----     -----     -----     -----     Nada (Revisar: Añadir algo tras función)
    case 3:
    // TODO: -----     -----     -----     -----     Nada (Revisar: Final)
    case 4:
    // TODO: Añadir a tabla de símbolos general id
    case 5:
    // TODO: Comprobar tipo de S = boolean
    case 6:
    // TODO: Comprobar tipo de S = boolean
    case 7:
    // TODO: Añadir id a la tabla de símbolos general
    case 8:
    // TODO: -----     -----     -----     -----     Nada (Conector entre sentencias)
    case 9:
    // TODO: Guardar tipo de U' como tipo de B
    case 10:
    // TODO: Guardar tipo de U como tipo de de B
    case 11:
    // TODO: Guardar tipo de U como tipo de B
    case 12:
    // TODO: Buscar una función con el lexema de id que cumpla los params proporcionados en N
    case 13:
    // TODO: Comprobar tipo de U = cadena | número
    case 14:
    // TODO: Comprobar que el tipo del id = cadena | número
    case 15:
    // TODO: -----     -----     -----     -----     Nada (Conector entre sentencias)
    case 16:
    // TODO: -----     -----     -----     -----     Nada (Final sentencia interior bloque)
    case 17:
    // TODO: Añadir función a registro de funciones, tipo L, Parámetros P y comprobar que el return es del tipo correcto
    case 18:
    // TODO: Asignar tipo función igual a L. Si L es lamda entonces es tipo void sin return.
    case 19:
    // TODO: Asignar tipo de M a L
    case 20:
    // TODO: Asignar tipo string a M
    case 21:
    // TODO: Asignar tipo number a M
    case 22:
    // TODO: Asignar tipo boolean a M
    case 23:
    // TODO: Llamada a función sin parámetros
    case 24:
    // TODO: Añade id como parámetro inicial de llamada
    case 25:
    // TODO: Añade const_numérica como parámetro inicial de llamada
    case 26:
    // TODO: Añade cadena como parámetro inicial de llamada
    case 27:
    // TODO: Añade id como parámetro de llamada
    case 28:
    // TODO: Final de parámetros de llamada
    case 29:
    // TODO: Añade cte_num como parámetro de llamada
    case 30:
    // TODO: Añade cte_cad como parámetro de llamada
    case 31:
    // TODO: La función no tiene parámetros
    case 32:
    // TODO: Añade a la función un parámetro inicial de nombre id y tipo M
    case 33:
    // TODO: Añade a la función un parámetro de nombre id y tipo M
    case 34:
    // TODO: -----     -----     -----     -----     Nada (Final declaración parámetros de función)
    case 35:
    // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es boolean)
    case 36:
    // TODO: Asignar tipo boolean a S (Comprobar que el tipo de los ids es number)
    case 37:
    // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es number)
    case 38:
    // TODO: Asignar tipo boolean a S (compara 2 cte_num)
    case 39:
    // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es boolean)
    case 40:
    // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es boolean)
    case 41:
    // TODO: Asignar tipo boolean a S (true)
    case 42:
    // TODO: Asignar tipo boolean a S (false)
    case 43:
    // TODO: Asignar tipo boolean a S' (Comprobar que el tipo de id es boolean)
    case 44:
    // TODO: Asignar tipo boolean a S' (Comprobar que ambos tipos de T son number)
    case 45:
    // TODO: Asignar tipo boolean a S' (true)
    case 46:
    // TODO: Asignar tipo boolean a S' (false)
    case 47:
    // TODO: Asignar tipo void a U'
    case 48:
    // TODO: Asignar tipo U a U'
    case 49:
    // TODO: Asignar tipo S' a U
    case 50:
    // TODO: Asignar tipo V a U
    case 51:
    // TODO: Asignar tipo number a V (Comprobar que W y V tienen tipo number)
    case 52:
    // TODO: Asignar tipo W a V
    case 53:
    // TODO: Asignar tipo cadena a W
    case 54:
    // TODO: Asignar tipo T a W
    case 55:
    // TODO: Asignar tipo id a T
    case 56:
    // TODO: Asignar tipo number a T
  }
};

// --------------------------------------------- Funciones privadas ---------------------------------------------

const extraerPila = (): [string, Tipos | Token] => {
  const extracción = pilaSemantico.pop();
  if (extracción) {
    return extracción;
  }
  return ['?', 'void'];
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
