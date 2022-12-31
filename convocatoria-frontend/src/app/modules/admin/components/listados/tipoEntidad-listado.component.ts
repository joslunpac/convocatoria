import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TipoEntidadDetalleComponent } from '..';
import { ModoEnum } from '../../../../core/enumerates';
import { TipoEntidad } from '../../../../core/interfaces';
import { TipoEntidadService, TokenService } from '../../../../core/services';
import { DialogoConfirmacionComponent } from '../../../../shared/components';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsChart } from '../../../../shared/utils';

const ENTIDAD = AC.TIPO_ENTIDAD;
const ENTIDAD_PLURAL = AC.TIPOS_ENTIDAD;

/**
 * Listado de tipos de entidad
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá realizar peticiones HTTP de tipo GET, POST, PUT Y DELETE
 * El rol [MODERADOR] podrá realizar peticiones HTTP de tipo GET
 */
@Component({
  selector: 'app-tipoEntidad-listado',
  templateUrl: './tipoEntidad-listado.component.html',
  styleUrls: ['./tipoEntidad-listado.component.scss'],
})
export class TipoEntidadListadoComponent implements OnInit {
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
      'acronimo',
      'nombreSingular',
      'nombrePlural',
      'ver',
    ];

    if (this.esAdministrador) {
      // Si el usuario posee el rol [ADMINISTRADOR], habilitamos las acciones de persistencia
      this.displayedColumns.push('editar', 'eliminar');
    }

    // Obtenemos el listado completo
    this.obtenerListadoCompleto();
  }

  /**
   * Método encargado de obtener el listado completo
   */
  obtenerListadoCompleto(): void {
    // Construimos la ordenación por la consulta
    const ordenacion = 'nombreSingular, asc';

    this.tenService.findAll(ordenacion).subscribe((data: TipoEntidad[]) => {
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
    this.dataSource.filterPredicate = (data: TipoEntidad, filter: string): boolean => {
      let cadenaAFiltrar = '';

      // Componemos la cadena a filtrar en función de las columnas deseadas
      cadenaAFiltrar += data.acronimo + ' ';
      cadenaAFiltrar += data.nombreSingular + ' ';
      cadenaAFiltrar += data.nombrePlural + ' ';

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
   * Método encargado de abrir el dialogo detalle
   * En función del modo, se podrá crear, ver o editar el objeto
   *
   * @param modo Modo en el que se accede al detalle
   * @param object Objeto que se usará en el detalle
   */
  irADetalle(modo: string = ModoEnum.CREAR, objeto?: TipoEntidad): void {
    // Abrimos el diálogo
    const dialogoDetalle = this.dialog.open(TipoEntidadDetalleComponent, {
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
        const mensaje = ENTIDAD + (modo == ModoEnum.CREAR ? ' creado' : ' editado') + ' correctamente';
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
  eliminar(objeto: TipoEntidad): void {
    // Abrimos el diálogo
    const dialogoEliminar = this.dialog.open(DialogoConfirmacionComponent, {
        data: { mensaje: UtilsChart.construirConfirmacion(ENTIDAD, true) }
    })

    // Cuando cerramos el diálogo
    dialogoEliminar.afterClosed().subscribe((confirmado: Boolean) => {
      if (confirmado) {
        // Si se ha confirmado la eliminación, eliminamos el objeto
        this.tenService.delete(objeto.id).subscribe(() => {
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
