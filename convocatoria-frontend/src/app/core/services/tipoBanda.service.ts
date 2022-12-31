import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../shared/constants';
import { TipoBanda } from '../interfaces';

@Injectable()
export class TipoBandaService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el listado completo de tipos de banda
   *
   * @param sort Ordenación
   * @returns
   */
  findAll(sort?: string): Observable<TipoBanda[]> {
    let params = new HttpParams();
    if (sort != null) params = params.append('sort', sort);
    return this.http.get<TipoBanda[]>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_BANDA, { params: params });
  }

  /**
   * Método encargado de obtener un tipo de banda por id
   *
   * @param id Identificador del tipo de banda
   * @returns
   */
  findById(id: number): Observable<TipoBanda> {
    return this.http.get<TipoBanda>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_BANDA + '/' + `${id}`);
  }

  /**
   * Método encargado de crear un tipo de banda
   *
   * @param tipoBanda Tipo de banda a crear
   * @returns
   */
  create(tipoBanda: TipoBanda): Observable<TipoBanda> {
    return this.http.post<TipoBanda>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_BANDA, tipoBanda);
  }

  /**
   * Método encargado de actualizar un tipo de banda
   *
   * @param id Identificador del tipo de banda
   * @param tipoBanda Tipo de banda a actualizar
   * @returns
   */
  update(id: number, tipoBanda: TipoBanda): Observable<TipoBanda> {
    return this.http.put<TipoBanda>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_BANDA + '/' + `${id}`, tipoBanda);
  }

  /**
   * Método encargado de eliminar un tipo de banda
   *
   * @param id Identificador del tipo de banda
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_BANDA + '/' + `${id}`);
  }
}
