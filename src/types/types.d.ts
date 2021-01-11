export interface Token {
  codigo: string;
  atributo?: {
    nombre?: string;
    numero?: number;
    cadena?: string;
  };
  posicion?: {
    linea: number;
    columna: number;
  };
}

/*
  type StxError = '    ';
  type Fin = 'acc';
  type Reduccion = `r${number}`;
  type Desplazamiento = `s${number}`;
  export type Action = Fin | Reduccion | Desplazamiento | StxError;
*/

export interface TablaSimbolos {}
