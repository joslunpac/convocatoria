import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * Pipe encargado de formatear una hora y quitarle los segundos
 */
@Pipe({name: 'horaSinSegundos'})
export class HoraSinSegundosPipe implements PipeTransform {
  transform(hora: any): any {
    return moment(hora,'HH:mm').format('HH:mm');
  }
}
