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

export type Tipos = 'number' | 'string' | 'boolean' | 'void';

/*
  type StxError = '    ';
  type Fin = 'acc';
  type Reduccion = `r${number}`;
  type Desplazamiento = `s${number}`;
  export type Action = Fin | Reduccion | Desplazamiento | StxError;
*/

export interface TablaSimbolos {}
