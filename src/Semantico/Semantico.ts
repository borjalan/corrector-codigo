import { reglas, actionsGoto } from '../Assets/Params';
import { Token } from '../Types/Types';

const CTE_CAD = 'cte_cad';
const CTE_NUM = 'cte_num';

let pilaSemantico: Array<[string, string | Token]> = [['Z', 'axioma']];
let ex: [string, string | Token] = ['', ''];
let ultimoToken: Token;

// --------------------------------------------- Funciones públicas ---------------------------------------------

const evaluarReduccion = (regla: number, token: Token) => {
  switch (regla) {
    case 66:
      break;
    case 67:
      ex = extraerPila();
      pilaSemantico.push(['V', ex[1]]);
      break;
    case 68:
      pilaSemantico.push(['W', CTE_CAD]);
      break;
    case 69:
      ex = extraerPila();
      pilaSemantico.push(['W', ex[1]]);
      break;
    case 70:
      pilaSemantico.push(['T', token]);
      break;
    case 71:
      pilaSemantico.push(['T', CTE_NUM]);
      break;
  }
};

// --------------------------------------------- Funciones privadas ---------------------------------------------

const extraerPila = (): [string, string | Token] => {
  const extracción = pilaSemantico.pop();
  if (extracción) {
    return extracción;
  }
  return ['?', 'Errror'];
};

export { evaluarReduccion };
