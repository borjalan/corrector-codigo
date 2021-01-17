import * as Lexico from './Lexico/Lexico';
import * as Sintactico from './Sintactico/Sintactico';

// Typos
import { Token } from './Types/Types';

// Helpers
import {
  limpiarLogsAntiguos,
  crearLogsNuevos,
  consolaToken,
  writeTokenOnLog,
  escribirParse,
} from './Helpers/Helpers';

/*----------------------------------------------------------------------------------------------------
                                                Main
  ----------------------------------------------------------------------------------------------------*/

const main = (path: string, flags: boolean[]): void => {
  limpiarLogsAntiguos();
  crearLogsNuevos();

  // Iniciar Lexico
  Lexico.setFichero(path);
  let token: Token = Lexico.getToken();
  let resultadoSintax: string = 'Initial';
  consolaToken(token);
  writeTokenOnLog(token);

  while (resultadoSintax != 'Finalizado' && resultadoSintax != 'Error') {
    resultadoSintax = Sintactico.parse(token);
    switch (resultadoSintax) {
      case 'Desplazado':
        token = Lexico.getToken();
        consolaToken(token);
        writeTokenOnLog(token);
        break;
      case 'Finalizado':
        escribirParse('1');
        // Semantico.accionesSemántico(0, token);
        break;
      case 'Error':
        break;
      default:
        escribirParse(resultadoSintax);
        // if (!isNaN(resultadoSintax)) {
        //   Semantico.accionesSemántico(resultadoSintax, token);
        // }
        break;
    }
  }
};

export default main;
