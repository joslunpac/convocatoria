import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../shared/constants';
import { Titular } from '../interfaces';

@Injectable()
export class TitularService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el listado completo de titulares
   *
   * @param sort Ordenación
   * @returns
   */
  findAll(sort?: string): Observable<Titular[]> {
    let params = new HttpParams();
    if (sort != null) params = params.append('sort', sort);
    return this.http.get<Titular[]>(APC.API_URL_ENDPOINT + APC.API_METHOD_TITULARES, { params: params });
  }

  /**
   * Método encargado de obtener el listado completo de titulares con filtros
   *
   * @param caracteresId Ids de los carácteres que puede poseer el titular
   * @param sinCaracter Indica si el titular puede no poseer ningún carácter
   * @param sort Ordenación
   * @returns
   */
  findAllByCriteria(
    caracteresId: number[],
    sinCaracter: boolean = true,
    sort?: string
  ): Observable<Titular[]> {
    let params = new HttpParams();

    if (caracteresId != null && caracteresId.length > 0) params = params.append('caracteresId', caracteresId.toString());
    if (sinCaracter) params = params.append('sinCaracter', sinCaracter);
    if (sort != null) params = params.append('sort', sort);

    return this.http.get<Titular[]>(APC.API_URL_ENDPOINT + APC.API_METHOD_TITULARES + APC.API_METHOD_BY_CRITERIA, { params: params });
  }

  /**
   * Método encargado de obtener una titular por id
   *
   * @param id Identificador de la titular
   * @returns
   */
  findById(id: number): Observable<Titular> {
    return this.http.get<Titular>(APC.API_URL_ENDPOINT + APC.API_METHOD_TITULARES + '/' + `${id}`);
  }

  /**
   * Método encargado de crear un titular
   *
   * @param titular Titular a crear
   * @returns
   */
  create(titular: Titular): Observable<Titular> {
    return this.http.post<Titular>(APC.API_URL_ENDPOINT + APC.API_METHOD_TITULARES, titular);
  }

  /**
   * Método encargado de actualizar un titular
   *
   * @param id Identificador de la titular
   * @param titular Titular a actualizar
   * @returns
   */
  update(id: number, titular: Titular): Observable<Titular> {
    return this.http.put<Titular>(APC.API_URL_ENDPOINT + APC.API_METHOD_TITULARES + '/' + `${id}`, titular);
  }

  /**
   * Método encargado de eliminar un titular
   *
   * @param id Identificador de la titular
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_TITULARES + '/' + `${id}`);
  }
}
