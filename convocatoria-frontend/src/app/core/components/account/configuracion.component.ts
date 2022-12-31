import { Component } from '@angular/core';
import { AppConstants as AC } from '../../../shared/constants';
import { TemaService } from '../../services';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html'
})
export class ConfiguracionComponent {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributos para el usuario autenticado actualmente
  usuarioAutenticado: any;

  constructor(
    protected temaService: TemaService,
  ) {}

  /**
   * Método encargado de cambiar el tema de la aplicación
   */
  cambiarTema(): void {
    // Comprobamos cual es el tema activo
    if (this.temaService.comprobarSiTemaOscuro()) {
      // Si el tema activo es el oscuro, aplicamos el tema claro
      this.temaService.aplicarTemaClaro();
    } else {
      // Si el tema activo es el claro, aplicamos el tema oscuro
      this.temaService.aplicarTemaOscuro();
    }
  }
}
