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

export type Tipos = 'number' | 'string' | 'boolean';

export type TiposFuncion = Tipos | 'void';

export interface Lexema {
  nombre: string;
  atributos: {
    tipo: Tipos;
    desplazamiento: number;
  };
}

export interface LexemasParametrosFunción {
  nombre: string;
  atributos: {
    tipo: Tipos;
    despl: number;
    param?: number;
  };
}

export interface LexemasFuncion {
  nombre: string;
  atributos: {
    tipo: 'función';
    numParametros: number;
    tipoParametros: Array<Tipos>;
    tipoRetorno: TiposFuncion;
    etiquetaFuncion: string;
  };
}

export interface TablaSimbolos {
  nombre: string;
  número: 0;
  lexemas: Array<Lexemas | LexemasFuncion>;
}

export interface TablaFuncion {
  nombre: string;
  numero: number;
  lexemas: Array<Lexemas | LexemasParametrosFunción>;
}
