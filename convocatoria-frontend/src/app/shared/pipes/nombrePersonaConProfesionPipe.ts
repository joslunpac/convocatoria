import { Pipe, PipeTransform } from '@angular/core';
import { Persona } from '../../core/interfaces';
import { AppConstants as AC } from '../constants';

/**
 * Pipe encargado de devolver el nombre de una persona junto con su profesión
 */
@Pipe({name: 'nombrePersonaConProfesion'})
export class NombrePersonaConProfesionPipe implements PipeTransform {
  transform(persona: Persona): string {
    let nombreCompleto: string = "";

    if (persona.genero == AC.GENERO_MASCULINO_ACRONIMO) nombreCompleto += 'D. ';
    else if (persona.genero == AC.GENERO_FEMENINO_ACRONIMO) nombreCompleto += 'Dª. ';

    nombreCompleto += persona.nombre;

    if (persona.profesion != null) nombreCompleto += ' / ' + persona.profesion;

    return nombreCompleto;
  }
}
