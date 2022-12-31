import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModoEnum } from '../../../../core/enumerates';
import { Lugar } from '../../../../core/interfaces';
import { LugarService } from '../../../../core/services';
import { AppConstants as AC } from '../../../../shared/constants';

/**
 * Detalle de lugare
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá entrar en modo lectura y escritura
 * El rol [MODERADOR] solo podrá entrar en modo lectura
 */
@Component({
  selector: 'app-lugar-detalle',
  templateUrl: './lugar-detalle.component.html'
})
export class LugarDetalleComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Parámetros recibidos
  modo: string;
  lugar: Lugar;

  // Atributos del modo
  modoCrear: boolean = false;
  modoVer: boolean = false;
  modoEditar: boolean = false;

  // Atributos de la pantalla
  tituloPagina: string = '';

  // Atributo para el formulario de detalle
  form: FormGroup;

  constructor(
    public dialogo: MatDialogRef<LugarDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private lugService: LugarService
  ) {
    // Inicializamos los parámetros
    this.modo = data.modo;
    this.lugar = data.objeto;

    // Inicializamos los atributos del título
    this.tituloPagina = this.modo + ' ' + AC.LUGAR.toLowerCase();

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
      nombre: new FormControl({value: this.modoCrear ? null : this.lugar.nombre, disabled: this.modoVer}, [Validators.required, Validators.maxLength(100)]),
      direccion: new FormControl({value: this.modoCrear ? null : this.lugar.direccion, disabled: this.modoVer}, [Validators.required, Validators.maxLength(500)]),
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
      this.lugService.create(objeto).subscribe((data: Lugar) => {
        // Cerramos el diálogo y devolvemos el objeto persistido
        this.dialogo.close(data);
      });
    } else {
      // Actualizamos el objeto
      this.lugService.update(this.lugar.id, objeto).subscribe((data: Lugar) => {
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
    objeto.direccion = this.form.get('direccion')?.value;

    return objeto;
  }
}
