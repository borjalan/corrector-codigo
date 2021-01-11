import * as fs from 'fs';
const reglas: string[] = fs.readFileSync(process.argv[2], 'utf8').split('\n');

let ultimaR: number = reglas.length - 1;
let output: string = '';

const escribirRegla = (regla: string, contador: number) => {
  const partes: string[] = regla.split(' -> ');
  let linea: string = ' ["' + partes[0] + '","' + partes[1].replace("''", 'λ') + '"]';
  let espacios = 40 - linea.length;

  if (contador < ultimaR) linea = linea + ',';
  for (let i = 0; i < espacios; i++) linea = linea + ' ';

  linea = linea + '//' + contador + '\n';
  output = output + linea;
};

if (fs.existsSync('./Outputs/Gramática.js')) fs.unlinkSync('./Outputs/Gramática.js');

output =
  output +
  '// Este array contiene las reglas de la gramática para reducir\n' +
  'export const reglas = ' +
  '\n[\n';

reglas.forEach((regla, i) => {
  regla = regla.replace('\r', '');
  escribirRegla(regla, i);
});
output = output + ']';
fs.writeFileSync('./Outputs/Gramática.js', output);
