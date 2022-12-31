import { Component, Input } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ItemAccesoDirecto } from '../../../core/interfaces';

@Component({
  selector: 'app-acceso-directo',
  templateUrl: './acceso-directo.component.html'
})
export class AccesoDirectoComponent {
  @Input() accesoDirecto?: ItemAccesoDirecto;

  constructor(private router: Router) {}

  /**
   * Método encargado de navegar a la ruta de destino
   */
  navegar(): void {
    if (this.accesoDirecto != null) {
      if (this.accesoDirecto.parametros) {
        const navigationExtras: NavigationExtras = {
          queryParams: this.accesoDirecto.parametros
        };

        // Navegamos a la ruta de destino, pasándo los parámetros de consulta
        this.router.navigate([this.accesoDirecto.ruta], navigationExtras);
      } else {
        this.router.navigate([this.accesoDirecto.ruta]);
      }
    }
  }
}
