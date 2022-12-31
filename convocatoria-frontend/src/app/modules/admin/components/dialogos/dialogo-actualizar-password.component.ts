import { Component, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Usuario } from '../../../../core/interfaces';
import { UsuarioService } from '../../../../core/services';
import { AppConstants as AC } from '../../../../shared/constants';
import { MyErrorStateMatcher } from '../../../../shared/utils';

@Component({
  selector: 'app-actualizar-password',
  templateUrl: './dialogo-actualizar-password.component.html',
})
export class DialogoActualizarPasswordComponent {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributos de la pantalla
  tituloPagina: string = 'Actualizar contraseña';

  // Atributo para el formulario de registro
  form: FormGroup;

  // Atributo para los errores del servidor
  mensajeError: string | null = null;

  // Atributo para la comparación de las dos contraseñas
  matcher = new MyErrorStateMatcher;

  constructor(
    public dialogo: MatDialogRef<DialogoActualizarPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number; email: string; },
    private formBuilder: FormBuilder,
    private usuService: UsuarioService
  ) {
    // Inicializamos los atributos del formulario de registro
    this.form = this.formBuilder.group({
        nuevoPassword: new FormControl({ value: null, disabled: false }, [Validators.required, Validators.minLength(4), Validators.maxLength(40), Validators.pattern('[A-Za-z,. :0-9/()-_@]*')]),
        confirmarNuevoPassword: new FormControl({ value: null, disabled: false }, []),
      },
      { validator: this.comprobarPasswords }
    );
  }

  /**
   * Método encargado de comprobar si las dos contraseñas son iguales
   */
  comprobarPasswords: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    let nuevoPassword = group.get('nuevoPassword')?.value;
    let confirmarNuevoPassword = group.get('confirmarNuevoPassword')?.value;

    if ((nuevoPassword === null || nuevoPassword === '') &&
      (confirmarNuevoPassword === null || confirmarNuevoPassword === '')) {
      return null;
    } else {
      return nuevoPassword === confirmarNuevoPassword ? null : { passwordsDiferentes: true }
    }
  };

  /**
   * Método encargado de comprobar si se cumple una validación
   * Solo se comprueba la validación si es modo Crear o Editar
   *
   * @param campo Campo sobre el que se realiza la validación
   * @param tipoValidacion Tipo de validación que se comprueba
   * @returns
   */
  mostrarValidacion(campo: string, tipoValidacion: string) {
    return this.form.controls[campo].hasError(tipoValidacion);
  }

  /**
   * Método encargado de actualizar la contraseña del usuario
   */
  guardar(): void {
    this.usuService.updatePassword(this.data.id, this.form.get('nuevoPassword')?.value).subscribe({
      next: (data: Usuario) => {
        // Cerramos el diálogo y devolvemos el usuario actualizado
        this.dialogo.close(data);
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }
}
