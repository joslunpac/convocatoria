import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModoEnum } from '../../../../core/enumerates';
import { Caracter, Entidad, ItemOpcion, Titular } from '../../../../core/interfaces';
import { CaracterService, EntidadService, TitularService } from '../../../../core/services';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsChart } from '../../../../shared/utils';

/**
 * Detalle de titular
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá entrar en modo lectura y escritura
 * El rol [MODERADOR] solo podrá entrar en modo lectura
 */
@Component({
  selector: 'app-titular-detalle',
  templateUrl: './titular-detalle.component.html'
})
export class TitularDetalleComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Parámetros recibidos
  modo: string;
  titular: Titular;

  // Atributos del modo
  modoCrear: boolean = false;
  modoVer: boolean = false;
  modoEditar: boolean = false;

  // Atributos de la pantalla
  tituloPagina: string = '';

  // Atributo para el formulario de detalle
  form: FormGroup;

  // Atributos de los selects
  categorias: ItemOpcion[] = [];
  entidades: Entidad[] = [];
  entidadesFiltro: Entidad[] = [];
  caracteres: Caracter[] = [];
  codigoEntidadSeleccionada: String = "";

  constructor(
    public dialogo: MatDialogRef<TitularDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private carService: CaracterService,
    private entService: EntidadService,
    private titService: TitularService
  ) {
    // Inicializamos los parámetros
    this.modo = data.modo;
    this.titular = data.objeto;

    // Inicializamos los atributos del título
    this.tituloPagina = this.modo + ' ' + AC.TITULAR.toLowerCase();

    // Inicializamos los atributos del modo
    if (this.modo == ModoEnum.VER) {
      this.modoVer = true;
      this.codigoEntidadSeleccionada = this.titular.entidad.codigo;
    } else if(this.modo == ModoEnum.CREAR){
      this.modoCrear = true;
    } else {
      this.modoEditar = true;
      this.codigoEntidadSeleccionada = this.titular.entidad.codigo;
    }

    // Si estamos en modo ver, editar o duplicar
    if (!this.modoCrear) {
      // Obtenemos, si existen, todos los carácteres disponibles para el titular en función de su entidad
      if (this.titular.entidad.caracteres != null && this.titular.entidad.caracteres.length > 0) {
        this.caracteres = this.titular.entidad.caracteres;
      }
    }

    // Inicializamos los atributos del formulario de detalle
    this.form = this.formBuilder.group({
      nombre: new FormControl({value: this.modoCrear ? null : this.titular.nombre, disabled: this.modoVer}, [Validators.required, Validators.maxLength(100)]),
      categoria: new FormControl({value: this.modoCrear ? null : this.titular.categoria, disabled: this.modoVer}, [Validators.required, Validators.minLength(1)]),
      orden: new FormControl({value: this.modoCrear ? null : this.titular.orden, disabled: this.modoVer}, [Validators.required, Validators.minLength(1)]),
      entidad: new FormControl({value: this.modoCrear ? null : this.titular.entidad.id, disabled: this.modoVer}, [Validators.required]),
      caracter: new FormControl({value: this.modoCrear ? null : (this.titular.caracter != null ? this.titular.caracter.id : null), disabled: this.modoVer}),
      tieneAvatar: new FormControl({value: this.modoCrear ? false : this.titular.tieneAvatar, disabled: this.modoVer}, [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Construimos la lista de categorías
    this.categorias.push({valor: AC.TITULAR_PRINCIPAL_ACRONIMO, descripcion: AC.TITULAR_PRINCIPAL});
    this.categorias.push({valor: AC.TITULAR_SECUNDARIO_ACRONIMO, descripcion: AC.TITULAR_SECUNDARIO});

    // Obtenemos las listas de los selects
    this.cargarSelects();
  }

  /**
   * Método encargado de cargar las listas de los selects
   */
  cargarSelects(): void {
    // Obtenemos la lista completa de entidades
    this.entService.findAll(true).subscribe((data: Entidad[]) => {
      this.entidades = data;
      this.entidadesFiltro = this.entidades != null ? this.entidades.slice() : [];
    });
  }

  /**
   * Método encargado de comprobar si se cumple una validación
   * Solo se comprueba la validación si es modo Crear o Editar
   *
   * @param campo Campo sobre el que se realiza la validación
   * @param tipoValidacion Tipo de validación que se comprueba
   * @returns
   */
  mostrarValidacion(campo: string, tipoValidacion: string) {
    if (!this.modoVer) {
      return this.form.controls[campo].hasError(tipoValidacion);
    } else {
      return false;
    }
  }

  /**
   * Método encargado de cargar los elementos que dependen de una entidad
   *
   * @param idEntidad Id de la entidad seleccionada
   */
  seleccionarEntidad(idEntidad: number) {
    // Inicializamos los elementos que dependen de una entidad
    this.form.get("caracter")?.setValue(null);
    this.caracteres = [];

    if (idEntidad != undefined) {
      // Recorremos la lista de entidades en busca de la entidad seleccionada
      this.entidades.forEach(entidad => {
        if (entidad.id == idEntidad) {
          // Si encontramos la entidad, establecemos el código
          this.codigoEntidadSeleccionada = entidad.codigo;

          if (entidad.caracteres != null && entidad.caracteres.length > 0) {
            // Cargamos los carácteres disponibles para un titular en función de la entidad seleccionada
            this.caracteres = entidad.caracteres;
          }
        }
      });
    }
  }

  /**
   * Método encargado de persistir un objeto
   */
  guardar(): void {
    const objeto = this.construirObjetoServidor();

    if (this.modoCrear) {
      // Creamos el objeto
      this.titService.create(objeto).subscribe((data: Titular) => {
        // Cerramos el diálogo y devolvemos el objeto persistido
        this.dialogo.close(data);
      });
    } else {
      // Actualizamos el objeto
      this.titService.update(this.titular.id, objeto).subscribe((data: Titular) => {
        // Cerramos el diálogo y devolvemos el objeto persistido
        this.dialogo.close(data);
      });
    }
  }

  /**
   * Método encargado de construir el objeto a enviar al servidor
   */
  construirObjetoServidor(): any {
    let objeto: any = {};

    objeto.nombre = this.form.get('nombre')?.value;
    objeto.categoria = this.form.get('categoria')?.value;
    objeto.orden = this.form.get('orden')?.value;
    objeto.entidad = UtilsChart.construirObjetoConId(this.form.get('entidad')?.value);
    objeto.caracter = UtilsChart.construirObjetoConId(this.form.get('caracter')?.value);
    objeto.tieneAvatar = this.form.get('tieneAvatar')?.value;

    return objeto;
  }
}
