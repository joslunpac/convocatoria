import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../shared/constants';
import { Lugar } from '../interfaces';

@Injectable()
export class LugarService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el listado completo de lugares
   *
   * @param sort Ordenación
   * @returns
   */
  findAll(sort?: string): Observable<Lugar[]> {
    let params = new HttpParams();
    if (sort != null) params = params.append('sort', sort);
    return this.http.get<Lugar[]>(APC.API_URL_ENDPOINT + APC.API_METHOD_LUGARES, { params: params });
  }

  /**
   * Método encargado de obtener un lugar por id
   *
   * @param id Identificador del lugar
   * @returns
   */
  findById(id: number): Observable<Lugar> {
    return this.http.get<Lugar>(APC.API_URL_ENDPOINT + APC.API_METHOD_LUGARES + '/' + `${id}`);
  }

  /**
   * Método encargado de crear un lugar
   *
   * @param lugar Lugar a crear
   * @returns
   */
  create(lugar: Lugar): Observable<Lugar> {
    return this.http.post<Lugar>(APC.API_URL_ENDPOINT + APC.API_METHOD_LUGARES, lugar);
  }

  /**
   * Método encargado de actualizar un lugar
   *
   * @param id Identificador del lugar
   * @param lugar Lugar a actualizar
   * @returns
   */
  update(id: number, lugar: Lugar): Observable<Lugar> {
    return this.http.put<Lugar>(APC.API_URL_ENDPOINT + APC.API_METHOD_LUGARES + '/' + `${id}`, lugar);
  }

  /**
   * Método encargado de eliminar un lugar
   *
   * @param id Identificador del lugar
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_LUGARES + '/' + `${id}`);
  }
}
