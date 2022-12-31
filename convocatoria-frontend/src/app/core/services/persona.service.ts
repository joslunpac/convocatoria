import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC, AppConstants as AC } from '../../shared/constants';
import { Persona } from '../interfaces';

@Injectable()
export class PersonaService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el listado completo de personas
   *
   * @param sort Ordenación
   * @returns
   */
  findAll(sort?: string): Observable<Persona[]> {
    let params = new HttpParams();
    if (sort != null) params = params.append('sort', sort);
    return this.http.get<Persona[]>(APC.API_URL_ENDPOINT + APC.API_METHOD_PERSONAS, { params: params });
  }

  /**
   * Método encargado de obtener el listado completo de personas con filtros
   *
   * @param masculino Indica si la persona puede ser de género Masculino
   * @param femenino Indica si la persona puede ser de género Femenino
   * @param sinGenero Indica si la persona puede no tener género
   * @param sort Ordenación
   * @returns
   */
  findAllByCriteria(masculino: boolean = true, femenino: boolean = true, sinGenero: boolean = true,
    sort?: string): Observable<Persona[]> {
    let params = new HttpParams();

    let generos: string[] = [];

    if (masculino) generos.push(AC.GENERO_MASCULINO_ACRONIMO);
    if (femenino) generos.push(AC.GENERO_FEMENINO_ACRONIMO);
    if (sinGenero) generos.push(AC.SIN_GENERO_ACRONIMO);

    if (generos.length > 0) params = params.append('generos', generos.toString());
    if (sort != null) params = params.append('sort', sort);

    return this.http.get<Persona[]>(APC.API_URL_ENDPOINT + APC.API_METHOD_PERSONAS + APC.API_METHOD_BY_CRITERIA, { params: params });
  }

  /**
   * Método encargado de obtener una persona por id
   *
   * @param id Identificador de la persona
   * @returns
   */
  findById(id: number): Observable<Persona> {
    return this.http.get<Persona>(APC.API_URL_ENDPOINT + APC.API_METHOD_PERSONAS + '/' + `${id}`);
  }

  /**
   * Método encargado de crear una persona
   *
   * @param persona Persona a crear
   * @returns
   */
  create(persona: Persona): Observable<Persona> {
    return this.http.post<Persona>(APC.API_URL_ENDPOINT + APC.API_METHOD_PERSONAS, persona);
  }

  /**
   * Método encargado de actualizar una persona
   *
   * @param id Identificador de la persona
   * @param persona Persona a actualizar
   * @returns
   */
  update(id: number, persona: Persona): Observable<Persona> {
    return this.http.put<Persona>(APC.API_URL_ENDPOINT + APC.API_METHOD_PERSONAS + '/' + `${id}`, persona);
  }

  /**
   * Método encargado de eliminar una persona
   *
   * @param id Identificador de la persona
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_PERSONAS + '/' + `${id}`);
  }
}
