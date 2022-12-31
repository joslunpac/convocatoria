import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { DialogoConfirmacionComponent } from '../../../shared/components';
import { AppConstants as AC } from '../../../shared/constants';
import { MyErrorStateMatcher, UtilsChart } from '../../../shared/utils';
import { Jwt } from '../../interfaces';
import { AuthService, CuentaService, TokenService } from '../../services';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributos para el usuario autenticado actualmente
  usuarioAutenticado: any;
  avatar: any;

  // Atributo para el formulario de perfil
  formPerfil: FormGroup;

  // Atributo para los errores del servidor
  mensajeError: string | null = null;

  // Atributo para controlar la visibilidad de la contraseña
  ocultarPasword = true;

  // Atributo para la comparación de las dos contraseñas
  matcher = new MyErrorStateMatcher;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private cuentaService: CuentaService,
    protected tokenService: TokenService
  ) {
    // Inicializamos los atributos del formulario de perfil
    this.formPerfil = this.formBuilder.group({
      email: new FormControl(null),
      nombre: new FormControl(null),
      apellidos: new FormControl(null),
      nuevoPassword: new FormControl(null),
      confirmarNuevoPassword: new FormControl(null),
    });
  }

  ngOnInit(): void {
    // La función forkJoin permite subscribirse a las funciones una vez todas hayan terminado
    forkJoin([
      // Obtenemos el usuario autenticado actualmente
      this.cuentaService.getAuthenticationUser()
    ]).subscribe(results => {
      this.usuarioAutenticado = results[0];

      // Damos valor a los atributos del perfil
      this.avatar = this.usuarioAutenticado.avatar;
      this.formPerfil.get('email')?.setValue(this.usuarioAutenticado.email);
      this.formPerfil.get('email')?.disable();
      this.formPerfil.get('nombre')?.setValue(this.usuarioAutenticado.nombre);
      this.formPerfil.get('nombre')?.setValidators([Validators.required, Validators.maxLength(100)]);
      this.formPerfil.get('apellidos')?.setValue(this.usuarioAutenticado.apellidos);
      this.formPerfil.get('apellidos')?.setValidators([Validators.required, Validators.maxLength(500)]);
      this.formPerfil.get('nuevoPassword')?.setValue(null);
      this.formPerfil.get('nuevoPassword')?.setValidators([Validators.minLength(4),Validators.maxLength(40), Validators.pattern('[A-Za-z,. :0-9/()-_@]*')]);
      this.formPerfil.get('confirmarNuevoPassword')?.setValue(null);
      this.formPerfil.validator = this.comprobarPasswords;
    });
  }

  /**
   * Método encargado de comprobar si las dos contraseñas son iguales
   */
  comprobarPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let nuevoPassword = group.get('nuevoPassword')?.value;
    let confirmarNuevoPassword = group.get('confirmarNuevoPassword')?.value

    if ((nuevoPassword === null || nuevoPassword === '') &&
      (confirmarNuevoPassword === null || confirmarNuevoPassword === '')) {
      return null;
    } else {
      return nuevoPassword === confirmarNuevoPassword ? null : { passwordsDiferentes: true }
    }
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
    return this.formPerfil.controls[campo].hasError(tipoValidacion);
  }

  /**
   * Método encargado de actualizar el los datos de perfil del usuario autenticado actualmente
   */
  actualizarPerfil(): void {
    const objeto = this.construirObjetoServidor();

    this.cuentaService.updateAuthenticationUser(objeto).subscribe({
      next: (data: Jwt) => {
        // Actualización del usuario satisfactoria

        // Guardamos el token en el almacenamiento local
        this.tokenService.guardarToken(data.token);
        // Construimos la notificación
        const mensaje = AC.USUARIO + ' actualizado correctamente';
        // Lanzamos la notificación
        this.snackBar.open(mensaje, 'OK');
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  /**
   * Método encargado de eliminar la cuenta del usuario autenticado actualmente
   */
  eliminarCuenta(): void {
    // Abrimos el diálogo
    const dialogoEliminar = this.dialog.open(DialogoConfirmacionComponent, {
        data: { mensaje: UtilsChart.construirConfirmacion('Cuenta de usuario', false) }
    })

    // Cuando cerramos el diálogo
    dialogoEliminar.afterClosed().subscribe((confirmado: Boolean) => {
      if (confirmado) {
        // Si se ha confirmado la eliminación, eliminamos el objeto
        this.cuentaService.delete().subscribe(() => {
          // Cerramos la sesión del usuario
          this.authService.signout();
        });
      }
    });
  }

  /**
   * Método encargado de construir el objeto a enviar al servidor
   */
  construirObjetoServidor(): any {
    let objeto: any = {};

    objeto.avatar = this.avatar;
    objeto.email = this.usuarioAutenticado.email;
    objeto.nombre = this.formPerfil.get('nombre')?.value;
    objeto.apellidos = this.formPerfil.get('apellidos')?.value;
    objeto.nuevoPassword = this.formPerfil.get('nuevoPassword')?.value;
    objeto.roles = this.usuarioAutenticado.roles;

    return objeto;
  }


}
