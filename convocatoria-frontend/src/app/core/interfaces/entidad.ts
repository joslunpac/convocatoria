import { Caracter } from './caracter';
import { Lugar } from './lugar';
import { TipoBanda } from './tipoBanda';
import { TipoEntidad } from './tipoEntidad';

export interface Entidad {
  id: number;
  codigo: string;
  nombre?: string;
  nombreCorto: string;
  nombreCortoAux?: string;
  tipoEntidad: TipoEntidad;
  caracterPrincipal?: Caracter;
  caracteres?: Caracter[];
  tipoBanda?: TipoBanda;
  lugar?: Lugar;
  nota?: string;
  tieneAvatar: boolean;
  visible: boolean;
  pendienteRevisar: boolean;
}
