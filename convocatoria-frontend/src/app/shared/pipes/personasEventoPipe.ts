import { Pipe, PipeTransform } from '@angular/core';
import { Evento } from '../../core/interfaces';
import { AppConstants as AC } from '../constants';

/**
 * Pipe encargado de devolver las personas de un evento
 *
 * Si el evento tiene una sola persona, devuelve el nombre de la persona
 * Si el evento tiene mas de una persona, devuelve la cadena 'Varias'
 * Si el evento no tiene personas, devuelve cadena vacía
 */
@Pipe({name: 'personasEvento'})
export class PersonasEventoPipe implements PipeTransform {
  transform(evento: Evento): string {
    if (evento.personas != null && evento.personas.length > 0) {
      if (evento.personas.length == 1) {
        let nombreCompleto: string = "";

        if (evento.personas[0].genero == AC.GENERO_MASCULINO_ACRONIMO) nombreCompleto += 'D. ';
        else if (evento.personas[0].genero == AC.GENERO_FEMENINO_ACRONIMO) nombreCompleto += 'Dª. ';

        return nombreCompleto += evento.personas[0].nombre;
      } else {
        return AC.EVENTO_VARIAS_PERSONAS;
      }
    } else {
      return '';
    }
  }
}
