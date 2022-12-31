import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants as AC } from '../../../shared/constants';
import { MyErrorStateMatcher } from '../../../shared/utils';
import { Jwt } from '../../interfaces';
import { AuthService, TokenService } from '../../services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./auth.component.scss']
})
export class SignupComponent {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributo para el formulario de registro
  form: FormGroup;

  // Atributo para los errores del servidor
  mensajeError: string | null = null;

  // Atributo para controlar la visibilidad de la contraseña
  ocultarPasword = true;

  // Atributo para la comparación de las dos contraseñas
  matcher = new MyErrorStateMatcher;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    // Inicializamos los atributos del formulario de registro
    this.form = this.formBuilder.group({
      email: new FormControl({value: null, disabled: false}, [Validators.required, Validators.email]),
      nombre: new FormControl({value: null, disabled: false}, [Validators.required, Validators.maxLength(100)]),
      apellidos: new FormControl({value: null, disabled: false}, [Validators.required, Validators.maxLength(500)]),
      password: new FormControl({value: null, disabled: false}, [Validators.required, Validators.minLength(4),Validators.maxLength(40), Validators.pattern('[A-Za-z,. :0-9/()-_@]*')]),
      confirmarPassword: new FormControl({value: null, disabled: false}, []),
    },
    { validator: this.comprobarPasswords });
  }

  /**
   * Método encargado de comprobar si las dos contraseñas son iguales
   */
  comprobarPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let password = group.get('password')?.value;
    let confirmarPassword = group.get('confirmarPassword')?.value

    if ((password === null || password === '') &&
      (confirmarPassword === null || confirmarPassword === '')) {
      return null;
    } else {
      return password === confirmarPassword ? null : { passwordsDiferentes: true }
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
    return this.form.controls[campo].hasError(tipoValidacion);
  }

  /**
   * Método encargado de registrar un usuario
   */
  signup(): void {
    const objeto = this.construirObjetoServidor();

    this.authService.signup(objeto).subscribe({
      next: (data: Jwt) => {
        // Inicio de sesión satisfactorio

        // Guardamos el token en el almacenamiento local
        this.tokenService.guardarToken(data.token);

        // Navegamos a la ruta de inicio
        this.router.navigate([AC.HOME_ROUTE]);
      },
      error: (error) => {
        this.mensajeError = error.message;
      }
    });
  }

  /**
   * Método encargado de construir el objeto a enviar al servidor
   */
  construirObjetoServidor(): any {
    let objeto: any = {};

    objeto.email = this.form.get('email')?.value;
    objeto.nombre = this.form.get('nombre')?.value;
    objeto.apellidos = this.form.get('apellidos')?.value;
    objeto.password = this.form.get('password')?.value;

    return objeto;
  }
}
