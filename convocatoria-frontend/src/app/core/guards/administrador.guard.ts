import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppConstants as AC } from '../../shared/constants';
import { TokenService } from '../services';

@Injectable()
export class AdministradorGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenService: TokenService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.tokenService.esAdministrador()) {
      // Si el usuario ha iniciado sesión y posee el rol [ADMINISTRADOR], permitimos que navegue a la ruta solicitada
      return true;
    } else {
      // Si el usuario no ha iniciado sesión o no posee el rol [ADMINISTRADOR], navegamos a la ruta de inicio
      return this.router.parseUrl(AC.HOME_ROUTE);
    }
  }
}
