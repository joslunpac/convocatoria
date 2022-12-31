import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-confirmacion-eventos',
  templateUrl: './dialogo-confirmacion-eventos.component.html',
})
export class DialogoConfirmacionEventosComponent {
  // Atributos de la pantalla
  tituloPagina: string = 'Confirmación';

  constructor(
    public dialogo: MatDialogRef<DialogoConfirmacionEventosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string; esPadre: boolean }
  ) {}

  cerrar(accion: string): void {
    this.dialogo.close(accion);
  }
}
