// Librerías
import * as fs from 'fs';
import chalk from 'chalk';

// Tipos
import { TiposFuncion, Token } from '../Types/Types';

// Params
import { erroresSemantico } from '../Assets/Params';
import { report } from 'process';

let pilaSemantico: Map<string, Token | TiposFuncion | undefined> = new Map();
let enFunción: boolean = false;
let enDo: boolean = false;
let ultimoId: Token;
let anteUltimoId: Token;
let parametrosLlamada: Array<Token>;

// --------------------------------------------- Funciones públicas ---------------------------------------------

const setContext = (token: Token): void => {
  if (token.codigo === 'RESERVADA' && token.atributo && token.atributo.cadena === 'function') {
    enFunción = true;
  }
  if (token.codigo === 'RESERVADA' && token.atributo && token.atributo.cadena === 'do') {
    enDo = true;
  }
  if (token.codigo === 'ID') {
    guardarId(token);
  }
};

const evaluarReduccion = (regla: number, token: Token): void => {
  switch (regla) {
    case 0:
      // TODOTABLA: Escribir tablas
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
      // TODOTABLA: Añadir id tipo M a la tabla de símbolos que corresponda
      break;
    case 5:
      // TODO: Comprobar tipo de S = boolean
      if (!evaluarTipo(pilaSemantico.get('S'), 'boolean')) reportarError(token, regla);
      pilaSemantico.delete('S');
      break;
    case 6:
      // TODO: Comprobar tipo de S = boolean
      if (!evaluarTipo(pilaSemantico.get('S'), 'boolean')) reportarError(token, regla);
      pilaSemantico.delete('S');
      break;
    case 7:
      // TODOTABLA: Añadir id tipo M a la tabla de símbolos que corresponda
      break;
    case 8:
      // TODO: -----     -----     -----     -----     Nada (Conector entre sentencias)
      break;
    case 9:
      // TODOTABLA: Comprobar que el return de la función en la que estamos es del tipo U'
      break;
    case 10:
      // TODO: -----     -----     -----     -----     Nada (No necesario)
      break;
    case 11:
      // TODO: -----     -----     -----     -----     Nada (No necesario)
      break;
    case 12:
      // TODOTABLA: Buscar una función con el lexema de id que cumpla los params proporcionados en N
      // if ( not ) reportarError(token; , regla)
      break;
    case 13:
      // TODO: Comprobar tipo de U = cadena | número
      if (
        !evaluarTipo(pilaSemantico.get('U'), 'number') &&
        !evaluarTipo(pilaSemantico.get('U'), 'string')
      )
        reportarError(ultimoId, regla);
      pilaSemantico.delete('U');
      break;
    case 14:
      // TODO: Comprobar que el tipo del id = cadena | número
      if (!evaluarTipo(ultimoId, 'number') && !evaluarTipo(ultimoId, 'string'))
        reportarError(ultimoId, regla);
      break;
    case 15:
      // TODO: -----     -----     -----     -----     Nada (Conector entre sentencias)
      break;
    case 16:
      // TODO: -----     -----     -----     -----     Nada (Final sentencia interior bloque)
      break;
    case 17:
      // TODOTABLA: Añadir función a registro de funciones, tipo L, Parámetros P y comprobar que el return es del tipo correcto
      enFunción = false;
      break;
    case 18:
      // TODOTABLA: Asignar tipo función igual a L. Si L es lamda entonces es tipo void sin return.
      break;
    case 19:
      // TODO: Asignar tipo de M a L
      pilaSemantico.set('L', pilaSemantico.get('M'));
      pilaSemantico.delete('M');
      break;
    case 20:
      // TODO: Asignar tipo string a M
      pilaSemantico.set('M', 'string');
      break;
    case 21:
      // TODO: Asignar tipo number a M
      pilaSemantico.set('M', 'number');
      break;
    case 22:
      // TODO: Asignar tipo boolean a M
      pilaSemantico.set('M', 'boolean');
      break;
    case 23:
      // TODO: Llamada a función sin parámetros
      parametrosLlamada = [];
      break;
    case 24:
      // TODO: Añade id como parámetro inicial de llamada
      parametrosLlamada = [];
      parametrosLlamada.push(token);
      break;
    case 25:
      // TODO: Añade const_numérica como parámetro inicial de llamada
      parametrosLlamada = [];
      parametrosLlamada.push(token);
      break;
    case 26:
      // TODO: Añade cadena como parámetro inicial de llamada
      parametrosLlamada = [];
      parametrosLlamada.push(token);
      break;
    case 27:
      // TODO: Añade id como parámetro de llamada
      parametrosLlamada.push(token);
      break;
    case 28:
      // TODO: -----     -----     -----     -----     Nada (Final de parámetros de llamada)
      break;
    case 29:
      // TODO: Añade cte_num como parámetro de llamada
      parametrosLlamada.push(token);
      break;
    case 30:
      // TODO: Añade cte_cad como parámetro de llamada
      parametrosLlamada.push(token);
      break;
    case 31:
      // TODO: -----     -----     -----     -----     Nada (La función no tiene parámetros)
      break;
    case 32:
      // TODOTABLA: Añade a la función un parámetro inicial de nombre id y tipo M
      break;
    case 33:
      // TODOTABLA: Añade a la función un parámetro de nombre id y tipo M
      break;
    case 34:
      // TODO: -----     -----     -----     -----     Nada (Final declaración parámetros de función)
      break;
    case 35:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es boolean)
      if (!evaluarTipo(token, 'boolean')) reportarError(token, regla);
      pilaSemantico.set('S', 'boolean');
      break;
    case 36:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de los ids es number)
      if (!evaluarTipo(ultimoId, 'number')) reportarError(ultimoId, regla);
      if (!evaluarTipo(anteUltimoId, 'number')) reportarError(anteUltimoId, regla);
      pilaSemantico.set('S', 'boolean');
      break;
    case 37:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es number)
      if (!evaluarTipo(ultimoId, 'number')) reportarError(ultimoId, regla);
      pilaSemantico.set('S', 'boolean');
      break;
    case 38:
      // TODO: Asignar tipo boolean a S (compara 2 cte_num)
      pilaSemantico.set('S', 'boolean');
      break;
    case 39:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es boolean)
      if (!evaluarTipo(token, 'boolean')) reportarError(token, regla); //TODO debe ser entero no boolean
      pilaSemantico.set('S', 'boolean');
      break;
    case 40:
      // TODO: Asignar tipo boolean a S (Comprobar que el tipo de id es boolean)
      if (!evaluarTipo(token, 'boolean')) reportarError(token, regla);
      pilaSemantico.set('S', 'boolean');
      break;
    case 41:
      // TODO: Asignar tipo boolean a S (true)
      pilaSemantico.set('S', 'boolean');
      break;
    case 42:
      // TODO: Asignar tipo boolean a S (false)
      pilaSemantico.set('S', 'boolean');
      break;
    case 43:
      // TODO: Asignar tipo boolean a S' (Comprobar que el tipo de id es boolean)
      if (!evaluarTipo(token, 'boolean')) reportarError(token, regla);
      pilaSemantico.set("S'", 'boolean');
      break;
    case 44:
      // TODO: Asignar tipo boolean a S' (Comprobar que ambos tipos de T son number)
      if (!evaluarTipo(pilaSemantico.get('T'), 'number')) {
        reportarError(pilaSemantico.get('T'), regla);
      } else if (!evaluarTipo(pilaSemantico.get('T2'), 'number')) {
        reportarError(pilaSemantico.get('T2'), regla);
      }
      pilaSemantico.delete('T');
      pilaSemantico.delete('T2');
      pilaSemantico.set("S'", 'boolean');
      break;
    case 45:
      // TODO: Asignar tipo boolean a S' (true)
      pilaSemantico.set("S'", 'boolean');
      break;
    case 46:
      // TODO: Asignar tipo boolean a S' (false)
      pilaSemantico.set("S'", 'boolean');
      break;
    case 47:
      // TODO: Asignar tipo void a U'
      pilaSemantico.set("U'", 'void');
      break;
    case 48:
      // TODO: Asignar tipo U a U'
      pilaSemantico.set('U', pilaSemantico.get("U'"));
      pilaSemantico.delete('U');
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
          reportarError(pilaSemantico.get('W'), regla);
        }
      } else {
        reportarError(pilaSemantico.get('V'), regla);
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

function isToken(token: TiposFuncion | Token | undefined): token is Token {
  return (<Token>token).codigo !== undefined;
}

const obtenerTipo = (token: Token): TiposFuncion | undefined => {
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

const evaluarTipo = (token: Token | TiposFuncion | undefined, tipo: TiposFuncion): boolean => {
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

const reportarError = (token: Token | TiposFuncion | undefined, regla: number): void => {
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

const guardarId = (token: Token): void => {
  anteUltimoId = ultimoId;
  ultimoId = token;
};

export { evaluarReduccion, setContext };
