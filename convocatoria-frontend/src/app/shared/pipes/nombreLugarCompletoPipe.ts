import { Pipe, PipeTransform } from '@angular/core';
import { Lugar } from '../../core/interfaces';

/**
 * Pipe encargado de devolver el nombre completo de un lugar
 */
@Pipe({name: 'nombreLugarCompletoPipe'})
export class NombreLugarCompletoPipe implements PipeTransform {
  transform(lugar: Lugar): string {
    return lugar.nombre + ' (' + lugar.direccion + ')';
  }
}
