import { Pipe, PipeTransform } from '@angular/core';
import { Titular } from '../../core/interfaces';

/**
 * Pipe encargado de devolver el nombre de un titular junto con su entidad
 */
@Pipe({name: 'nombreTitularConEntidad'})
export class NombreTitularConEntidadPipe implements PipeTransform {
  transform(titular: Titular): string {
    let nombreCompleto: string = titular.nombre;

    nombreCompleto += ' / ' + titular.entidad.nombreCorto;

    if (titular.entidad.nombreCortoAux) nombreCompleto += ' - ' + titular.entidad.nombreCortoAux;

    return nombreCompleto;
  }
}
