import * as fs from 'fs';
import chalk from 'chalk';

// Types
import { Token } from '../Types/Types';

// Constants
import { erroresSintactico } from '../Assets/Params';

export const errorHandlerSintax = (estado: number, token: Token) => {
  if (token.posicion) {
    const error: string =
      '[ERROR SINTÁCTICO](Línea: ' +
      token.posicion.linea +
      ', Columna: ' +
      token.posicion.columna +
      "): No se esperaba el token: " + 
      token.codigo +
      " ; "
      erroresSintactico[estado] +
      '\n';
    if (process.argv.includes('-sin')) {
      console.log(chalk.bgYellow(error));
    }
    fs.appendFileSync('outputs/Errores.txt', error);
  }
};
