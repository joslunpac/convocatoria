import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PersonaDetalleComponent } from '..';
import { ModoEnum } from '../../../../core/enumerates';
import { Persona } from '../../../../core/interfaces';
import { PersonaService, TokenService } from '../../../../core/services';
import { DialogoConfirmacionComponent } from '../../../../shared/components';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsChart } from '../../../../shared/utils';

const ENTIDAD = AC.PERSONA;
const ENTIDAD_PLURAL = AC.PERSONAS;

/**
 * Listado de personas
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá realizar peticiones HTTP de tipo GET, POST, PUT Y DELETE
 * El rol [MODERADOR] podrá realizar peticiones HTTP de tipo GET
 */
@Component({
  selector: 'app-persona-listado',
  templateUrl: './persona-listado.component.html',
  styleUrls: ['./persona-listado.component.scss'],
})
export class PersonaListadoComponent implements OnInit {
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
  isCheckedMasculino: boolean = true;
  isCheckedFemenino: boolean = true;
  isCheckedSinGenero: boolean = true;

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
    private perService: PersonaService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    // Comprobamos si el usuario posee el rol [ADMINISTRADOR]
    this.esAdministrador = this.tokenService.esAdministrador();
    // Comprobamos si el usuario posee el rol [MODERADOR]
    this.esModerador = this.tokenService.esModerador();

    // Indicamos las columnas que se mostrarán en la tabla
    this.displayedColumns = [
      'id',
      'nombre',
      'profesion',
      'genero',
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
    if (this.isCheckedMasculino || this.isCheckedFemenino || this.isCheckedSinGenero) {
      // Solo realizamos la búsqueda si se especifica como criterio de búsqueda al menos un género

      // Construimos la ordenación por la consulta
      const ordenacion = 'nombre, asc';

      this.perService.findAllByCriteria(
          this.isCheckedMasculino,
          this.isCheckedFemenino,
          this.isCheckedSinGenero,
          ordenacion
        ).subscribe((data: Persona[]) => {
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
    this.dataSource.filterPredicate = (data: Persona, filter: string): boolean => {
      let cadenaAFiltrar = '';

      // Componemos la cadena a filtrar en función de las columnas deseadas
      cadenaAFiltrar += data.nombre + ' ';
      cadenaAFiltrar += data.profesion != null ? data.profesion + ' ' : '';
      cadenaAFiltrar += data.genero + ' ';

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
    if (!this.isCheckedMasculino || !this.isCheckedFemenino || !this.isCheckedSinGenero) return true;
    return false;
  }

  /**
   * Método encargado de reiniciar todos los campos
   */
  limpiarTodo(): void {
    this.isCheckedMasculino = true;
    this.isCheckedFemenino = true;
    this.isCheckedSinGenero = true;

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
   * Método encargado de aplicar los cambios de los conmutadores al filtro de búsqueda
   * y realizar de nuevo la búsqueda
   * @param conmutador Conmutador que se ha cambiado
   */
  cambiarConmutador(conmutador: string): void {
    if (conmutador == AC.GENERO_MASCULINO_ACRONIMO) {
      this.isCheckedMasculino = !this.isCheckedMasculino;
    } else if (conmutador == AC.GENERO_FEMENINO_ACRONIMO) {
      this.isCheckedFemenino = !this.isCheckedFemenino;
    } else if (conmutador == AC.SIN_GENERO_ACRONIMO) {
      this.isCheckedSinGenero = !this.isCheckedSinGenero;
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
  irADetalle(modo: string = ModoEnum.CREAR, objeto?: Persona): void {
    // Abrimos el diálogo
    const dialogoDetalle = this.dialog.open(PersonaDetalleComponent, {
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
  eliminar(objeto: Persona): void {
    // Abrimos el diálogo
    const dialogoEliminar = this.dialog.open(DialogoConfirmacionComponent, {
        data: { mensaje: UtilsChart.construirConfirmacion(ENTIDAD, true) }
    })

    // Cuando cerramos el diálogo
    dialogoEliminar.afterClosed().subscribe((confirmado: Boolean) => {
      if (confirmado) {
        // Si se ha confirmado la eliminación, eliminamos el objeto
        this.perService.delete(objeto.id).subscribe(() => {
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
