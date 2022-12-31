import { Pipe, PipeTransform } from '@angular/core';
import { Usuario } from '../../core/interfaces';

/**
 * Pipe encargado de devolver el nombre completo de un usuario
 */
@Pipe({name: 'nombreUsuarioCompleto'})
export class NombreUsuarioCompletoPipe implements PipeTransform {
  transform(usuario: Usuario): string {
    return usuario.nombre + ' ' + usuario.apellidos;
  }
}
