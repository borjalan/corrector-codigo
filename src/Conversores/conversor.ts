import * as fs from 'fs';

let html: string = fs.readFileSync(process.argv[2], 'utf8');

let aperturaTabla: RegExp = /<tbody>/g;
let cierreTabla: RegExp = /    <\/tbody>|<\/tbody>/g;
let aperturaFila: RegExp = /    <tr>|<tr>/g;
let cierreFila: RegExp = /<\/tr>/g;
let primeraColumna: RegExp = /<td style="color: blue;">[0-9]+<\/td>/g;
let aperturaElemento: RegExp = /<td>/g;
let cierreElemento: RegExp = /<\/td>/g;
let colorR: RegExp = /<sub style="color: green;">|<\/sub>/g;
let colorD: RegExp = /<span style="color: blue;">|<\/span>/g;
let colorA: RegExp = /<span style="color: green;">/;
let vacio: RegExp = /&nbsp;/g;
let retoqueCol: RegExp = /,],/g;

function alinear(): void {
  let i = 1;
  let l = html.split('\n').length;
  while (l > i) {
    if (i < 10) {
      let r = 'r' + i + '"';
      let s = 's' + i + '"';
      let n = '"' + i + '"';
      let rAlign = new RegExp(r, 'g');
      let sAlign = new RegExp(s, 'g');
      let nAlign = new RegExp(n, 'g');
      html = html.replace(rAlign, r + '  ');
      html = html.replace(sAlign, s + '  ');
      html = html.replace(nAlign, n + '   ');
    }
    if (i < 100 && i > 9) {
      let r = 'r' + i + '"';
      let s = 's' + i + '"';
      let n = '"' + i + '"';
      let rAlign = new RegExp(r, 'g');
      let nAlign = new RegExp(n, 'g');
      let sAlign = new RegExp(s, 'g');
      html = html.replace(rAlign, r + ' ');
      html = html.replace(sAlign, s + ' ');
      html = html.replace(nAlign, n + '  ');
    }
    if (i > 99) {
      let n = '"' + i + '"';
      let nAlign = new RegExp(n, 'g');
      html = html.replace(nAlign, n + ' ');
    }
    i++;
  }
  html = html.replace(/],\n]/, ']\n]');
}

html = html.replace(aperturaTabla, '[\n');
html = html.replace(cierreTabla, ']');
html = html.replace(aperturaFila, '  [');
html = html.replace(cierreFila, '],');
html = html.replace(primeraColumna, '');
html = html.replace(aperturaElemento, '"');
html = html.replace(cierreElemento, '",');
html = html.replace(colorR, '');
html = html.replace(colorD, '');
html = html.replace(colorA, '');
html = html.replace(vacio, '    ');
html = html.replace(retoqueCol, '],');
alinear();
html = html.replace('acc",', 'acc", ');
if (fs.existsSync('./Outputs/Goto.js')) fs.unlinkSync('./Outputs/Goto.js');
fs.writeFileSync('./Outputs/Goto.js', html);
