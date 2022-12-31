import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../shared/constants';
import { Entidad } from '../interfaces';

@Injectable()
export class EntidadService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el listado completo de entidades
   *
   * @param priv Indica si hay que concatenarle a la url 'private/'
   * @param sort Ordenación
   * @returns
   */
  findAll(priv: boolean = false, sort?: string): Observable<Entidad[]> {
    let params = new HttpParams();
    if (sort != null) params = params.append('sort', sort);
    return this.http.get<Entidad[]>(APC.API_URL_ENDPOINT + (priv ? APC.API_URI_PRIVATE : '') + APC.API_METHOD_ENTIDADES, { params: params });
  }

  /**
   * Método encargado de obtener el listado completo de entidades con filtros
   *
   * @param tiposEntidadId Ids de los tipos de entidad que puede poseer la entidad
   * @param caracteresId Ids de los carácteres que puede poseer la entidad
   * @param noVisibles Indica si hay que mostrar únicamente las entidades no visibles
   * @param pendienteRevisar Indica si hay que mostrar únicamente las entidades pendientes de revisar
   * @param sort Ordenación
   * @returns
   */
  findAllByCriteria(
    priv: boolean = false,
    tiposEntidadId: number[],
    caracteresId: number[],
    noVisibles: boolean = false,
    pendienteRevisar: boolean = false,
    sort?: string
  ): Observable<Entidad[]> {
    let params = new HttpParams();

    if (tiposEntidadId != null && tiposEntidadId.length > 0) params = params.append('tiposEntidadId', tiposEntidadId.toString());
    if (caracteresId != null && caracteresId.length > 0) params = params.append('caracteresId', caracteresId.toString());
    if (noVisibles) params = params.append('noVisibles', noVisibles);
    if (pendienteRevisar) params = params.append('pendienteRevisar', pendienteRevisar);
    if (sort != null) params = params.append('sort', sort);

    return this.http.get<Entidad[]>(APC.API_URL_ENDPOINT + (priv ? APC.API_URI_PRIVATE : '') + APC.API_METHOD_ENTIDADES + APC.API_METHOD_BY_CRITERIA, { params: params });
  }

  /**
   * Método encargado de obtener una entidad por id
   *
   * @param id Identificador de la entidad
   * @param priv Indica si hay que concatenarle a la url 'private/'
   * @returns
   */
  findById(id: number, priv: boolean = false): Observable<Entidad> {
    return this.http.get<Entidad>(APC.API_URL_ENDPOINT + (priv ? APC.API_URI_PRIVATE : '') + APC.API_METHOD_ENTIDADES + '/' + `${id}`);
  }

  /**
   * Método encargado de crear una entidad
   *
   * @param entidad Entidad a crear
   * @returns
   */
  create(entidad: Entidad): Observable<Entidad> {
    return this.http.post<Entidad>(APC.API_URL_ENDPOINT + APC.API_METHOD_ENTIDADES, entidad);
  }

  /**
   * Método encargado de actualizar una entidad
   *
   * @param id Identificador de la entidad
   * @param entidad Entidad a actualizar
   * @returns
   */
  update(id: number, entidad: Entidad): Observable<Entidad> {
    return this.http.put<Entidad>(APC.API_URL_ENDPOINT + APC.API_METHOD_ENTIDADES + '/' + `${id}`, entidad);
  }

  /**
   * Método encargado de eliminar una entidad
   *
   * @param id Identificador de la entidad
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_ENTIDADES + '/' + `${id}`);
  }
}
