import { Pipe, PipeTransform } from '@angular/core';
import { Entidad } from '../../core/interfaces';
import { AppConstants as AC } from '../constants';

/**
 * Pipe encargado de devolver la ruta de la imagen del avatar de una entidad
 *
 * Si no tiene avatar, devuelve la ruta del logo de la aplicación
 */
@Pipe({name: 'rutaAvatarEntidad'})
export class RutaAvatarEntidadPipe implements PipeTransform {
  transform(entidad: Entidad): string {
    if (entidad.tieneAvatar) return AC.RUTA_ENTIDADES + entidad.codigo + '.jpg';
    else return AC.RUTA_IMAGENES + 'logo.png';
  }
}
