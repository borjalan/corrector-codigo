import * as chalk from 'chalk';
import * as fs from 'fs';
import main from './main';

const flags: boolean[] = [
  process.argv.includes('-lex'),
  process.argv.includes('-sin'),
  process.argv.includes('-sem'),
  process.argv.includes('-err'),
];

try {
  const file = process.argv[2];
  if (fs.existsSync(file)) {
    main(file, flags);
  } else {
    throw { message: 'El archivo pasado como parámetro no existe: ' + file };
  }
} catch (error) {
  if (error.message) {
    console.log(chalk.bgRed(error.message));
  } else {
    console.log(chalk.red(error));
  }
}
