import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModoEnum } from '../../../../core/enumerates';
import { Rol, Usuario } from '../../../../core/interfaces';
import { RolService, UsuarioService } from '../../../../core/services';
import { AppConstants as AC } from '../../../../shared/constants';
import { MyErrorStateMatcher, UtilsChart } from '../../../../shared/utils';

/**
 * Detalle de usuario
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá entrar en modo lectura y escritura
 * El rol [MODERADOR] solo podrá entrar en modo lectura
 */
@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.component.html'
})
export class UsuarioDetalleComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Parámetros recibidos
  modo: string;
  usuario: Usuario;

  // Atributos del modo
  modoCrear: boolean = false;
  modoEditar: boolean = false;

  // Atributos de la pantalla
  tituloPagina: string = '';

  // Atributo para el formulario de detalle
  form: FormGroup;

  // Atributo para los errores del servidor
  mensajeError: string | null = null;

  // Atributo para controlar la visibilidad de la contraseña
  ocultarPasword = true;

  // Atributo para la comparación de las dos contraseñas
  matcher = new MyErrorStateMatcher;

  // Atributos de los selects
  rolesId: number[] = [];
  roles: Rol[] = [];

  constructor(
    public dialogo: MatDialogRef<UsuarioDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private rolService: RolService,
    private usuService: UsuarioService
  ) {
    // Inicializamos los parámetros
    this.modo = data.modo;
    this.usuario = data.objeto;

    // Inicializamos los atributos del título
    this.tituloPagina = this.modo + ' ' + AC.USUARIO.toLowerCase();

    // Inicializamos los atributos del modo
    if (this.modo == ModoEnum.CREAR){
      this.modoCrear = true;
    } else {
      this.modoEditar = true;
    }

    // Si estamos en modo ver o editar
    if (!this.modoCrear) {
      // Obtenemos, si existen, todos los identificacores de los roles asociados al usuario
      if (this.usuario.roles != null && this.usuario.roles.length > 0) {
        for (const rol of this.usuario.roles) {
          this.rolesId.push(rol.id);
        }
      }
    }

    // Inicializamos los atributos del formulario de registro
    this.form = this.formBuilder.group({
      email: new FormControl({value: this.modoCrear ? null : this.usuario.email, disabled: false}, [Validators.required, Validators.email]),
      nombre: new FormControl({value: this.modoCrear ? null : this.usuario.nombre, disabled: false}, [Validators.required, Validators.maxLength(100)]),
      apellidos: new FormControl({value: this.modoCrear ? null : this.usuario.apellidos, disabled: false}, [Validators.required, Validators.maxLength(500)]),
      password: new FormControl({value: null, disabled: false}, [Validators.minLength(4),Validators.maxLength(40), Validators.pattern('[A-Za-z,. :0-9/()-_@]*')]),
      confirmarPassword: new FormControl({value: null, disabled: false}, []),
      roles : new FormControl({value: this.modoCrear ? null : this.rolesId, disabled: false}, [Validators.required]),
    },
    { validator: this.comprobarPasswords })
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

  ngOnInit(): void {
    // Obtenemos las listas de los selects
    this.cargarSelects();
  }

  /**
   * Método encargado de cargar las listas de los selects
   */
  cargarSelects(): void {
    // Obtenemos la lista completa de roles
    this.rolService.findAll().subscribe((data: Rol[]) => {
      this.roles = data;
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
   * Método encargado de persistir un objeto
   */
  guardar(): void {
    const objeto = this.construirObjetoServidor();

    if (this.modoCrear) {
      // Creamos el objeto
      this.usuService.create(objeto).subscribe((data: Usuario) => {
        // Cerramos el diálogo y devolvemos el objeto persistido
        this.dialogo.close(data);
      });
    } else {
      // Actualizamos el objeto
      this.usuService.update(this.usuario.id, objeto).subscribe((data: Usuario) => {
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

    objeto.email = this.form.get('email')?.value;
    objeto.nombre = this.form.get('nombre')?.value;
    objeto.apellidos = this.form.get('apellidos')?.value;
    objeto.password = this.form.get('password')?.value;

    if (this.form.get('roles')?.value != undefined) {
      let rolesId: any[] = [];

      for(let idRol of this.form.get('roles')?.value) {
        rolesId.push(UtilsChart.construirObjetoConId(idRol));
      }

      objeto.roles = rolesId;
    }

    return objeto;
  }
}
