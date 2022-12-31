import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ApiConstants as APC, AppConstants as AC } from '../../../shared/constants';

const STORAGE_LOCAL_TOKEN = 'token';

@Injectable()
export class TokenService {
  constructor(
    private router: Router
  ) {}

  // Guardamos el token en el almacenamiento local
  guardarToken(token: string): void {
    window.localStorage.removeItem(STORAGE_LOCAL_TOKEN);
    window.localStorage.setItem(STORAGE_LOCAL_TOKEN, token);
  }

  // Obtenemos el token del almacenamiento local
  obtenerToken(): string | null {
    return window.localStorage.getItem(STORAGE_LOCAL_TOKEN);
  }

  // Comprobamos si se ha iniciado sesión
  estaLogado(): boolean {
    // Si existe token almacenado en el almacenamiento local, es que estamos logados
    return !!this.obtenerToken();
  }

  // Obtenemos el avatar del usuario logado del token
  obtenerAvatarUsuario(): any {
    if (!this.estaLogado()) {
      return null;
    } else {
      // Obtenemos el token
      const token = this.obtenerToken();
      // Obtenemos la segunta parte del token
      const payload = token!.split('.')[1];
      // La decodificamos
      const payloadDecode = atob(payload);
      const values = JSON.parse(payloadDecode);
      // Devolvemos el avatar del usuario
      return values.avatar;
    }
  }

  // Obtenemos el nombre del usuario logado del token
  obtenerNombreUsuario(): any {
    if (!this.estaLogado()) {
      return null;
    } else {
      // Creamos las funciones para decodificar correctamente base64
      function base64DecodeUnicode(cadena: string) {
        return decodeURIComponent(atob(cadena).replace(/(.)/g, function (m, p) {
          var code = p.charCodeAt(0).toString(16).toUpperCase();
          if (code.length < 2) {
            code = '0' + code;
          }
          return '%' + code;
        }));
      }

      function base64_url_decode(cadena: string){
        var output = cadena.replace(/-/g, "+").replace(/_/g, "/");
        switch (output.length % 4) {
          case 0:
            break;
          case 2:
            output += "==";
            break;
          case 3:
            output += "=";
            break;
          default:
            throw "Illegal base64url string!";
        }

        try{
          return base64DecodeUnicode(output);
        } catch (err) {
          return atob(output);
        }
      }

      // Obtenemos el token
      const token = this.obtenerToken();
      // Obtenemos la segunta parte del token
      const payload = token!.split('.')[1];
      // La decodificamos
      const payloadDecode = base64_url_decode(payload);
      const values = JSON.parse(payloadDecode);
      // Devolvemos el nombre del usuario
      return values.nombreUsuario;
    }
  }

  // Comprobamos si el usuario posee el rol [ADMINISTRADOR]
  esAdministrador(): boolean {
    if (!this.estaLogado()) {
      return false;
    } else {
      // Obtenemos el token
      const token = this.obtenerToken();
      // Obtenemos la segunta parte del token
      const payload = token!.split('.')[1];
      // La decodificamos
      const payloadDecode = atob(payload);
      const values = JSON.parse(payloadDecode);
      // Obtenemos los roles, que vienen en el campo roles
      const roles = values.roles;
      // Comprobamos si el usuario posee el rol [ADMINISTRADOR]
      if (roles.indexOf(APC.API_ROL_ADMINISTRADOR) < 0) {
        return false;
      }

      return true;
    }
  }

  // Comprobamos si el usuario posee el rol [MODERADOR]
  esModerador(): boolean {
    if (!this.estaLogado()) {
      return false;
    } else {
      // Obtenemos el token
      const token = this.obtenerToken();
      // Obtenemos la segunta parte del token
      const payload = token!.split('.')[1];
      // La decodificamos
      const payloadDecode = atob(payload);
      const values = JSON.parse(payloadDecode);
      // Obtenemos los roles, que vienen en el campo roles
      const roles = values.roles;
      // Comprobamos si el usuario posee el rol [MODERADOR]
      if (roles.indexOf(APC.API_ROL_MODERADOR) < 0) {
        return false;
      }

      return true;
    }
  }

  // Borramos el token del almacenamiento local, navegamos a la ruta de inicio y recargamos la página
  cerrarSesion() {
    window.localStorage.removeItem(STORAGE_LOCAL_TOKEN);

    this.router.navigate([AC.HOME_ROUTE]).then(() => {
      window.location.reload();
    });
  }

}
