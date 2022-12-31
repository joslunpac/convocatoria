import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DialogoConfirmacionEventosComponent, EventoDetalleComponent } from '..';
import { ModoEnum } from '../../../../core/enumerates';
import {
  Caracter, Entidad, Evento, ItemOpcion, Lugar, Persona,
  ResultadoEventos, TipoActoCulto, TipoEntidad, Titular
} from '../../../../core/interfaces';
import {
  CaracterService, EntidadService, EventoService, LugarService,
  PersonaService, TipoActoCultoService, TipoEntidadService,
  TitularService, TokenService
} from '../../../../core/services';
import { DialogoConfirmacionComponent } from '../../../../shared/components';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsChart, UtilsDate } from '../../../../shared/utils';

const ENTIDAD = AC.EVENTO;
const ENTIDAD_PLURAL = AC.EVENTOS;

/**
 * Listado de eventos
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá realizar peticiones HTTP de tipo GET, POST, PUT Y DELETE
 * El rol [MODERADOR] podrá realizar peticiones HTTP de tipo GET
 */
@Component({
  selector: 'app-evento-listado',
  templateUrl: './evento-listado.component.html',
  styleUrls: ['./evento-listado.component.scss'],
})
export class EventoListadoComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributos de autenticación
  esAdministrador: boolean = false;
  esModerador: boolean = false;

  // Atributo para usar los métodos útiles en la vista
  utilsDate = UtilsDate;

  // Atributos de la pantalla
  titulo: string = AC.P_LIST_TITULO + ENTIDAD_PLURAL.toLowerCase();
  descripcion: string = AC.P_LIST_DESCRIPCION + ENTIDAD_PLURAL.toLowerCase();

  // Atributos de los filtros de búsqueda
  tipoBusqueda: string | null;
  ordenacionAscendente: boolean = true;
  fechaInicial: string | null;
  fechaFinal: string | null;
  idTipoActoCulto: number | undefined;
  idEntidadOrganizadora: number | undefined;
  idTitular: number | undefined;
  idPersona: number | undefined;
  idLugar: number | undefined;
  tiposEntidadId: number[] = [];
  tiposEntidad: TipoEntidad[] = [];
  caracteresId: number[] = [];
  caracteres: Caracter[] = [];
  isCheckedNoVisibles: boolean = false;
  isCheckedAplazados: boolean = false;
  isCheckedSuspendidos: boolean = false;
  isCheckedExtraordinarios: boolean = false;
  isCheckedPendientesRevisar: boolean = false;
  isCheckedPendientesDuplicar: boolean = false;

  // Atributos de los selects
  tiposBusqueda: ItemOpcion[] = [];
  tiposActoCulto: TipoActoCulto[] = [];
  tiposActoCultoFiltro: TipoActoCulto[] = [];
  entidades: Entidad[] = [];
  entidadesFiltro: Entidad[] = [];
  titulares: Titular[] = [];
  titularesFiltro: Titular[] = [];
  personas: Persona[] = [];
  personasFiltro: Persona[] = [];
  lugares: Lugar[] = [];
  lugaresFiltro: Lugar[] = [];

  // Atributos de la tabla y la paginación
  dataSource: any = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  displayedColumns: string[] = [];
  totalItems = 0;
  currentPage = 0;
  pageSize = 5;
  mostrarCargando = false;

  // Atributos para el detalle
  modoVer: string = ModoEnum.VER;
  modoEditar: string = ModoEnum.EDITAR;
  modoDuplicar: string = ModoEnum.DUPLICAR;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private carService: CaracterService,
    private entService: EntidadService,
    private eveService: EventoService,
    private lugService: LugarService,
    private perService: PersonaService,
    private tokenService: TokenService,
    private tacService: TipoActoCultoService,
    private tenService: TipoEntidadService,
    private titService: TitularService
  ) {
    // Comprobamos si se ha recibido algún parámetro de consulta

    // Si recibimos por parámetro un tipo de búsqueda, lo usamos, de lo contrario,
    // establecemos el tipo de búsqueda POSTERIOR para buscar eventos a partir de hoy
    const tipoBusquedaParam = this.activatedRoute.snapshot.queryParamMap.get('tipoBusqueda')
    this.tipoBusqueda = tipoBusquedaParam != null ? tipoBusquedaParam : AC.L_TIPO_BUSQUEDA_POSTERIOR;

    const ordenacionAscendenteParam = this.activatedRoute.snapshot.queryParamMap.get('ordenacionAscendente');
    this.ordenacionAscendente = ordenacionAscendenteParam ? ordenacionAscendenteParam.toLocaleLowerCase() === 'true' : true;

    // Si recibimos por parámetro una fecha inicial, la usamos, de lo contrario,
    // establecemos la fecha inicial en el día de hoy para buscar eventos a partir de hoy
    const fechaInicialParam = this.activatedRoute.snapshot.queryParamMap.get('fechaInicial')
    this.fechaInicial = fechaInicialParam != null ? fechaInicialParam : UtilsDate.fechaActualServidor;

    const fechaFinalParam = this.activatedRoute.snapshot.queryParamMap.get('fechaFinal');
    this.fechaFinal = fechaFinalParam;

    const noVisibleParam = this.activatedRoute.snapshot.queryParamMap.get('isCheckedNoVisibles');
    this.isCheckedNoVisibles = noVisibleParam ? noVisibleParam.toLocaleLowerCase() === 'true' : false;

    const revisarParam = this.activatedRoute.snapshot.queryParamMap.get('isCheckedPendientesRevisar');
    this.isCheckedPendientesRevisar = revisarParam ? revisarParam.toLocaleLowerCase() === 'true' : false;

    const duplicarParam = this.activatedRoute.snapshot.queryParamMap.get('isCheckedPendientesDuplicar');
    this.isCheckedPendientesDuplicar = duplicarParam ? duplicarParam.toLocaleLowerCase() === 'true' : false;

    if (this.isCheckedPendientesDuplicar) {
      // Si viene marcado el check de pendientes de duplicar, preparamos el formulario de búsqueda para
      // ver los eventos pendientes de duplicar
      this.cambiarDuplicar();
    }
  }

  ngOnInit(): void {
    // Comprobamos si el usuario posee el rol [ADMINISTRADOR]
    this.esAdministrador = this.tokenService.esAdministrador();
    // Comprobamos si el usuario posee el rol [MODERADOR]
    this.esModerador = this.tokenService.esModerador();

    // Indicamos las columnas que se mostrarán en la tabla
    this.displayedColumns = [
      'id',
      'fecha',
      'hora',
      'caracter',
      'entidadOrganizadora',
      'tipoActoCulto',
      'titular',
      'estado',
      'visible',
      'extraordinario',
      'pendienteRevisar',
      'ver',
    ];

    if (this.esAdministrador) {
      // Si el usuario posee el rol [ADMINISTRADOR], habilitamos las acciones de persistencia
      this.displayedColumns.push('editar', 'duplicar', 'eliminar');
    }

    // La función forkJoin permite subscribirse a las funciones una vez todas hayan terminado
    forkJoin([
      this.tenService.findAll(),
      this.carService.findAll()
    ]).subscribe(results => {
      if (results[0] != null) {
        const tiposEntidadTodos = results[0];

        // Descartamos el tipo de entidad HER
        tiposEntidadTodos.forEach(tipoEntidad => {
          if (tipoEntidad.acronimo != 'HER') this.tiposEntidad.push(tipoEntidad);
        });

        // Obtenemos todos los identificacores de los tipos de entidad
        for (const tipoEntidad of this.tiposEntidad) {
          this.tiposEntidadId.push(tipoEntidad.id);
        }
      }

      if (results[1] != null) {
        this.caracteres = results[1];

        // Obtenemos todos los identificacores de los carácteres
        for (const caracter of this.caracteres) {
          this.caracteresId.push(caracter.id);
        }
      }

      // Obtenemos el listado completo
      this.obtenerListadoCompleto();
    });

    // Obtenemos las listas de los selects
    this.cargarSelects();
  }

  /**
   * Método encargado de obtener el listado completo
   */
  obtenerListadoCompleto(desdePrincipio: boolean = true): void {
    if (
      this.tiposEntidadId.length > 0 || // AGR, SED, ORG, BAN
      this.caracteresId.length > 0 // HER
    ) {
      // Solo realizamos la búsqueda si se especifica como criterio de búsqueda al menos un tipo de entidad o un carácter

      // Mostramos el cargando
      this.mostrarCargando = true;

      // Realizamos las comprobaciones previas a la búsqueda
      if (desdePrincipio) this.currentPage = 0;

      this.eveService.findAllByCriteria(
          this.esAdministrador || this.esModerador, // Si el usuario posee el rol [ADMINISTRADOR] o [MODERADOR], incluimos 'private' en la petición HTTP
          this.tipoBusqueda,
          this.fechaInicial,
          this.fechaFinal,
          this.idTipoActoCulto,
          this.idEntidadOrganizadora,
          this.idTitular,
          this.idPersona,
          this.idLugar,
          this.tiposEntidadId,
          this.caracteresId,
          this.isCheckedNoVisibles,
          this.isCheckedAplazados,
          this.isCheckedSuspendidos,
          this.isCheckedExtraordinarios,
          this.isCheckedPendientesRevisar,
          this.isCheckedPendientesDuplicar,
          this.currentPage,
          this.pageSize,
          this.ordenacionAscendente ? 'fecha, asc, horaIni1, asc' : 'fecha, desc, horaIni1, desc'
      ).subscribe({
        next: (data: ResultadoEventos) => {
          this.dataSource = new MatTableDataSource(data != null ? data.items : undefined);
          this.paginator.pageIndex = this.currentPage;
          this.paginator.length = data != null ? data.totalItems : 0;

          // Ocultamos el cargando
          this.mostrarCargando = false;
        },
        error: (error) => {
          // Notificamos del error
          this.snackBar.open(error, 'OK', {
            horizontalPosition: 'left',
            verticalPosition: 'bottom',
          });

          // Ocultamos el cargando
          this.mostrarCargando = false;
        }
      });
    } else {
      // Si no se especifica como criterio de búsqueda ningún carácter

      // Inicializamos el dataSource
      this.dataSource = new MatTableDataSource<any>([]);
      // Inicializamos la paginación
      this.paginator.pageIndex = 0;
      this.paginator.length = 0;
    }
  }

  /**
   * Método encargado de cargar las listas de los selects
   */
  cargarSelects(): void {
    // Construimos la lista de tipos de búsqueda
    this.tiposBusqueda.push({valor: AC.L_TIPO_BUSQUEDA_TODOS, descripcion: AC.L_TIPO_BUSQUEDA_TODOS});
    this.tiposBusqueda.push({valor: AC.L_TIPO_BUSQUEDA_DIRECTO, descripcion: AC.L_TIPO_BUSQUEDA_DIRECTO});
    this.tiposBusqueda.push({valor: AC.L_TIPO_BUSQUEDA_IGUAL, descripcion: AC.L_TIPO_BUSQUEDA_IGUAL});
    this.tiposBusqueda.push({valor: AC.L_TIPO_BUSQUEDA_ANTERIOR, descripcion: AC.L_TIPO_BUSQUEDA_ANTERIOR});
    this.tiposBusqueda.push({valor: AC.L_TIPO_BUSQUEDA_POSTERIOR, descripcion: AC.L_TIPO_BUSQUEDA_POSTERIOR});
    this.tiposBusqueda.push({valor: AC.L_TIPO_BUSQUEDA_ENTRE, descripcion: AC.L_TIPO_BUSQUEDA_ENTRE});

    // Obtenemos la lista completa de tipos de acto o culto
    this.tacService.findAll().subscribe((data: TipoActoCulto[]) => {
      this.tiposActoCulto = data;
      this.tiposActoCultoFiltro = this.tiposActoCulto != null ? this.tiposActoCulto.slice() : [];
    });

    // Obtenemos la lista completa de entidades
    this.entService.findAll(true).subscribe((data: Entidad[]) => {
      this.entidades = data;
      this.entidadesFiltro = this.entidades != null ? this.entidades.slice() : [];
    });

    // Obtenemos la lista completa de titulares
    this.titService.findAll().subscribe((data: Titular[]) => {
      this.titulares = data;
      this.titularesFiltro = this.titulares != null ? this.titulares.slice() : [];
    });

    // Obtenemos la lista completa de personas
    this.perService.findAll().subscribe((data: Persona[]) => {
      this.personas = data;
      this.personasFiltro = this.personas != null ? this.personas.slice() : [];
    });

    // Obtenemos la lista completa de lugares
    this.lugService.findAll().subscribe((data: Lugar[]) => {
      this.lugares = data;
      this.lugaresFiltro = this.lugares != null ? this.lugares.slice() : [];
    });
  }

  ngAfterViewInit() {
    // Configuramos la paginación del dataSource
    this.paginator._intl.itemsPerPageLabel = ENTIDAD_PLURAL + AC.L_POR_PAGINA;
    this.paginator._intl.firstPageLabel = AC.L_PRIMERA_PAGINA;
    this.paginator._intl.previousPageLabel = AC.L_PAGINA_ANTERIOR;
    this.paginator._intl.nextPageLabel = AC.L_PAGINA_SIGUIENTE;
    this.paginator._intl.lastPageLabel = AC.L_ULTIMA_PAGINA;
    // Aplicamos la paginación al dataSource
    this.dataSource.paginator = this.paginator;
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el botón de limpiar todo
   *
   * @returns
   */
  mostrarLimpiarTodo(): boolean {
    if (this.tipoBusqueda != AC.L_TIPO_BUSQUEDA_TODOS) return true;
    if (!this.ordenacionAscendente) return true;
    if (this.fechaInicial != null) return true;
    if (this.fechaFinal != null) return true;
    if (this.idTipoActoCulto != undefined) return true;
    if (this.idEntidadOrganizadora != undefined) return true;
    if (this.idTitular != undefined) return true;
    if (this.idPersona != undefined) return true;
    if (this.idLugar != undefined) return true;
    if (this.tiposEntidadId.length != this.tiposEntidad.length) return true;
    if (this.caracteresId.length != this.caracteres.length) return true;
    if (this.isCheckedNoVisibles) return true;
    if (this.isCheckedAplazados) return true;
    if (this.isCheckedSuspendidos) return true;
    if (this.isCheckedExtraordinarios) return true;
    if (this.isCheckedPendientesRevisar) return true;
    if (this.isCheckedPendientesDuplicar) return true;
    return false;
  }

  /**
   * Método encargado de reiniciar todos los campos
   */
  limpiarTodo(): void {
    this.tipoBusqueda = AC.L_TIPO_BUSQUEDA_TODOS;
    this.ordenacionAscendente = true;
    this.fechaInicial = null;
    this.fechaFinal = null;
    this.idTipoActoCulto = undefined;
    this.idEntidadOrganizadora = undefined;
    this.idTitular = undefined;
    this.idPersona = undefined;
    this.idLugar = undefined;

    this.tiposEntidadId = [];
    for (const tipoEntidad of this.tiposEntidad) {
      this.tiposEntidadId.push(tipoEntidad.id);
    }

    this.caracteresId = [];
    for (const caracter of this.caracteres) {
      this.caracteresId.push(caracter.id);
    }

    this.isCheckedNoVisibles = false;
    this.isCheckedAplazados = false;
    this.isCheckedSuspendidos = false;
    this.isCheckedExtraordinarios = false;
    this.isCheckedPendientesRevisar = false;
    this.isCheckedPendientesDuplicar = false;
  }

  /**
   * Método encargado de preparar el formulario de búsqueda para
   * ver los eventos en directo
   */
  cambiarTipoBusqueda(): void {
    if (this.tipoBusqueda == AC.L_TIPO_BUSQUEDA_DIRECTO) {
      this.isCheckedAplazados = false;
      this.isCheckedSuspendidos = false;
      this.isCheckedPendientesDuplicar = false;
    }
  }

  /**
   * Método encargado de construir el array de ids de tipos de entidad
   * @param idTipoEntidad Identificador del tipo de entidad
   */
  cambiarTipoEntidad(idTipoEntidad: number): void {
    const indexTipoEntidadId = this.tiposEntidadId.findIndex((object) => {
      return object === idTipoEntidad;
    });

    if (indexTipoEntidadId !== -1) {
      this.tiposEntidadId.splice(indexTipoEntidadId, 1);
    } else {
      this.tiposEntidadId.push(idTipoEntidad);
    }
  }

  /**
   * Método encargado de indicar si hay que activar o no un filtro de tipo de entidad
   * @param idTipoEntidad Identificador del tipo de entidad
   */
  contieneTipoEntidad(idTipoEntidad: number): boolean {
    const indexTipoEntidadId = this.tiposEntidadId.findIndex((object) => {
      return object === idTipoEntidad;
    });

    if (indexTipoEntidadId !== -1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de construir el array de ids de carácteres
   * @param idCaracter Identificador del carácter
   */
  cambiarCaracter(idCaracter: number): void {
    const indexCaracterId = this.caracteresId.findIndex((object) => {
      return object === idCaracter;
    });

    if (indexCaracterId !== -1) {
      this.caracteresId.splice(indexCaracterId, 1);
    } else {
      this.caracteresId.push(idCaracter);
    }
  }

  /**
   * Método encargado de indicar si hay que activar o no un filtro de carácter
   * @param idCaracter Identificador del carácter
   */
  contieneCaracter(idCaracter: number): boolean {
    const indexCaracterId = this.caracteresId.findIndex((object) => {
      return object === idCaracter;
    });

    if (indexCaracterId !== -1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de preparar el formulario de búsqueda para
   * ver los eventos pendientes de duplicar
   */
  cambiarDuplicar(): void {
    this.isCheckedPendientesDuplicar = !this.isCheckedPendientesDuplicar;

    if (this.isCheckedPendientesDuplicar) {
      this.isCheckedNoVisibles = false;
      this.isCheckedAplazados = false;
      this.isCheckedSuspendidos = false;
      this.isCheckedExtraordinarios = false;
      this.isCheckedPendientesRevisar = false;
    }
  }

  /**
   * Método encargado de obtener de nuevo el listado completo
   * en función del número de items por página y la página actual
   *
   * @param event Objeto de paginación
   */
  cambiarPaginacion(event: PageEvent): void {
    // Obtenemos de la paginación los valores necesarios para la búsqueda
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;

    // Obtenemos de nuevo el listado completo
    this.obtenerListadoCompleto(false);
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el icono de revisar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  mostrarIconoVisible(evento: Evento): boolean {
    return this.eveService.mostrarIconoVisible(evento);
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el icono de revisar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  mostrarIconoRevisar(evento: Evento): boolean {
    return this.eveService.mostrarIconoRevisar(evento);
  }

  /**
   * Método encargado de comprobar si se revisa un evento porque esté marcado
   * como pendiente de revisar, o porque falte la regla
   *
   * @param evento Evento a comprobar
   * @returns
   */
  obtenerTipoRevisar(evento: Evento): boolean {
    return this.eveService.obtenerTipoRevisar(evento);
  }

  /**
   * Método encargado de obtener la severidad de un evento pendiente de revisar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  obtenerSeveridadRevisar(evento: Evento): string {
    return this.eveService.obtenerSeveridadRevisar(evento);
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el botón de duplicar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  mostrarIconoDuplicar(evento: Evento): boolean {
    return this.eveService.mostrarIconoDuplicar(evento);
  }

  /**
   * Método encargado de obtener la severidad de un evento pendiente de duplicar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  obtenerSeveridadDuplicar(evento: Evento): string {
    return this.eveService.obtenerSeveridadDuplicar(evento);
  }

  /**
   * Método encargado de abrir el dialogo detalle
   * En función del modo, se podrá crear, ver o editar o duplicar el objeto
   *
   * @param modo Modo en el que se accede al detalle
   * @param object Objeto que se usará en el detalle
   */
  irADetalle(modo: string = ModoEnum.CREAR, objeto?: Evento): void {
    // Abrimos el diálogo
    const dialogoDetalle = this.dialog.open(EventoDetalleComponent, {
      disableClose: true,
      minWidth: '60%',
      data: {
        modo: modo,
        objeto: objeto,
      }
    });

    // Cuando cerramos el diálogo
    dialogoDetalle.afterClosed().subscribe(objetoPersistido => {
      if ((objetoPersistido != null && objetoPersistido != '') && (modo == ModoEnum.CREAR || modo == ModoEnum.EDITAR || modo == ModoEnum.DUPLICAR)) {
        // Construimos la notificación
        const mensaje = ENTIDAD + (modo == ModoEnum.CREAR ? ' creado' : modo == ModoEnum.DUPLICAR ? ' duplicado' : ' editado') + ' correctamente';
        // Lanzamos la notificación
        this.snackBar.open(mensaje, 'OK');
        // Obtenemos de nuevo el listado completo
        this.obtenerListadoCompleto(false);
      }
    });
  }

  /**
   * Método encargado de eliminar un objeto
   *
   * @param objeto Objeto a eliminar
   */
  eliminar(objeto: Evento): void {
    if (objeto.eventoPadre != null) {
      // Si el evento tiene padre
      this.eliminarEventoConRelacionados(objeto);
    } else {
      // Si el evento no tiene padre

      // Comprobamos si tiene eventos hijos
      this.eveService.countHijos(objeto.id).subscribe((numHijos: number) => {
        if (numHijos > 0) {
          // Si tiene eventos hijos
          this.eliminarEventoConRelacionados(objeto);
        } else {
          // Si no tiene eventos hijos
          this.eliminarEventoUnico(objeto);
        }
      });
    }
  }

  /**
   * Método encargado de eliminar sólo el evento seleccionado, tenga o no eventos relacionados
   *
   * @param evento Evento a eliminar
   */
  private eliminarEventoUnico(evento: Evento) {
    const dialogoEliminar = this.dialog.open(DialogoConfirmacionComponent, {
      data: { mensaje: UtilsChart.construirConfirmacion(ENTIDAD, true) }
    })

    dialogoEliminar.afterClosed().subscribe((confirmado: Boolean) => {
      if (confirmado) {
        // Si se ha confirmado la eliminación, eliminamos el evento seleccionado
        this.eveService.delete(evento.id).subscribe(() => {
          // Construimos la notificación
          const mensaje = ENTIDAD + ' eliminado correctamente';
          // Lanzamos la notificación
          this.snackBar.open(mensaje, 'OK');
          // Obtenemos de nuevo el listado completo
          this.obtenerListadoCompleto(false);
        });
      }
    });
  }

  /**
   * Método encargado de eliminar evento seleccionado y el resto de eventos relacionados
   *
   * @param evento Evento a eliminar
   */
  private eliminarEventoConRelacionados(evento: Evento) {
    // Si el evento no es padre, preguntamos qué quiere eliminar, si sólo el evento seleccionado, o también el resto de eventos relacionados
    // Si el evento es padre, preguntamos si quiere eliminar también el resto de eventos relacionados
    const dialogoConfirmacionPregunta = this.dialog.open(DialogoConfirmacionEventosComponent, {
      data: {
        mensaje: evento.eventoPadre == null
          ? 'Este evento es el primero de un acto o culto con otros eventos relacionados, ¿desea eliminarlos todos?'
          : 'Este evento pertenece a un acto o culto con otros eventos relacionados, ¿qué desea eliminar?',
        esPadre: evento.eventoPadre == null,
      }
    })

    dialogoConfirmacionPregunta.afterClosed().subscribe((tipoEliminacion: string) => {
      if (tipoEliminacion == 'S') {
        // Si sólo se quiere eliminar el evento seleccionado
        this.eliminarEventoUnico(evento);
      } else if (tipoEliminacion == 'T') {
        // Si se quieren eliminar todos los eventos relacionados
        const dialogoEliminar = this.dialog.open(DialogoConfirmacionComponent, {
          data: { mensaje: '¿Seguro que desea eliminar el evento y todos los relacionados?' }
        })

        dialogoEliminar.afterClosed().subscribe((confirmado: Boolean) => {
          if (confirmado) {
            // Si se ha confirmado la eliminación, eliminamos los eventos
            this.eveService.deleteAllByEventoPadreId(evento.eventoPadre != null ? evento.eventoPadre.id : evento.id).subscribe(() => {
              // Construimos la notificación
              const mensaje = ENTIDAD_PLURAL + ' eliminados correctamente';
              // Lanzamos la notificación
              this.snackBar.open(mensaje, 'OK');
              // Obtenemos de nuevo el listado completo
              this.obtenerListadoCompleto(false);
            });
          }
        });
      }
    });
  }
}
