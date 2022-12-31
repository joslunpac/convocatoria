import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModoEnum } from '../../../../core/enumerates';
import { Caracter, Entidad, Lugar, TipoBanda, TipoEntidad } from '../../../../core/interfaces';
import { CaracterService, EntidadService, LugarService, TipoBandaService, TipoEntidadService } from '../../../../core/services';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsChart } from '../../../../shared/utils';

/**
 * Detalle de entidad
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá entrar en modo lectura y escritura
 * El rol [MODERADOR] solo podrá entrar en modo lectura
 */
@Component({
  selector: 'app-entidad-detalle',
  templateUrl: './entidad-detalle.component.html'
})
export class EntidadDetalleComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Parámetros recibidos
  modo: string;
  entidad: Entidad;

  // Atributos del modo
  modoCrear: boolean = false;
  modoVer: boolean = false;
  modoEditar: boolean = false;

  // Atributos de la pantalla
  tituloPagina: string = '';

  // Atributo para el formulario de detalle
  form: FormGroup;

  // Atributos de los selects
  tiposEntidad: TipoEntidad[] = [];
  caracteresId: number[] = [];
  caracteres: Caracter[] = [];
  tiposBanda: TipoBanda[] = [];
  tiposBandaFiltro: TipoBanda[] = [];
  lugares: Lugar[] = [];
  lugaresFiltro: Lugar[] = [];

  constructor(
    public dialogo: MatDialogRef<EntidadDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private carService: CaracterService,
    private entService: EntidadService,
    private lugService: LugarService,
    private tbaService: TipoBandaService,
    private tenService: TipoEntidadService,
  ) {
    // Inicializamos los parámetros
    this.modo = data.modo;
    this.entidad = data.objeto;

    // Inicializamos los atributos del título
    this.tituloPagina = this.modo + ' ' + AC.ENTIDAD.toLowerCase();

    // Inicializamos los atributos del modo
    if (this.modo == ModoEnum.VER) {
      this.modoVer = true;
    } else if(this.modo == ModoEnum.CREAR){
      this.modoCrear = true;
    } else {
      this.modoEditar = true;
    }

    // Si estamos en modo ver o editar
    if (!this.modoCrear) {
      // Obtenemos, si existen, todos los identificacores de los carácteres asociados a la entidad
      if (this.entidad.caracteres != null && this.entidad.caracteres.length > 0) {
        for (const caracter of this.entidad.caracteres) {
          this.caracteresId.push(caracter.id);
        }
      }
    }

    // Inicializamos los atributos del formulario de detalle
    this.form = this.formBuilder.group({
      codigo: new FormControl({value: this.modoCrear ? null : this.entidad.codigo, disabled: this.modoVer}, [Validators.required, Validators.maxLength(50)]),
      nombre: new FormControl({value: this.modoCrear ? null : this.entidad.nombre, disabled: this.modoVer}, [Validators.maxLength(500)]),
      nombreCorto: new FormControl({value: this.modoCrear ? null : this.entidad.nombreCorto, disabled: this.modoVer}, [Validators.required, Validators.maxLength(50)]),
      nombreCortoAux: new FormControl({value: this.modoCrear ? null : this.entidad.nombreCortoAux, disabled: this.modoVer}, [Validators.maxLength(50)]),
      tipoEntidad: new FormControl({value: this.modoCrear ? null : this.entidad.tipoEntidad.id, disabled: this.modoVer}, [Validators.required]),
      caracterPrincipal: new FormControl({value: this.modoCrear ? null : (this.entidad.caracterPrincipal != null ? this.entidad.caracterPrincipal.id : null), disabled: this.modoVer}),
      caracteres : new FormControl({value: this.modoCrear ? null : this.caracteresId, disabled: this.modoVer}),
      tipoBanda: new FormControl({value: this.modoCrear ? null : (this.entidad.tipoBanda != null ? this.entidad.tipoBanda.id : null), disabled: this.modoVer}),
      lugar: new FormControl({value: this.modoCrear ? null : (this.entidad.lugar != null ? this.entidad.lugar.id : null), disabled: this.modoVer}),
      nota: new FormControl({value: this.modoCrear ? null : this.entidad.nota, disabled: this.modoVer}, [Validators.maxLength(1000)]),
      tieneAvatar: new FormControl({value: this.modoCrear ? false : this.entidad.tieneAvatar, disabled: this.modoVer}, [Validators.required]),
      visible: new FormControl({value: this.modoCrear ? true : this.entidad.visible, disabled: this.modoVer}, [Validators.required]),
      pendienteRevisar: new FormControl({value: this.modoCrear ? false : this.entidad.pendienteRevisar, disabled: this.modoVer}, [Validators.required]),
    });
  }

  ngOnInit(): void {
    // Obtenemos las listas de los selects
    this.cargarSelects();
  }

  /**
   * Método encargado de cargar las listas de los selects
   */
  cargarSelects(): void {
    // Obtenemos la lista completa de tipos de entidad
    this.tenService.findAll().subscribe((data: TipoEntidad[]) => {
      this.tiposEntidad = data;
    });

    // Obtenemos la lista completa de carácteres
    this.carService.findAll().subscribe((data: Caracter[]) => {
      this.caracteres = data;
    });

    // Obtenemos la lista completa de tipos de banda
    this.tbaService.findAll().subscribe((data: TipoBanda[]) => {
      this.tiposBanda = data;
      this.tiposBandaFiltro = this.tiposBanda != null ? this.tiposBanda.slice() : [];
    });

    // Obtenemos la lista completa de lugares
    this.lugService.findAll().subscribe((data: Lugar[]) => {
      this.lugares = data;
      this.lugaresFiltro = this.lugares != null ? this.lugares.slice() : [];
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
   * Método encargado de persistir un objeto
   */
  guardar(): void {
    const objeto = this.construirObjetoServidor();

    if (this.modoCrear) {
      // Creamos el objeto
      this.entService.create(objeto).subscribe((data: Entidad) => {
        // Cerramos el diálogo y devolvemos el objeto persistido
        this.dialogo.close(data);
      });
    } else {
      // Actualizamos el objeto
      this.entService.update(this.entidad.id, objeto).subscribe((data: Entidad) => {
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

    objeto.codigo = this.form.get('codigo')?.value;
    objeto.nombre = UtilsChart.cadenaVaciaToUndenfined(this.form.get('nombre')?.value);
    objeto.nombreCorto = this.form.get('nombreCorto')?.value;
    objeto.nombreCortoAux = UtilsChart.cadenaVaciaToUndenfined(this.form.get('nombreCortoAux')?.value);
    objeto.tipoEntidad = UtilsChart.construirObjetoConId(this.form.get('tipoEntidad')?.value);
    objeto.caracterPrincipal = UtilsChart.construirObjetoConId(this.form.get('caracterPrincipal')?.value);

    if (this.form.get('caracteres')?.value != undefined) {
      let caracteresId: any[] = [];

      for(let idCaracter of this.form.get('caracteres')?.value) {
        caracteresId.push(UtilsChart.construirObjetoConId(idCaracter));
      }

      objeto.caracteres = caracteresId;
    }

    objeto.tipoBanda = UtilsChart.construirObjetoConId(this.form.get('tipoBanda')?.value);
    objeto.lugar = UtilsChart.construirObjetoConId(this.form.get('lugar')?.value);
    objeto.nota = UtilsChart.cadenaVaciaToUndenfined(this.form.get('nota')?.value);
    objeto.tieneAvatar = this.form.get('tieneAvatar')?.value;
    objeto.visible = this.form.get('visible')?.value;
    objeto.pendienteRevisar = this.form.get('pendienteRevisar')?.value;

    return objeto;
  }
}
