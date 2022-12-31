import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../../shared/constants';
import { Rol } from '../../interfaces';

@Injectable()
export class RolService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el listado completo de roles
   *
   * @param sort Ordenación
   * @returns
   */
  findAll(sort?: string): Observable<Rol[]> {
    let params = new HttpParams();
    if (sort != null) params = params.append('sort', sort);
    return this.http.get<Rol[]>(APC.API_URL_ENDPOINT + APC.API_URI_PRIVATE + APC.API_METHOD_ROLES, { params: params });
  }

}
