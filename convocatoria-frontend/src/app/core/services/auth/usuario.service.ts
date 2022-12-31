import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../../shared/constants';
import { Usuario } from '../../interfaces';

@Injectable()
export class UsuarioService {
  constructor(
    private http: HttpClient
  ) {}

  /**
   * Método encargado de obtener el listado completo de usuarios
   *
   * @param sort Ordenación
   * @returns
   */
  findAll(sort?: string): Observable<Usuario[]> {
    let params = new HttpParams();
    if (sort != undefined) params = params.append('sort', sort);
    return this.http.get<Usuario[]>(APC.API_URL_ENDPOINT + APC.API_URI_PRIVATE + APC.API_METHOD_USUARIOS, { params: params });
  }

  /**
   * Método encargado de obtener un usuario por id
   *
   * @param id Identificador del usuario
   * @returns
   */
  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(APC.API_URL_ENDPOINT + APC.API_METHOD_USUARIOS + '/' + `${id}`);
  }

  /**
   * Método encargado de crear un usuario
   *
   * @param usuario Usuario a crear
   * @returns
   */
  create(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(APC.API_URL_ENDPOINT + APC.API_METHOD_USUARIOS, usuario);
  }

  /**
   * Método encargado de actualizar un usuario
   *
   * @param id Identificador del usuario
   * @param usuario Usuario a actualizar
   * @returns
   */
  update(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(APC.API_URL_ENDPOINT + APC.API_METHOD_USUARIOS + '/' + `${id}`, usuario);
  }

  /**
   * Método encargado de actualizar un usuario
   *
   * @param id Identificador del usuario
   * @param nuevoPassword Nueva contraseña del usuario
   * @returns
   */
  updatePassword(id: number, nuevoPassword: string): Observable<Usuario> {
    return this.http.put<Usuario>(APC.API_URL_ENDPOINT + APC.API_METHOD_USUARIOS + '/' + `${id}` + '/updatePassword', nuevoPassword);
  }

  /**
   * Método encargado de eliminar un usuario
   *
   * @param id Identificador del usuario
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_USUARIOS + '/' + `${id}`);
  }

}
