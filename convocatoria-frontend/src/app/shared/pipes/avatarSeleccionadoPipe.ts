import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe encargado de comprobar si el avatar es el mismo que el del usuario autenticado
 */
@Pipe({name: 'avatarSeleccionado'})
export class AvatarSeleccionadoPipe implements PipeTransform {
  transform(avatarUsuario: string, avatarSeleccionado: string): string {
    let clase: string = 'pointer avatar-2x';

    if (avatarUsuario != null && avatarSeleccionado!= null && avatarUsuario == avatarSeleccionado) {
      clase += ' avatar-focus';
    }

    return clase;
  }
}
