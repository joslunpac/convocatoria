import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../shared/constants';
import { TipoActoCulto } from '../interfaces';

@Injectable()
export class TipoActoCultoService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el listado completo de tipos de acto o culto
   *
   * @param sort Ordenación
   * @returns
   */
  findAll(sort?: string): Observable<TipoActoCulto[]> {
    let params = new HttpParams();
    if (sort != null) params = params.append('sort', sort);
    return this.http.get<TipoActoCulto[]>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ACTO_CULTO, { params: params });
  }

  /**
   * Método encargado de obtener un tipo de acto o culto por id
   *
   * @param id Identificador del tipo de acto o culto
   * @returns
   */
  findById(id: number): Observable<TipoActoCulto> {
    return this.http.get<TipoActoCulto>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ACTO_CULTO + '/' + `${id}`);
  }

  /**
   * Método encargado de crear un tipo de acto o culto
   *
   * @param tipoActoCulto Tipo de acto o culto a crear
   * @returns
   */
  create(tipoActoCulto: TipoActoCulto): Observable<TipoActoCulto> {
    return this.http.post<TipoActoCulto>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ACTO_CULTO, tipoActoCulto);
  }

  /**
   * Método encargado de actualizar un tipo de acto o culto
   *
   * @param id Identificador del tipo de acto o culto
   * @param tipoActoCulto Tipo de acto o culto a actualizar
   * @returns
   */
  update(id: number, tipoActoCulto: TipoActoCulto): Observable<TipoActoCulto> {
    return this.http.put<TipoActoCulto>(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ACTO_CULTO + '/' + `${id}`, tipoActoCulto);
  }

  /**
   * Método encargado de eliminar un tipo de acto o culto
   *
   * @param id Identificador del tipo de acto o culto
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_TIPOS_ACTO_CULTO + '/' + `${id}`);
  }
}
