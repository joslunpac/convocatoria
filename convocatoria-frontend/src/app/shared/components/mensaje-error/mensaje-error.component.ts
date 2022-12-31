import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensaje-error',
  templateUrl: './mensaje-error.component.html'
})
export class MensajeErrorComponent {
  @Input() mensajeError?: string;

  constructor() {}
}
