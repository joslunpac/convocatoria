import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModoEnum } from '../../../../core/enumerates';
import { ItemOpcion, Persona } from '../../../../core/interfaces';
import { PersonaService } from '../../../../core/services';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsChart } from '../../../../shared/utils';

/**
 * Detalle de persona
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá entrar en modo lectura y escritura
 * El rol [MODERADOR] solo podrá entrar en modo lectura
 */
@Component({
  selector: 'app-persona-detalle',
  templateUrl: './persona-detalle.component.html'
})
export class PersonaDetalleComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Parámetros recibidos
  modo: string;
  persona: Persona;

  // Atributos del modo
  modoCrear: boolean = false;
  modoVer: boolean = false;
  modoEditar: boolean = false;

  // Atributos de la pantalla
  tituloPagina: string = '';

  // Atributo para el formulario de detalle
  form: FormGroup;
  generos: ItemOpcion[] = [];

  constructor(
    public dialogo: MatDialogRef<PersonaDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private perService: PersonaService
  ) {
    // Inicializamos los parámetros
    this.modo = data.modo;
    this.persona = data.objeto;

    // Inicializamos los atributos del título
    this.tituloPagina = this.modo + ' ' + AC.PERSONA.toLowerCase();

    // Inicializamos los atributos del modo
    if (this.modo == ModoEnum.VER) {
      this.modoVer = true;
    } else if(this.modo == ModoEnum.CREAR){
      this.modoCrear = true;
    } else {
      this.modoEditar = true;
    }

    // Inicializamos los atributos del formulario de detalle
    this.form = this.formBuilder.group({
      nombre: new FormControl({value: this.modoCrear ? null : this.persona.nombre, disabled: this.modoVer}, [Validators.required, Validators.maxLength(100)]),
      profesion: new FormControl({value: this.modoCrear ? null : this.persona.profesion, disabled: this.modoVer}, [Validators.maxLength(100)]),
      genero: new FormControl({value: this.modoCrear ? null : this.persona.genero, disabled: this.modoVer}, [Validators.required, Validators.maxLength(1)]),
    });
  }

  ngOnInit(): void {
    // Construimos la lista de generos
    this.generos.push({valor: AC.GENERO_MASCULINO_ACRONIMO, descripcion: AC.GENERO_MASCULINO});
    this.generos.push({valor: AC.GENERO_FEMENINO_ACRONIMO, descripcion: AC.GENERO_FEMENINO});
    this.generos.push({valor: AC.SIN_GENERO_ACRONIMO, descripcion: AC.SIN_GENERO});
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
      this.perService.create(objeto).subscribe((data: Persona) => {
        // Cerramos el diálogo y devolvemos el objeto persistido
        this.dialogo.close(data);
      });
    } else {
      // Actualizamos el objeto
      this.perService.update(this.persona.id, objeto).subscribe((data: Persona) => {
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
    objeto.profesion = UtilsChart.cadenaVaciaToUndenfined(this.form.get('profesion')?.value);
    objeto.genero = this.form.get('genero')?.value;

    return objeto;
  }
}
