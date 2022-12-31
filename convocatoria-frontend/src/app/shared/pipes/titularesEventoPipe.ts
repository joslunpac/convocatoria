import { Pipe, PipeTransform } from '@angular/core';
import { Evento } from '../../core/interfaces';
import { AppConstants as AC } from '../constants';

/**
 * Pipe encargado de devolver los titulares de un evento
 *
 * Si el evento tiene un solo titular, devuelve el nombre del titular
 * Si el evento tiene mas de un titular, devuelve la cadena 'Sagrados titulares'
 * Si el evento no tiene titulares, devuelve cadena vacía
 */
@Pipe({name: 'titularesEvento'})
export class TitularesEventoPipe implements PipeTransform {
  transform(evento: Evento): string {
    if (evento.titulares != null && evento.titulares.length > 0) {
      if (evento.titulares.length == 1) return evento.titulares[0].nombre;
      else return AC.EVENTO_VARIOS_TITULARES;
    } else {
      return '';
    }
  }
}
