import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe encargado de quitar el prefijo ROLE del rol
 */
@Pipe({name: 'eliminarPrefijo'})
export class EliminarPrefijoPipe implements PipeTransform {
  transform(cadena: string, prefijo: string): string {
    if (cadena != null && prefijo != null && cadena.startsWith(prefijo)) {
        return cadena.split(prefijo, 2)[1];
    }

    return cadena;
  }
}
