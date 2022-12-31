import { Component, OnInit } from '@angular/core';
import { AppConstants as AC } from '../../../shared/constants';
import { ItemMenu } from '../../interfaces';
import { AuthService, TemaService, TokenService } from '../../services';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributos de autenticación
  estaLogado: boolean = false;
  esAdministrador: boolean = false;
  esModerador: boolean = false;

  // Atributos de los menús
  menuComun: ItemMenu = { visible: false };
  menuAdmin: ItemMenu = { visible: false };

  constructor(
    protected authService: AuthService,
    protected temaService: TemaService,
    protected tokenService: TokenService
  ) {
    // Comprobamos si el usuario ha iniciado sesión
    this.estaLogado = this.tokenService.estaLogado();

    if (this.estaLogado) {
      // Comprobamos si el usuario posee el rol [ADMINISTRADOR]
      this.esAdministrador = this.tokenService.esAdministrador();
      // Comprobamos si el usuario posee el rol [MODERADOR]
      this.esModerador = this.tokenService.esModerador();
    }
  }

  ngOnInit(): void {
    // Aplicamos el tema oscuro a los componentes que se representan en un contenedor de superposición
    this.temaService.aplicarTemaOscuroAOtrosComponentes();

    // Cargamos los menús de la aplicación
    this.cargarMenus();
  }

  // Cargamos los menús correspondientes en función de los roles del usuario
  cargarMenus(): void {
    // Construimos el menú común
    this.menuComun = {
      separador: true,
      menus: [
        {
          ruta: AC.HOME_ROUTE,
          nombre: AC.HOME,
          visible: true
        }
      ],
      visible: true,
    };

    // Si el usuario ha iniciado sesión y posee el rol [ADMINISTRADOR] o [MODERADOR],
    // construimos el menú de administración
    this.menuAdmin = {
      nombre: AC.ADMINISTRACION,
      separador: true,
      menus: [
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.SEGUIMIENTO_ROUTE,
          nombre: AC.SEGUIMIENTO,
          icono: AC.SEGUIMIENTO_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
          nombre: AC.EVENTOS,
          icono: AC.EVENTO_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.TIPOS_ACTO_CULTO_ROUTE,
          nombre: AC.TIPOS_ACTO_CULTO,
          icono: AC.TIPO_ACTO_CULTO_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.ENTIDADES_ROUTE,
          nombre: AC.ENTIDADES,
          icono: AC.ENTIDAD_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.TITULARES_ROUTE,
          nombre: AC.TITULARES,
          icono: AC.TITULAR_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.CARACTERES_ROUTE,
          nombre: AC.CARACTERES,
          icono: AC.CARACTER_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.PERSONAS_ROUTE,
          nombre: AC.PERSONAS,
          icono: AC.PERSONA_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.LUGARES_ROUTE,
          nombre: AC.LUGARES,
          icono: AC.LUGAR_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.TIPOS_BANDA_ROUTE,
          nombre: AC.TIPOS_BANDA,
          icono: AC.TIPO_BANDA_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.TIPOS_ENTIDAD_ROUTE,
          nombre: AC.TIPOS_ENTIDAD,
          icono: AC.TIPO_ENTIDAD_ICONO,
          visible: true
        },
        {
          ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.USUARIOS_ROUTE,
          nombre: AC.USUARIOS,
          icono: AC.USUARIO_ICONO,
          visible: this.esAdministrador
        },
      ],
      visible: this.esAdministrador || this.esModerador,
    };
  }
}
