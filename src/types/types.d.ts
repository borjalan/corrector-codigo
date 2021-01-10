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

export type Action = `${'s' | 'r' | ''}${number}` | 'acc';

export interface TablaSimbolos {}
