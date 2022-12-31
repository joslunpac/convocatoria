import { Pipe, PipeTransform } from '@angular/core';
import { Titular } from '../../core/interfaces';
import { AppConstants as AC } from '../constants';

/**
 * Pipe encargado de devolver la ruta de la imagen del avatar de un titular
 *
 * Si no tiene avatar, devuelve la ruta del logo de la aplicación
 */
@Pipe({name: 'rutaAvatarTitular'})
export class RutaAvatarTitularPipe implements PipeTransform {
  transform(titular: Titular): string {
    if (titular.tieneAvatar) return AC.RUTA_TITULARES + titular.entidad.codigo + '_' + titular.orden + '.jpg'
    else return AC.RUTA_IMAGENES + 'logo.png';
  }
}
