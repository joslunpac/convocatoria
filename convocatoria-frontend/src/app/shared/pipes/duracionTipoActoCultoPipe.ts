import { Pipe, PipeTransform } from '@angular/core';
import { TipoActoCulto } from '../../core/interfaces';

/**
 * Pipe encargado de devolver la duración de un tipo de acto o culto
 */
@Pipe({name: 'duracionTipoActoCulto'})
export class DuracionTipoActoCultoPipe implements PipeTransform {
  transform(tipoActoCulto: TipoActoCulto): string {
    if (tipoActoCulto.dias == 0) return 'Variable'

    let sufijo: string = '';

    if (tipoActoCulto.dias == 1) sufijo += ' día';
    else sufijo += ' días';

    return tipoActoCulto.dias.toString() + sufijo;
  }
}
