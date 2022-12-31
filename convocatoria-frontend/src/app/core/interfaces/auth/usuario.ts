import { Auditoria } from '../auditoria';
import { Rol } from './rol';

export interface Usuario extends Auditoria {
  id: number;
  avatar?: string;
  email: string;
  nombre: string;
  apellidos: string;
  password?: string;
  nuevoPassword?: string;
  roles: Rol[];
}
