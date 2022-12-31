import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { EventoDetalleComponent } from '..';
import { ModoEnum } from '../../../../core/enumerates';
import { ItemAccesoDirecto } from '../../../../core/interfaces';
import { EventoService, TokenService } from '../../../../core/services';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsDate } from '../../../../shared/utils';

/**
 * Seguimiento de la aplicación
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá realizar peticiones HTTP de tipo GET, POST, PUT Y DELETE
 * El rol [MODERADOR] podrá realizar peticiones HTTP de tipo GET
 */
@Component({
  selector: 'app-seguimiento',
  templateUrl: './seguimiento.component.html'
})
export class SeguimientoComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributos de autenticación
  esAdministrador: boolean = false;
  esModerador: boolean = false;

  entidadEvento = AC.EVENTO;

  // Atributos de los accesos directos del total de eventos (TOT)
  eventosTOTTotal?: ItemAccesoDirecto;
  eventosTOTFinalizados?: ItemAccesoDirecto;
  eventosTOTPlanificados?: ItemAccesoDirecto;

  // Atributos de los accesos directos de eventos que se celebran hoy (HOY)
  eventosHOYTotal?: ItemAccesoDirecto;
  eventosHOYDirecto?: ItemAccesoDirecto;
  eventosHOYPendientesRevisar?: ItemAccesoDirecto;
  eventosHOYNoVisibles?: ItemAccesoDirecto;

  // Atributos de los accesos directos de eventos que se celebran hoy (MAN)
  eventosMANTotal?: ItemAccesoDirecto;
  eventosMANPendientesRevisar?: ItemAccesoDirecto;
  eventosMANNoVisibles?: ItemAccesoDirecto;

  // Atributos de los accesos directos de eventos pendientes de revisar (PR)
  eventosPRTotal?: ItemAccesoDirecto;
  eventosPRCriticos?: ItemAccesoDirecto;
  eventosPRGraves?: ItemAccesoDirecto;
  eventosPRModerados?: ItemAccesoDirecto;
  eventosPRLeves?: ItemAccesoDirecto;

  // Atributos de los accesos directos de eventos pendientes de duplicar (PD)
  eventosPDTotal?: ItemAccesoDirecto;
  eventosPDCriticos?: ItemAccesoDirecto;
  eventosPDGraves?: ItemAccesoDirecto;
  eventosPDModerados?: ItemAccesoDirecto;
  eventosPDLeves?: ItemAccesoDirecto;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private eveService: EventoService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    // Comprobamos si el usuario posee el rol [ADMINISTRADOR]
    this.esAdministrador = this.tokenService.esAdministrador();
    // Comprobamos si el usuario posee el rol [MODERADOR]
    this.esModerador = this.tokenService.esModerador();

    // Cargamos los accesos directos de eventos
    this.cargarAccesosDirectosEventos();
  }

  // Cargamos los accesos directos de eventos
  cargarAccesosDirectosEventos(): void {
    // Cargamos los accesos directos del total de eventos
    this.cargarAccesosDirectosEventosTotal();

    // Cargamos los accesos directos de los eventos que se celebran hoy
    this.cargarAccesosDirectosEventosHoy();

    // Cargamos los accesos directos de los eventos que se celebran mañana
    this.cargarAccesosDirectosEventosManana();

    // Cargamos los accesos directos de eventos pendientes de revisar
    this.cargarAccesosDirectosEventosPR();

    // Cargamos los accesos directos de eventos pendientes de duplicar
    this.cargarAccesosDirectosEventosPD();
  }

  // Cargamos los accesos directos del total de eventos
  cargarAccesosDirectosEventosTotal(): void {
    // La función forkJoin permite subscribirse a las funciones una vez todas hayan terminado
    forkJoin([
      this.eveService.findTotal(),
      this.eveService.findFinalizados(),
      this.eveService.findPlanificados()
    ]).subscribe(results => {
      // Construimos el acceso directo del total de eventos
      this.eventosTOTTotal = {
        titulo: AC.G_OTR_TOTAL,
        numero: results[0] != null ? results[0].totalItems : 0,
        classNumero: 'primary',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_TODOS
        }
      };

      // Construimos el acceso directo del total de eventos finalizados
      this.eventosTOTFinalizados = {
        titulo: AC.G_EST_FINALIZADOS,
        numero: results[1] != null ? results[1].totalItems : 0,
        classNumero: 'finalizado',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_ANTERIOR,
          fechaInicial: UtilsDate.fechaActualServidor,
          ordenacionAscendente: false
        }
      };

      // Construimos el acceso directo del total de eventos planificados
      this.eventosTOTPlanificados = {
        titulo: AC.G_EST_PLANIFICADOS,
        numero: results[2] != null ? results[2].totalItems : 0,
        classNumero: 'planificado',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_POSTERIOR,
          fechaInicial: UtilsDate.fechaActualServidor
        }
      };
    });
  }

  // Cargamos los accesos directos de los eventos que se celebran hoy
  cargarAccesosDirectosEventosHoy(): void {
    // La función forkJoin permite subscribirse a las funciones una vez todas hayan terminado
    forkJoin([
      this.eveService.findHoyTotal(),
      this.eveService.findHoyDirecto(),
      this.eveService.findHoyNoVisibles(),
      this.eveService.findHoyPendientesRevisar()
    ]).subscribe(results => {
      // Construimos el acceso directo de eventos que se celebran hoy
      this.eventosHOYTotal = {
        titulo: AC.G_OTR_TOTAL,
        numero: results[0] != null ? results[0].totalItems : 0,
        classNumero: 'planificado',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_IGUAL,
          fechaInicial: UtilsDate.fechaActualServidor
        }
      };

      // Construimos el acceso directo de eventos en directo
      this.eventosHOYDirecto = {
        titulo: AC.G_EST_DIRECTO,
        descripcion: 'También se incluyen eventos de ayer que aún no han finalizado.',
        numero: results[1] != null ? results[1].totalItems : 0,
        classNumero: 'directo' + (results[1] != null && results[1].totalItems > 0 ? ' parpadeo-lento' : ''),
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_DIRECTO
        }
      };

      // Construimos el acceso directo de eventos no visibles que se celebran hoy
      this.eventosHOYNoVisibles = {
        titulo: AC.CRIT_NO_VISIBLES,
        numero: results[2] != null ? results[2].totalItems : 0,
        classNumero: 'no-visible',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_IGUAL,
          fechaInicial: UtilsDate.fechaActualServidor,
          isCheckedNoVisibles: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de revisar que se celebran hoy
      this.eventosHOYPendientesRevisar = {
        titulo: AC.CRIT_REVISAR,
        numero: results[3] != null ? results[3].totalItems : 0,
        classNumero: 'revisar',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_IGUAL,
          fechaInicial: UtilsDate.fechaActualServidor,
          isCheckedPendientesRevisar: true
        }
      };
    });
  }

  // Cargamos los accesos directos de los eventos que se celebran mañana
  cargarAccesosDirectosEventosManana(): void {
    // La función forkJoin permite subscribirse a las funciones una vez todas hayan terminado
    forkJoin([
      this.eveService.findMananaTotal(),
      this.eveService.findMananaNoVisibles(),
      this.eveService.findMananaPendientesRevisar()
    ]).subscribe(results => {
      // Construimos el acceso directo de eventos que se celebran mañana
      this.eventosMANTotal = {
        titulo: AC.G_OTR_TOTAL,
        numero: results[0] != null ? results[0].totalItems : 0,
        classNumero: 'planificado',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_IGUAL,
          fechaInicial: UtilsDate.fechaMananaServidor
        }
      };

      // Construimos el acceso directo de eventos no visibles que se celebran mañana
      this.eventosMANNoVisibles = {
        titulo: AC.CRIT_NO_VISIBLES,
        numero: results[1] != null ? results[1].totalItems : 0,
        classNumero: 'no-visible',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_IGUAL,
          fechaInicial: UtilsDate.fechaMananaServidor,
          isCheckedNoVisibles: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de revisar que se celebran mañana
      this.eventosMANPendientesRevisar = {
        titulo: AC.CRIT_REVISAR,
        numero: results[2] != null ? results[2].totalItems : 0,
        classNumero: 'revisar',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_IGUAL,
          fechaInicial: UtilsDate.fechaMananaServidor,
          isCheckedPendientesRevisar: true
        }
      };
    });
  }

  // Cargamos los accesos directos de eventos pendientes de revisar
  cargarAccesosDirectosEventosPR(): void {
    // La función forkJoin permite subscribirse a las funciones una vez todas hayan terminado
    forkJoin([
      this.eveService.findPendientesRevisarTotal(),
      this.eveService.findPendientesRevisarCriticos(),
      this.eveService.findPendientesRevisarGraves(),
      this.eveService.findPendientesRevisarModerados(),
      this.eveService.findPendientesRevisarLeves()
    ]).subscribe(results => {
      // Construimos el acceso directo del total de eventos pendientes de revisar
      this.eventosPRTotal = {
        titulo: AC.G_OTR_TOTAL,
        numero: results[0] != null ? results[0].totalItems : 0,
        classNumero: 'primary',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_TODOS,
          isCheckedPendientesRevisar: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de revisar en estado crítico
      this.eventosPRCriticos = {
        titulo: AC.G_SEV_CRITICOS,
        descripcion: 'Eventos ya finalizados.',
        numero: results[1] != null ? results[1].totalItems : 0,
        classNumero: 'critico',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_ANTERIOR,
          fechaInicial: UtilsDate.fechaPRGraveInicioServidor,
          isCheckedPendientesRevisar: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de revisar en estado grave
      this.eventosPRGraves = {
        titulo: AC.G_SEV_GRAVES,
        descripcion: 'Eventos que se celebran en menos de ' + AC.N_REVISAR_GRAVE + ' días.',
        numero: results[2] != null ? results[2].totalItems : 0,
        classNumero: 'grave',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_ENTRE,
          fechaInicial: UtilsDate.fechaPRGraveInicioServidor,
          fechaFinal: UtilsDate.fechaPRGraveFinServidor,
          isCheckedPendientesRevisar: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de revisar en estado moderado
      this.eventosPRModerados = {
        titulo: AC.G_SEV_MODERADOS,
        descripcion: 'Eventos que se celebran a partir de  ' + AC.N_REVISAR_GRAVE + ' días o antes de ' + AC.N_REVISAR_MODERADA + ' días.',
        numero: results[3] != null ? results[3].totalItems : 0,
        classNumero: 'moderado',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_ENTRE,
          fechaInicial: UtilsDate.fechaPRModeradaInicioServidor,
          fechaFinal: UtilsDate.fechaPRModeradaFinServidor,
          isCheckedPendientesRevisar: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de revisar en estado leve
      this.eventosPRLeves = {
        titulo: AC.G_SEV_LEVES,
        descripcion: 'También se incluyen eventos de ayer que aún no han finalizado.',
        numero: results[4] != null ? results[4].totalItems : 0,
        classNumero: 'leve',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_POSTERIOR,
          fechaInicial: UtilsDate.fechaPRLeveInicioServidor,
          isCheckedPendientesRevisar: true
        }
      };
    });
  }

  // Cargamos los accesos directos de eventos pendientes de duplicar
  cargarAccesosDirectosEventosPD(): void {
    // La función forkJoin permite subscribirse a las funciones una vez todas hayan terminado
    forkJoin([
      this.eveService.findPendientesDuplicarTotal(),
      this.eveService.findPendientesDuplicarCriticos(),
      this.eveService.findPendientesDuplicarGraves(),
      this.eveService.findPendientesDuplicarModerados(),
      this.eveService.findPendientesDuplicarLeves()
    ]).subscribe(results => {
      // Construimos el acceso directo del total de eventos pendientes de duplicar
      this.eventosPDTotal = {
        titulo: AC.G_OTR_TOTAL,
        numero: results[0] != null ? results[0].totalItems : 0,
        classNumero: 'primary',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_TODOS,
          isCheckedPendientesDuplicar: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de duplicar en estado crítico
      this.eventosPDCriticos = {
        titulo: AC.G_SEV_CRITICOS,
        descripcion: 'Eventos padres finalizados hace más de 1 año.',
        numero: results[1] != null ? results[1].totalItems : 0,
        classNumero: 'critico',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_ANTERIOR,
          fechaInicial: UtilsDate.fechaPDGraveInicioServidor,
          isCheckedPendientesDuplicar: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de duplicar en estado grave
      this.eventosPDGraves = {
        titulo: AC.G_SEV_GRAVES,
        descripcion: 'Eventos padres finalizados hace menos de 1 año y más de 6 meses.',
        numero: results[2] != null ? results[2].totalItems : 0,
        classNumero: 'grave',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_ENTRE,
          fechaInicial: UtilsDate.fechaPDGraveInicioServidor,
          fechaFinal: UtilsDate.fechaPDGraveFinServidor,
          isCheckedPendientesDuplicar: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de duplicar en estado moderado
      this.eventosPDModerados = {
        titulo: AC.G_SEV_MODERADOS,
        descripcion: 'Eventos padres finalizados hace menos de 6 meses y más de 1 mes.',
        numero: results[3] != null ? results[3].totalItems : 0,
        classNumero: 'moderado',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_ENTRE,
          fechaInicial: UtilsDate.fechaPDModeradaInicioServidor,
          fechaFinal: UtilsDate.fechaPDModeradaFinServidor,
          isCheckedPendientesDuplicar: true
        }
      };

      // Construimos el acceso directo de eventos pendientes de duplicar en estado leve
      this.eventosPDLeves = {
        titulo: AC.G_SEV_LEVES,
        descripcion: 'Eventos padres finalizados hace menos de 1 mes.',
        numero: results[4] != null ? results[4].totalItems : 0,
        classNumero: 'leve',
        ruta: '/' + AC.ADMINISTRACION_ROUTE + '/' + AC.EVENTOS_ROUTE,
        parametros: {
          tipoBusqueda: AC.L_TIPO_BUSQUEDA_POSTERIOR,
          fechaInicial: UtilsDate.fechaPDLeveInicioServidor,
          isCheckedPendientesDuplicar: true
        }
      };
    });
  }

  /**
   * Método encargado de abrir el dialogo detalle de la entidad pasada por parámetro
   * Siempre se entrará en modo creación
   *
   * @param entidad Entidad que se creará
   */
  irADetalle(entidad: string): void {
    if (entidad != null) {
      let dialogo: any;

      if (entidad == this.entidadEvento) {
        // Abrimos el diálogo de evento en modo creación
        dialogo = this.dialog.open(EventoDetalleComponent, {
          disableClose: true,
          minWidth: '60%',
          data: {
            modo: ModoEnum.CREAR,
            objeto: null,
          }
        });
      }

      // Cuando cerramos el diálogo
      dialogo.afterClosed().subscribe((objetoPersistido: any | null) => {
        if (objetoPersistido != null && objetoPersistido != '') {
          // Construimos la notificación
          const mensaje = entidad + ' creado correctamente';
          // Lanzamos la notificación
          this.snackBar.open(mensaje, 'OK');
          // Actualizamos los accesos directos de la entidad creada
          if (entidad == this.entidadEvento) this.cargarAccesosDirectosEventos();
        }
      });
    }
  }
}
