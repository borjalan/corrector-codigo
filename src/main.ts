import {
  limpiarLogsAntiguos,
  crearLogsNuevos,
  consolaToken,
  writeTokenOnLog,
  escribirParse,
} from './helpers/helpers';
import * as Lexico from './Lexico/Lexico';
import * as Sintactico from './Sintactico/Sintactico';
import { Token } from './types/types';

/*----------------------------------------------------------------------------------------------------
                                                Main
  ----------------------------------------------------------------------------------------------------*/

const main = (path: string, flags: boolean[]): void => {
  limpiarLogsAntiguos();
  crearLogsNuevos();

  // Iniciar Lexico
  Lexico.setFichero(path);
  let token: Token = Lexico.getToken();
  let resultadoSintax: string | number = 'Initial';
  consolaToken(token);
  writeTokenOnLog(token);

  while (resultadoSintax != 'Finalizado' || !stop) {
    resultadoSintax = Sintactico.parse(token);
    switch (resultadoSintax) {
      case 'Desplazado':
        token = Lexico.getToken();
        consolaToken(token);
        writeTokenOnLog(token);
        break;
      case 'Finalizado':
        escribirParse(0);
        // Semantico.accionesSemántico(0, token);
        break;
      default:
        // escribirParse(resultadoSintax);
        // if (!isNaN(resultadoSintax)) {
        //   Semantico.accionesSemántico(resultadoSintax, token);
        // }
        break;
    }
  }
};

export default main;
