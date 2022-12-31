import { Caracter } from './caracter';
import { Entidad } from './entidad';

export interface Titular {
  id: number;
  nombre: string;
  categoria: string;
  orden: number;
  entidad: Entidad;
  caracter?: Caracter;
  tieneAvatar: boolean;
}
