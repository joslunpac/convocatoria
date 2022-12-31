import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../shared/constants';
import { Caracter } from '../interfaces';

@Injectable()
export class CaracterService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el listado completo de carácteres
   *
   * @param sort Ordenación
   * @returns
   */
  findAll(sort?: string): Observable<Caracter[]> {
    let params = new HttpParams();
    if (sort != undefined) params = params.append('sort', sort);
    return this.http.get<Caracter[]>(APC.API_URL_ENDPOINT + APC.API_METHOD_CARACTERES, { params: params });
  }

  /**
   * Método encargado de obtener un carácter por id
   *
   * @param id Identificador del carácter
   * @returns
   */
  findById(id: number): Observable<Caracter> {
    return this.http.get<Caracter>(APC.API_URL_ENDPOINT + APC.API_METHOD_CARACTERES + '/' + `${id}`);
  }

  /**
   * Método encargado de crear un carácter
   *
   * @param caracter Carácter a crear
   * @returns
   */
  create(caracter: Caracter): Observable<Caracter> {
    return this.http.post<Caracter>(APC.API_URL_ENDPOINT + APC.API_METHOD_CARACTERES, caracter);
  }

  /**
   * Método encargado de actualizar un carácter
   *
   * @param id Identificador del carácter
   * @param caracter Carácter a actualizar
   * @returns
   */
  update(id: number, caracter: Caracter): Observable<Caracter> {
    return this.http.put<Caracter>(APC.API_URL_ENDPOINT + APC.API_METHOD_CARACTERES + '/' + `${id}`, caracter);
  }

  /**
   * Método encargado de eliminar un carácter
   *
   * @param id Identificador del carácter
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_CARACTERES + '/' + `${id}`);
  }
}
