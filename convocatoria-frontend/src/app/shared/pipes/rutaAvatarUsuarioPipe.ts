import { Pipe, PipeTransform } from '@angular/core';
import { AppConstants as AC } from '../constants';

/**
 * Pipe encargado de devolver la ruta de la imagen del avatar de un usuario
 *
 * Si no tiene avatar, devuelve la ruta del logo de la aplicación
 */
@Pipe({name: 'rutaAvatarUsuario'})
export class RutaAvatarUsuarioPipe implements PipeTransform {
  transform(avatar: String): string {
    if (avatar != null) return AC.RUTA_AVATARES + avatar + '.jpg';
    else return AC.RUTA_AVATARES + 'avatar1.jpg';
  }
}
