import { Component, OnInit } from '@angular/core';
import { AppConstants as AC } from '../../../../shared/constants';

/**
 * Dashboard común
 *
 * Podrán acceder todos los usuarios logados
 */
@Component({
  selector: 'app-dashboard-comun',
  templateUrl: './dashboard-comun.component.html'
})
export class DashboardComunComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributos de la pantalla
  tituloPagina: string = AC.SEGUIMIENTO;

  constructor() {}

  ngOnInit(): void {}
}
