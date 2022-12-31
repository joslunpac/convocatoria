import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin } from 'rxjs';
import { TitularDetalleComponent } from '..';
import { ModoEnum } from '../../../../core/enumerates';
import { Caracter, Titular } from '../../../../core/interfaces';
import { CaracterService, TitularService, TokenService } from '../../../../core/services';
import { DialogoConfirmacionComponent } from '../../../../shared/components';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsChart } from '../../../../shared/utils';

const ENTIDAD = AC.TITULAR;
const ENTIDAD_PLURAL = AC.TITULARES;

/**
 * Listado de titulares
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá realizar peticiones HTTP de tipo GET, POST, PUT Y DELETE
 * El rol [MODERADOR] podrá realizar peticiones HTTP de tipo GET
 */
@Component({
  selector: 'app-titular-listado',
  templateUrl: './titular-listado.component.html',
  styleUrls: ['./titular-listado.component.scss'],
})
export class TitularListadoComponent implements OnInit {
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
  isCheckedSAC: boolean = true;
  isCheckedGLO: boolean = true;
  isCheckedPEN: boolean = true;
  caracteresId: number[] = [];
  caracteres: Caracter[] = [];
  isCheckedSIN_CARACTER: boolean = true;

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
    private tokenService: TokenService,
    private titService: TitularService
  ) {}

  ngOnInit(): void {
    // Comprobamos si el usuario posee el rol [ADMINISTRADOR]
    this.esAdministrador = this.tokenService.esAdministrador();
    // Comprobamos si el usuario posee el rol [MODERADOR]
    this.esModerador = this.tokenService.esModerador();

    // Indicamos las columnas que se mostrarán en la tabla
    this.displayedColumns = [
      'id',
      'caracter.acronimo',
      'nombre',
      'categoria',
      'orden',
      'entidad.nombreCorto',
      'ver',
    ];

    if (this.esAdministrador) {
      // Si el usuario posee el rol [ADMINISTRADOR], habilitamos las acciones de persistencia
      this.displayedColumns.push('editar', 'eliminar');
    }

    // La función forkJoin permite subscribirse a las funciones una vez todas hayan terminado
    forkJoin([
      this.carService.findAll()
    ]).subscribe(results => {
      this.caracteres = results[0];
      // Obtenemos todos los identificacores de los carácteres
      for (const caracter of this.caracteres) {
        this.caracteresId.push(caracter.id);
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
      this.caracteresId.length > 0 || // HER
      this.isCheckedSIN_CARACTER
    ) {
      // Solo realizamos la búsqueda si se especifica como criterio de búsqueda al menos un carácter

      // Construimos la ordenación por la consulta
      const ordenacion = 'entidad.codigo, asc, orden, asc';

      this.titService.findAllByCriteria(
          this.caracteresId,
          this.isCheckedSIN_CARACTER,
          ordenacion
        ).subscribe((data: Titular[]) => {
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
    this.dataSource.filterPredicate = (data: Titular, filter: string): boolean => {
      let cadenaAFiltrar = '';

      // Componemos la cadena a filtrar en función de las columnas deseadas
      cadenaAFiltrar += data.nombre + ' ';
      cadenaAFiltrar += data.categoria + ' ';
      cadenaAFiltrar += data.orden + ' ';
      cadenaAFiltrar += data.entidad.nombreCorto + ' ';
      cadenaAFiltrar += data.entidad.nombreCortoAux != null ? data.entidad.nombreCortoAux + ' ' : '';
      cadenaAFiltrar += data.caracter != null ? data.caracter.acronimo + ' ' : '';

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
    if (this.caracteresId.length != this.caracteres.length) return true;
    if (!this.isCheckedSIN_CARACTER) return true;
    return false;
  }

  /**
   * Método encargado de reiniciar todos los campos
   */
  limpiarTodo(): void {
    this.caracteresId = [];
    for (const caracter of this.caracteres) {
      this.caracteresId.push(caracter.id);
    }

    this.isCheckedSIN_CARACTER = true;

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
   * Método encargado de construir el array de ids de carácteres
   * @param idCaracter Identificador del carácter
   */
  cambiarCaracter(idCaracter: number | null): void {
    if (idCaracter != null) {
      const indexCaracterId = this.caracteresId.findIndex((object) => {
        return object === idCaracter;
      });

      if (indexCaracterId !== -1) {
        this.caracteresId.splice(indexCaracterId, 1);
      } else {
        this.caracteresId.push(idCaracter);
      }
    } else {
      this.isCheckedSIN_CARACTER = !this.isCheckedSIN_CARACTER;
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
   * Método encargado de abrir el dialogo detalle
   * En función del modo, se podrá crear, ver o editar el objeto
   *
   * @param modo Modo en el que se accede al detalle
   * @param object Objeto que se usará en el detalle
   */
  irADetalle(modo: string = ModoEnum.CREAR, objeto?: Titular): void {
    // Abrimos el diálogo
    const dialogoDetalle = this.dialog.open(TitularDetalleComponent, {
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
  eliminar(objeto: Titular): void {
    // Abrimos el diálogo
    const dialogoEliminar = this.dialog.open(DialogoConfirmacionComponent, {
        data: { mensaje: UtilsChart.construirConfirmacion(ENTIDAD, true) }
    })

    // Cuando cerramos el diálogo
    dialogoEliminar.afterClosed().subscribe((confirmado: Boolean) => {
      if (confirmado) {
        // Si se ha confirmado la eliminación, eliminamos el objeto
        this.titService.delete(objeto.id).subscribe(() => {
          // Construimos la notificación
          const mensaje = ENTIDAD + ' eliminado correctamente';
          // Lanzamos la notificación
          this.snackBar.open(mensaje, 'OK');
          // Obtenemos de nuevo el listado completo
          this.obtenerListadoCompleto();
        });
      }
    });
  }
}
