import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../shared/constants';
import { TipoEntidad } from '../interfaces';

@Injectable()
export class TipoEntidadService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el listado completo de tipos de entidad
   *
   * @param sort Ordenación
   * @returns
   */
  findAll(sort?: string): Observable<TipoEntidad[]> {
    let params = new HttpParams();
    if (sort != null) params = params.append('sort', sort);
    return this.http.get<TipoEntidad[]>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ENTIDAD, { params: params });
  }

  /**
   * Método encargado de obtener un tipo de entidad por id
   *
   * @param id Identificador del tipo de entidad
   * @returns
   */
  findById(id: number): Observable<TipoEntidad> {
    return this.http.get<TipoEntidad>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ENTIDAD + '/' + `${id}`);
  }

  /**
   * Método encargado de obtener un tipo de entidad por acrónimo
   *
   * @param acronimo Acrónimo del tipo de entidad
   * @returns
   */
  findByAcronimo(acronimo: string): Observable<TipoEntidad> {
    return this.http.get<TipoEntidad>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ENTIDAD + '/acronimo/' + `${acronimo}`);
  }

  /**
   * Método encargado de crear un tipo de entidad
   *
   * @param tipoEntidad Tipo de entidad a crear
   * @returns
   */
  create(tipoEntidad: TipoEntidad): Observable<TipoEntidad> {
    return this.http.post<TipoEntidad>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ENTIDAD, tipoEntidad);
  }

  /**
   * Método encargado de actualizar un tipo de entidad
   *
   * @param id Identificador del tipo de entidad
   * @param tipoEntidad Tipo de entidad a actualizar
   * @returns
   */
  update(id: number, tipoEntidad: TipoEntidad): Observable<TipoEntidad> {
    return this.http.put<TipoEntidad>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ENTIDAD + '/' + `${id}`, tipoEntidad);
  }

  /**
   * Método encargado de eliminar un tipo de entidad
   *
   * @param id Identificador del tipo de entidad
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ENTIDAD + '/' + `${id}`);
  }
}
