import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModoEnum } from '../../../../core/enumerates';
import { Caracter } from '../../../../core/interfaces';
import { CaracterService } from '../../../../core/services';
import { AppConstants as AC } from '../../../../shared/constants';

/**
 * Detalle de carácter
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá entrar en modo lectura y escritura
 * El rol [MODERADOR] solo podrá entrar en modo lectura
 */
@Component({
  selector: 'app-caracter-detalle',
  templateUrl: './caracter-detalle.component.html'
})
export class CaracterDetalleComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Parámetros recibidos
  modo: string;
  caracter: Caracter;

  // Atributos del modo
  modoCrear: boolean = false;
  modoVer: boolean = false;
  modoEditar: boolean = false;

  // Atributos de la pantalla
  tituloPagina: string = '';

  // Atributo para el formulario de detalle
  form: FormGroup;

  constructor(
    public dialogo: MatDialogRef<CaracterDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private carService: CaracterService
  ) {
    // Inicializamos los parámetros
    this.modo = data.modo;
    this.caracter = data.objeto;

    // Inicializamos los atributos del título
    this.tituloPagina = this.modo + ' ' + AC.CARACTER.toLowerCase();

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
      acronimo: new FormControl({value: this.modoCrear ? null : this.caracter.acronimo, disabled: this.modoVer}, [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
      nombre: new FormControl({value: this.modoCrear ? null : this.caracter.nombre, disabled: this.modoVer}, [Validators.required, Validators.maxLength(50)]),
    });
  }

  ngOnInit(): void {}

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
      this.carService.create(objeto).subscribe((data: Caracter) => {
        // Cerramos el diálogo y devolvemos el objeto persistido
        this.dialogo.close(data);
      });
    } else {
      // Actualizamos el objeto
      this.carService.update(this.caracter.id, objeto).subscribe((data: Caracter) => {
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

    objeto.acronimo = this.form.get('acronimo')?.value;
    objeto.nombre = this.form.get('nombre')?.value;

    return objeto;
  }
}
