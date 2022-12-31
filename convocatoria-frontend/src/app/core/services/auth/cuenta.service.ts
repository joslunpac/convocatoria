import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConstants as APC } from '../../../shared/constants';
import { Jwt, Usuario } from '../../interfaces';

@Injectable()
export class CuentaService {
  constructor(
    private http: HttpClient
  ) {}

  /**
   * Método encargado de obtener el usuario autenticado actualmente
   * @returns
   */
  getAuthenticationUser(): Observable<Usuario> {
    return this.http.get<Usuario>(APC.API_URL_CUENTA);
  }

  /**
   * Método encargado de actualizar el usuario autenticado actualmente
   *
   * @param usuario Usuario a actualizar
   * @returns
   */
  updateAuthenticationUser(usuario: Usuario): Observable<Jwt> {
    return this.http.put<Jwt>(APC.API_URL_CUENTA, usuario);
  }

  /**
   * Método encargado de eliminar el usuario autenticado actualmente
   * @returns
   */
  delete(): Observable<unknown> {
    return this.http.delete(APC.API_URL_CUENTA);
  }
}
