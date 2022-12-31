import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, concatMap } from 'rxjs/operators';
import { ApiConstants as APC } from '../../shared/constants';
import { AuthService, TokenService } from '../services';

@Injectable()
export class SolicitudHttpInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  // Inspeccionamos y transformamos las solicitudes HTTP antes de que se envíen al servidor
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Obtenemos la solicitud HTTP
    let authReq = req;
    // Obtenemos el token del almacenamiento local
    const token = this.tokenService.obtenerToken();

    if (token != null) {
      // Si existe token, clonamos la solicitud HTTP y le añadimos la cabecera con la autorización
      authReq = this.addToken(req, token);
    }

    // Devolvemos la solicitud transformada
    return next.handle(authReq).pipe(catchError((error: HttpErrorResponse) => {
      // Si se ha producido algún error en la solicitud HTTP

      if (error.status === HttpStatusCode.Unauthorized && error.error.path !== APC.API_ENDPOINT + APC.API_URI_AUTH + APC.API_METHOD_SIGNIN) {
        // 401. Si está relacionado con la autenticación o autorización
        console.log(APC.TOKEN_EXPIRADO);

        // Si al caducar la sesión, queremos refrescar el token
        let jwt: any = {};
        jwt.token = this.tokenService.obtenerToken();

        return this.authService.refresh(jwt).pipe(concatMap((data: any) => {
          console.log('Reconectando...');
          this.tokenService.guardarToken(data.token);
          authReq = this.addToken(req, data.token);
          return next.handle(authReq);
        }));

        /*********** Si al caducar la sesión, queremos obligar a que inicie sesión de nuevo
         // Notificamos del error
          this.snackBar.open(APC.TOKEN_EXPIRADO, 'OK', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });

          // Cerramos la sesión del usuario
          setTimeout(() => {
            this.authService.signout();
          }, 2500);

          return throwError(() => new Error(`${error}`));
          */
      } else if (error.status === HttpStatusCode.InternalServerError) {
        // 500. Si está relacionado con un error del servidor
        this.authService.signout();
        return throwError(() => new Error(`${error}`));
      } else {
        return throwError(() => new Error(`${error.error.message[0]}`));
      }
    }));
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ headers: req.headers.set('Authorization', 'Bearer ' + token)});
  }
}
