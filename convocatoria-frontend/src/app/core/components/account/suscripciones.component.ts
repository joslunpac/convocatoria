import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AppConstants as AC } from '../../../shared/constants';
import { CuentaService } from '../../services';

@Component({
  selector: 'app-suscripciones',
  templateUrl: './suscripciones.component.html'
})
export class SuscripcionesComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Atributos para el usuario autenticado actualmente
  usuarioAutenticado: any;

  constructor(
    private cuentaService: CuentaService,
  ) {}

  ngOnInit(): void {
    // La función forkJoin permite subscribirse a las funciones una vez todas hayan terminado
    forkJoin([
      // Obtenemos el usuario autenticado actualmente
      this.cuentaService.getAuthenticationUser()
    ]).subscribe(results => {
      this.usuarioAutenticado = results[0];
    });
  }
}
