import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppConstants as AC } from '../../../shared/constants';
import { Jwt } from '../../interfaces';
import { AuthService, TokenService } from '../../services';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./auth.component.scss']
})
export class SigninComponent {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributo para el formulario de inicio de sesión
  form: FormGroup;

  // Atributo para los errores del servidor
  mensajeError: string | null = null;

  // Atributo para controlar la visibilidad de la contraseña
  ocultarPasword = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService
  ) {
    // Inicializamos los atributos del formulario de inicio se sesión
    this.form = this.formBuilder.group({
      email: new FormControl({value: null, disabled: false}, [Validators.required, Validators.email]),
      password: new FormControl({value: null, disabled: false}, [Validators.required, Validators.minLength(4),Validators.maxLength(40), Validators.pattern('[A-Za-z,. :0-9/()-_@]*')]),
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
    return this.form.controls[campo].hasError(tipoValidacion);
  }

  /**
   * Método encargado de iniciar sesión
   */
  signin(): void {
    const objeto = this.construirObjetoServidor();

    this.authService.signin(objeto).subscribe({
      next: (data: Jwt) => {
        // Inicio de sesión satisfactorio

        // Guardamos el token en el almacenamiento local
        this.tokenService.guardarToken(data.token);

        if (this.tokenService.esAdministrador() || this.tokenService.esModerador()) {
          // Si el usuario ha iniciado sesión y posee el rol [ADMINISTRADOR] o [MODERADOR],
          // navegamos al seguimiento de la aplicación
          this.router.navigate([AC.ADMINISTRACION_ROUTE + '/' + AC.SEGUIMIENTO_ROUTE]);
        } else {
          // Si el usuario no posee el rol [ADMINISTRADOR] ni [MODERADOR],
          // navegamos a la ruta de inicio
          this.router.navigate([AC.HOME_ROUTE]);
        }
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
    objeto.password = this.form.get('password')?.value;

    return objeto;
  }
}
