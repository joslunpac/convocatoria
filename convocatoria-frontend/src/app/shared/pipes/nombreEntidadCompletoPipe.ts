import { Pipe, PipeTransform } from '@angular/core';
import { Entidad } from '../../core/interfaces';

/**
 * Pipe encargado de devolver el nombre completo de una entidad
 */
@Pipe({name: 'nombreEntidadCompleto'})
export class NombreEntidadCompletoPipe implements PipeTransform {
  transform(entidad: Entidad): string {
    let nombreCompleto: string = entidad.nombreCorto;

    if (entidad.nombreCortoAux) nombreCompleto += ' - ' + entidad.nombreCortoAux;

    // En caso de que el tipo de entidad sea Banda, le añadimos el tipo de banda
    if (entidad.tipoBanda) nombreCompleto = entidad.tipoBanda.acronimo  + ' ' + nombreCompleto;

    return nombreCompleto;
  }
}
