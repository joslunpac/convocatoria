import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-confirmacion',
  templateUrl: './dialogo-confirmacion.component.html'
})
export class DialogoConfirmacionComponent {
  // Atributos de la pantalla
  tituloPagina: string = 'Confirmación';

  constructor(
    public dialogo: MatDialogRef<DialogoConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mensaje: string }
  ) {}

  cerrar(accion: boolean): void {
    this.dialogo.close(accion);
  }
}
