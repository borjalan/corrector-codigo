// Librerías
import * as fs from 'fs';
import chalk from 'chalk';

// Tipos
import { Tipos, Token } from '../Types/Types';

// Params
import { erroresSemantico } from '../Assets/Params';

let pilaSemantico: Map<string, Token | Tipos | undefined> = new Map();
let enFunción: boolean = false;
let enDo: boolean = false;

// --------------------------------------------- Funciones públicas ---------------------------------------------

const evaluarReduccion = (regla: number, token: Token): void => {
  if (token.codigo == 'RESERVADA' && token.atributo?.cadena == 'function') enFunción = true;
  if (token.codigo == 'RESERVADA' && token.atributo?.cadena == 'do') enDo = true;

  switch (regla) {
    case 0:
      // TODO: Escribir tablas
      break;
    case 1:
      // TODO: -----     -----     -----     -----     Nada (Revisar: Añadir algo tras sentencia)
      break;
    case 2:
      // TODO: -----     -----     -----     -----     Nada (Revisar: Añadir algo tras función)
      break;
    case 3:
      // TODO: -----     -----     -----     -----     Nada (Revisar: Final)
      break;
    case 4:
      // TODO: Añadir a tabla de símbolos general id
      break;
    case 5:
      // TODO: Comprobar tipo de S = boolean
      break;
    case 6:
      // TODO: Comprobar tipo de S = boolean
      break;
    case 7:
      // TODO: Añadir id a la tabla de símbolos general
      break;
    case 8:
      // TODO: -----     -----     -----     -----     Nada (Conector entre sentencias)
      break;
    case 9:
      // TODO: Guardar tipo de U' como tipo de B
      break;
    case 10:
      // TODO: Guardar tipo de U como tipo de de B
      break;
    case 11:
      // TODO: Guardar tipo de U como tipo de B
      break;
    case 12:
      // TODO: Buscar una función con el lexema de id que cumpla los params proporcionados en N
      break;
    case 13:
      // TODO: Comprobar tipo de U = cadena | número
      break;
    case 14:
      // TODO: Comprobar que el tipo del id = cadena | número
      break;
    case 15:
      // TODO: -----     -----     -----     -----     Nada (Conector entre sentencias)
      break;
    case 16:
      // TODO: -----     -----     -----     -----     Nada (Final sentencia interior bloque)
      break;
    case 17:
      // TODO: Añadir función a registro de funciones, tipo L, Parámetros P y comprobar que el return es del tipo correcto
      break;
    case 18:
      // TODO: Asignar tipo función igual a L. Si L es lamda entonces es tipo void sin return.
      break;
    case 19:
      // TODO: Asignar tipo de M a L
      break;
    case 20:
      // TODO: Asignar tipo string a M
      break;
    case 21:
      // TODO: Asignar tipo number a M
      break;
    case 22:
      // TODO: Asignar tipo boolean a M
      break;
    case 23:
      // TODO: Llamada a función sin parámetros
      break;
    case 24:
      // TODO: Añade id como parámetro inicial de llamada
      break;
    case 25:
      // TODO: Añade const_numérica como parámetro inicial de llamada
      break;
    case 26:
      // TODO: Añade cadena como parámetro inicial de llamada
      break;
    case 27:
      // TODO: Añade id como parámetro de llamada
      break;
    case 28:
      // TODO: Final de parámetros de llamada
      break;
    case 29:
      // TODO: Añade cte_num como parámetro de llamada
      break;
    case 30:
      // TODO: Añade cte_cad como parámetro de llamada
      break;
    case 31:
      // TODO: La función no tiene parámetros
      break;
    case 32:
      // TODO: Añade a la función un parámetro inicial de nombre id y tipo M
      break;
    case 33:
      // TODO: Añade a la función un parámetro de nombre id y tipo M
      break;
    case 34:
      // TODO: -----     -----     -----     -----     Nada (Final declaración parámetros de función)
      break;
    case 35:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es boolean)
      break;
    case 36:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de los ids es number)
      break;
    case 37:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es number)
      break;
    case 38:
      // TODO: Asignar tipo boolean a S (compara 2 cte_num)
      break;
    case 39:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es boolean)
      break;
    case 40:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es boolean)
      break;
    case 41:
      // TODO: Asignar tipo boolean a S (true)
      break;
    case 42:
      // TODO: Asignar tipo boolean a S (false)
      break;
    case 43:
      // TODO: Asignar tipo boolean a S' (Comprobar que el tipo de id es boolean)
      break;
    case 44:
      // TODO: Asignar tipo boolean a S' (Comprobar que ambos tipos de T son number)
      break;
    case 45:
      // TODO: Asignar tipo boolean a S' (true)
      break;
    case 46:
      // TODO: Asignar tipo boolean a S' (false)
      break;
    case 47:
      // TODO: Asignar tipo void a U'
      break;
    case 48:
      // TODO: Asignar tipo U a U'
      break;
    case 49:
      // TODO: Asignar tipo S' a U
      pilaSemantico.set('U', pilaSemantico.get("S'"));
      pilaSemantico.delete("S'");
      break;
    case 50:
      // TODO: Asignar tipo V a U
      pilaSemantico.set('U', pilaSemantico.get('V'));
      pilaSemantico.delete('V');
      break;
    case 51:
      // TODO: Asignar tipo number a V (Comprobar que W y V tienen tipo number)
      if (evaluarTipo(pilaSemantico.get('V'), 'number')) {
        if (evaluarTipo(pilaSemantico.get('W'), 'number')) {
          pilaSemantico.set('W', 'number');
          pilaSemantico.delete('V');
        } else {
          reportarError(pilaSemantico.get('W'), 51);
        }
      } else {
        reportarError(pilaSemantico.get('V'), 51);
      }
      break;
    case 52:
      // TODO: Asignar tipo W a V
      pilaSemantico.set('V', pilaSemantico.get('W'));
      pilaSemantico.delete('W');
      break;
    case 53:
      // TODO: Asignar tipo cadena a W
      pilaSemantico.set('W', token);
      break;
    case 54:
      // TODO: Asignar tipo T a W
      if (!pilaSemantico.has('T')) {
        pilaSemantico.set('W', pilaSemantico.get('T'));
        pilaSemantico.delete('T');
      } else {
        pilaSemantico.set('W', pilaSemantico.get('T'));
        pilaSemantico.delete('T2');
      }

      break;
    case 55:
      // TODO: Asignar tipo id a T
      if (!pilaSemantico.has('T')) {
        pilaSemantico.set('T', token);
      } else {
        pilaSemantico.set('T2', token);
      }
      break;
    case 56:
      // TODO: Asignar tipo number a T
      if (!pilaSemantico.has('T')) {
        pilaSemantico.set('T', token);
      } else {
        pilaSemantico.set('T2', token);
      }
      break;
  }
};

// --------------------------------------------- Funciones privadas ---------------------------------------------

function isToken(token: Tipos | Token | undefined): token is Token {
  return (<Token>token).codigo !== undefined;
}

const obtenerTipo = (token: Token): Tipos | undefined => {
  switch (token.codigo) {
    case 'NUM':
      return 'number';
    case 'CADENA':
      return 'string';
    case 'ID':
      //TODO: Buscar el tipo del id en la tabla de función si dentro y general
      return 'boolean'; //Relleno
    case 'RESERVADA':
      return token.atributo?.cadena == ('true' || 'false') ? 'boolean' : undefined;
    default:
      return undefined;
  }
};

const evaluarTipo = (token: Token | Tipos | undefined, tipo: Tipos): boolean => {
  if (!token) return false;
  if (token === tipo) return true;
  if (isToken(token)) {
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
  }
  return false;
};

const reportarError = (token: Token | Tipos | undefined, regla: number): void => {
  if (isToken(token)) {
    const posicion: string = token.posicion
      ? '(Linea: ' + token.posicion.linea + ', Columna: ' + token.posicion.columna + ' ): '
      : '(Posición desconocida)';
    const error: string = '[ERROR SEMÁNTICO]' + posicion + erroresSemantico[regla];

    if (process.argv.includes('-sem')) {
      console.log(chalk.bgBlue(error));
    }
    fs.appendFileSync('outputs/Errores.txt', error);
  } else {
    if (process.argv.includes('-sem')) {
      console.log(chalk.bgBlue('Error Semantico mal gestionado'));
    }
  }
};

export { evaluarReduccion };
