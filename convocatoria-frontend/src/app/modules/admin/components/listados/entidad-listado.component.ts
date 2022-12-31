import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { EntidadDetalleComponent } from '..';
import { ModoEnum } from '../../../../core/enumerates';
import { Caracter, Entidad, TipoEntidad } from '../../../../core/interfaces';
import { CaracterService, EntidadService, TipoEntidadService, TokenService } from '../../../../core/services';
import { DialogoConfirmacionComponent } from '../../../../shared/components';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsChart } from '../../../../shared/utils';

const ENTIDAD = AC.ENTIDAD;
const ENTIDAD_PLURAL = AC.ENTIDADES;

/**
 * Listado de entidades
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá realizar peticiones HTTP de tipo GET, POST, PUT Y DELETE
 * El rol [MODERADOR] podrá realizar peticiones HTTP de tipo GET
 */
@Component({
  selector: 'app-entidad-listado',
  templateUrl: './entidad-listado.component.html',
  styleUrls: ['./entidad-listado.component.scss'],
})
export class EntidadListadoComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributos de autenticación
  esAdministrador: boolean = false;
  esModerador: boolean = false;

  // Atributos de la pantalla
  titulo: string = AC.P_LIST_TITULO + ENTIDAD_PLURAL.toLowerCase();
  descripcion: string = AC.P_LIST_DESCRIPCION + ENTIDAD_PLURAL.toLowerCase();

  // Atributo del filtro de búsqueda
  valorFiltroBusqueda: string = '';

  // Atributos de los criterios de búsqueda
  tiposEntidadId: number[] = [];
  tiposEntidad: TipoEntidad[] = [];
  caracteresId: number[] = [];
  caracteres: Caracter[] = [];
  isCheckedNoVisibles: boolean = false;
  isCheckedPendientesRevisar: boolean = false;

  // Atributos de la tabla
  dataSource: any = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: string[] = [];

  // Atributos para el detalle
  modoVer: string = ModoEnum.VER;
  modoEditar: string = ModoEnum.EDITAR;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private carService: CaracterService,
    private entService: EntidadService,
    private tokenService: TokenService,
    private tenService: TipoEntidadService
  ) {}

  ngOnInit(): void {
    // Comprobamos si el usuario posee el rol [ADMINISTRADOR]
    this.esAdministrador = this.tokenService.esAdministrador();
    // Comprobamos si el usuario posee el rol [MODERADOR]
    this.esModerador = this.tokenService.esModerador();

    // Indicamos las columnas que se mostrarán en la tabla
    this.displayedColumns = [
      'id',
      'caracterPrincipal.acronimo',
      'nombreCorto',
      'lugar.nombre',
      'caracteres',
      'visible',
      'pendienteRevisar',
      'ver',
    ];

    if (this.esAdministrador) {
      // Si el usuario posee el rol [ADMINISTRADOR], habilitamos las acciones de persistencia
      this.displayedColumns.push('editar', 'eliminar');
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
  }

  /**
   * Método encargado de obtener el listado completo
   */
  obtenerListadoCompleto(): void {
    if (
      this.tiposEntidadId.length > 0 || // AGR, SED, ORG, BAN
      this.caracteresId.length > 0 // HER
    ) {
      // Solo realizamos la búsqueda si se especifica como criterio de búsqueda al menos un tipo de entidad o un carácter

      // Construimos la ordenación de la consulta
      const ordenacion = 'codigo, asc';

      this.entService.findAllByCriteria(
          this.esAdministrador || this.esModerador, // Si el usuario posee el rol [ADMINISTRADOR] o [MODERADOR], incluimos 'private' en la petición HTTP
          this.tiposEntidadId,
          this.caracteresId,
          this.isCheckedNoVisibles,
          this.isCheckedPendientesRevisar,
          ordenacion
        ).subscribe((data: Entidad[]) => {
        this.dataSource = new MatTableDataSource(data != null ? data : undefined);

        // Aplicamos la paginación al dataSource
        this.dataSource.paginator = this.paginator;

        // Aplicamos la ordenación al dataSource
        this.dataSource.sort = this.sort;

        // Configuramos el dataSource
        this.configurarDataSource();

        // Aplicamos el filtro de búsqueda al dataSource
        this.aplicarFiltroBusqueda();
      });
    } else {
      // Si no se especifica como criterio de búsqueda ningún carácter, inicializamos el dataSource
      this.dataSource = new MatTableDataSource<any>([]);
      // Aplicamos la paginación al dataSource
      this.dataSource.paginator = this.paginator;
    }
  }

  /**
   * Método encargado de aplicar las configuraciones posteriores a la obtención de los datos
   */
  configurarDataSource(): void {
    // Configuramos la ordenación del dataSource, para incluir también los atributos hijos
    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      if (property.includes('.'))
        return property.split('.').reduce((o: any, i: any) => o[i], item);
      return item[property];
    };

    // Configuramos los predicados para el filtro de búsqueda con las columnas deseadas
    this.dataSource.filterPredicate = (data: Entidad, filter: string): boolean => {
      let cadenaAFiltrar = '';

      // Componemos la cadena a filtrar en función de las columnas deseadas
      cadenaAFiltrar += data.nombreCorto + ' ';
      cadenaAFiltrar += data.nombreCortoAux != null ? data.nombreCortoAux + ' ' : '';
      cadenaAFiltrar += data.caracterPrincipal != null ? data.caracterPrincipal.acronimo + ' ' : '';
      cadenaAFiltrar += data.tipoBanda != null ? data.tipoBanda.acronimo + ' ' : '';
      cadenaAFiltrar += data.tipoBanda != null ? data.tipoBanda.nombrePlural + ' ' : '';
      cadenaAFiltrar += data.lugar != null ? data.lugar.nombre + ' ' : '';

      // Formateamos las cadenas antes de aplicar el filtro
      filter = UtilsChart.formatearCadena(filter);
      cadenaAFiltrar = UtilsChart.formatearCadena(cadenaAFiltrar);

      // Comprobamos las coincidencias
      return cadenaAFiltrar.includes(filter);
    };
  }

  ngAfterViewInit() {
    // Configuramos la paginación del dataSource
    this.paginator._intl.itemsPerPageLabel = ENTIDAD_PLURAL + AC.L_POR_PAGINA;
    this.paginator._intl.firstPageLabel = AC.L_PRIMERA_PAGINA;
    this.paginator._intl.previousPageLabel = AC.L_PAGINA_ANTERIOR;
    this.paginator._intl.nextPageLabel = AC.L_PAGINA_SIGUIENTE;
    this.paginator._intl.lastPageLabel = AC.L_ULTIMA_PAGINA;
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el botón de limpiar todo
   *
   * @returns
   */
  mostrarLimpiarTodo(): boolean {
    if (this.tiposEntidadId.length != this.tiposEntidad.length) return true;
    if (this.caracteresId.length != this.caracteres.length) return true;
    if (this.isCheckedNoVisibles) return true;
    if (this.isCheckedPendientesRevisar) return true;
    return false;
  }

  /**
   * Método encargado de reiniciar todos los campos
   */
  limpiarTodo(): void {
    this.tiposEntidadId = [];
    for (const tipoEntidad of this.tiposEntidad) {
      this.tiposEntidadId.push(tipoEntidad.id);
    }

    this.caracteresId = [];
    for (const caracter of this.caracteres) {
      this.caracteresId.push(caracter.id);
    }

    this.isCheckedNoVisibles = false;
    this.isCheckedPendientesRevisar = false;

    // Obtenemos el listado completo
    this.obtenerListadoCompleto();
  }

  /**
   * Método encargado de aplicar el filtro de búsqueda al dataSource
   * También vuelve a la primera página del listado
   */
  aplicarFiltroBusqueda(): void {
    // Aplicamos el filtro de búsqueda al dataSource
    this.dataSource.filter = this.valorFiltroBusqueda;

    if (this.dataSource.paginator) {
      // Si existe paginación, nos colocamos en la primera página
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Método encargado de recoger el valor del filtro de búsqueda y aplicarlo al dataSource
   *
   * @param event
   * @param clear // Indica si hay que borrar el filtro forzosamente
   */
  cambiarFiltroBusqueda(event: Event, clear: boolean = false): void {
    // Obtenemos el valor del campo de filtro
    this.valorFiltroBusqueda = !clear ? (event.target as HTMLInputElement).value : '';

    // Aplicamos el filtro de búsqueda al dataSource
    this.aplicarFiltroBusqueda();
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

    // Obtenemos el listado completo
    this.obtenerListadoCompleto();
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

    // Obtenemos el listado completo
    this.obtenerListadoCompleto();
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
   * Método encargado de aplicar los cambios de los conmutadores al filtro de búsqueda
   * y realizar de nuevo la búsqueda
   * @param conmutador Conmutador que se ha cambiado
   */
  cambiarConmutador(conmutador: string): void {
    if (conmutador == AC.CRIT_NO_VISIBLES) {
      this.isCheckedNoVisibles = !this.isCheckedNoVisibles;
    } else if (conmutador == AC.L_PENDIENTES_REVISAR) {
      this.isCheckedPendientesRevisar = !this.isCheckedPendientesRevisar;
    }

    // Obtenemos el listado completo
    this.obtenerListadoCompleto();
  }

  /**
   * Método encargado de abrir el dialogo detalle
   * En función del modo, se podrá crear, ver o editar el objeto
   *
   * @param modo Modo en el que se accede al detalle
   * @param object Objeto que se usará en el detalle
   */
  irADetalle(modo: string = ModoEnum.CREAR, objeto?: Entidad): void {
    // Abrimos el diálogo
    const dialogoDetalle = this.dialog.open(EntidadDetalleComponent, {
      //disableClose: true,
      minWidth: '40%',
      data: {
        modo: modo,
        objeto: objeto,
      }
    });

    // Cuando cerramos el diálogo
    dialogoDetalle.afterClosed().subscribe(objetoPersistido => {
      if ((objetoPersistido != null && objetoPersistido != '') && (modo == ModoEnum.CREAR || modo == ModoEnum.EDITAR)) {
        // Construimos la notificación
        const mensaje = ENTIDAD + (modo == ModoEnum.CREAR ? ' creada' : ' editada') + ' correctamente';
        // Lanzamos la notificación
        this.snackBar.open(mensaje, 'OK');
        // Obtenemos de nuevo el listado completo
        this.obtenerListadoCompleto();
      }
    });
  }

  /**
   * Método encargado de eliminar un objeto
   *
   * @param objeto Objeto a eliminar
   */
  eliminar(objeto: Entidad): void {
    // Abrimos el diálogo
    const dialogoEliminar = this.dialog.open(DialogoConfirmacionComponent, {
        data: { mensaje: UtilsChart.construirConfirmacion(ENTIDAD, true) }
    })

    // Cuando cerramos el diálogo
    dialogoEliminar.afterClosed().subscribe((confirmado: Boolean) => {
      if (confirmado) {
        // Si se ha confirmado la eliminación, eliminamos el objeto
        this.entService.delete(objeto.id).subscribe(() => {
          // Construimos la notificación
          const mensaje = ENTIDAD + ' eliminada correctamente';
          // Lanzamos la notificación
          this.snackBar.open(mensaje, 'OK');
          // Obtenemos de nuevo el listado completo
          this.obtenerListadoCompleto();
        });
      }
    });
  }
}
