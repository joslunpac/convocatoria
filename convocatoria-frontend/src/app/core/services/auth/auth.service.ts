import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenService } from '..';
import { ApiConstants as APC } from '../../../shared/constants';
import { Jwt, Signin, Signup } from '../../interfaces';

@Injectable()
export class AuthService {
  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  /**
   * Método encargado de iniciar sesión en el sistema
   *
   * @param signin Datos del inicio de sesión
   * @returns
   */
  signin(signin: Signin): Observable<Jwt> {
    return this.http.post<Jwt>(APC.API_URL_AUTH + APC.API_METHOD_SIGNIN, signin);
  }

  /**
   * Método encargado de registrar un nuevo usuario en el sistema
   *
   * @param signup Datos del nuevo usuario
   * @returns
   */
  signup(signup: Signup): Observable<Jwt> {
    return this.http.post<Jwt>(APC.API_URL_AUTH + APC.API_METHOD_SIGNUP, signup);
  }

  /**
   * Método encargado de cerrar la sesión del usuario
   */
  signout(): void {
    this.tokenService.cerrarSesion();
  }

  /**
   * Método encargado de refrescar el token del usuario
   *
   * @param jwt Datos del token
   * @returns
   */
  refresh(jwt: Jwt): Observable<Jwt> {
    return this.http.post<Jwt>(APC.API_URL_AUTH + APC.API_METHOD_REFRESH, jwt);
  }

}
